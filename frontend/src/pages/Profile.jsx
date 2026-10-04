import { useEffect, useState } from 'react';
import { Camera, LogOut, Mail, Phone, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (currentUser) {
      setForm({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth || '',
      });
    }
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      ...form,
    };

    updateUser(updatedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="medical-card overflow-hidden">
        <div className="bg-gradient-to-r from-sky-700 to-cyan-600 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-2xl font-semibold shadow-lg">
                {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-sky-100">Profile</p>
                <h1 className="mt-2 text-3xl font-semibold">{currentUser.fullName || 'User'}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="section-label">Personal Information</p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Date of Birth</label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="section-label">Account Information</p>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <span className="font-medium">Account status</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <span className="font-medium">Role</span>
                  <span>Research User</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <span className="font-medium">Member since</span>
                  <span>{new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-500"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
                >
                  Save Changes
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-sky-50 p-4 text-sm leading-6 text-slate-700">
              <div className="flex items-center gap-2 text-sky-700">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">Research note</span>
              </div>
              <p className="mt-2">
                AI-generated results are intended for research and educational purposes only and should not be used as a substitute for professional medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
