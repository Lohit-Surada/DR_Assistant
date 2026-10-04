import { useState } from 'react';
import { Home, LogOut, Menu, Stethoscope, UserRound, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const links = isAuthenticated
    ? [
        { to: '/home', label: 'Home', icon: Home },
        { to: '/profile', label: 'Profile', icon: UserRound },
      ]
    : [
        { to: '/login', label: 'Login', icon: UserRound },
        { to: '/register', label: 'Register', icon: Stethoscope },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to={isAuthenticated ? '/home' : '/login'} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-sm ring-1 ring-sky-200">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">RetinaIQ</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated && currentUser && (
            <span className="text-sm font-medium text-slate-600">{currentUser.fullName?.split(' ')[0]}</span>
          )}
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300"
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
