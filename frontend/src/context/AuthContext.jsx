import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../services/firebase';

const AuthContext = createContext(null);

const getAuthErrorMessage = (error) => {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
  };

  return messages[error.code] || error.message || 'Authentication failed. Please try again.';
};

const profileFromFirebaseUser = (firebaseUser, profile = {}) => ({
  id: firebaseUser.uid,
  fullName: profile.fullName || firebaseUser.displayName || '',
  email: firebaseUser.email || '',
  dateOfBirth: profile.dateOfBirth || '',
  phone: profile.phone || firebaseUser.phoneNumber || '',
  createdAt: profile.createdAt || firebaseUser.metadata.creationTime || new Date().toISOString(),
});

async function getUserProfile(firebaseUser) {
  const snapshot = await getDoc(doc(firestore, 'users', firebaseUser.uid));
  return profileFromFirebaseUser(firebaseUser, snapshot.exists() ? snapshot.data() : {});
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setCurrentUser(firebaseUser ? await getUserProfile(firebaseUser) : null);
      } catch {
        setCurrentUser(firebaseUser ? profileFromFirebaseUser(firebaseUser) : null);
      } finally {
        setIsAuthLoading(false);
      }
    });
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const result = await signInWithEmailAndPassword(auth, credentials.email.trim(), credentials.password);
      const user = await getUserProfile(result.user);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, payload.email.trim(), payload.password);
      await updateProfile(result.user, { displayName: payload.fullName.trim() });
      await setDoc(doc(firestore, 'users', result.user.uid), {
        fullName: payload.fullName.trim(),
        email: result.user.email,
        dateOfBirth: payload.dateOfBirth || '',
        phone: payload.phone || '',
        createdAt: serverTimestamp(),
      });
      await signOut(auth);
      return profileFromFirebaseUser(result.user, payload);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return Promise.reject(new Error('You must be signed in to update your profile.'));
    }

    return Promise.all([
      updateProfile(firebaseUser, { displayName: updatedUser.fullName }),
      setDoc(doc(firestore, 'users', firebaseUser.uid), {
        fullName: updatedUser.fullName,
        email: firebaseUser.email,
        dateOfBirth: updatedUser.dateOfBirth || '',
        phone: updatedUser.phone || '',
      }, { merge: true }),
    ]).then(() => setCurrentUser({ ...updatedUser, id: firebaseUser.uid, email: firebaseUser.email }));
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isAuthLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [currentUser, isAuthLoading, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}
