import { useEffect, useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email: form.email, password: form.password });
      navigate('/home', { replace: true });
    } catch (error) {
      setErrors({ form: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-sky-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_50%)]" aria-hidden="true" />
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-sky-400/40 bg-sky-900/40 px-3 py-1.5 text-sm font-medium text-sky-100">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Medical AI Platform
            </div>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight">AI-assisted diabetic retinopathy analysis</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-sky-100/80">
              Review fundus images, detect retinal abnormalities, and understand model decisions with a clinician-friendly workflow.
            </p>
          </div>

          <div className="relative z-10 rounded-3xl border border-sky-400/25 bg-sky-900/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-6 w-6 text-sky-200" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-semibold">Clinical analysis workflow</p>
                <p className="text-sm text-sky-100/75">Secure, explainable, and research-focused.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="section-label">Welcome</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Welcome Back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sign in to continue to your retinal analysis dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="input-field"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className="mt-1 text-sm text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="input-field pr-11"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && <p id="password-error" className="mt-1 text-sm text-rose-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Remember me
                </label>
                <button type="button" className="font-medium text-sky-600 transition hover:text-sky-700">
                  Forgot password?
                </button>
              </div>

              {errors.form && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errors.form}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-400"
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-sky-600 transition hover:text-sky-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
