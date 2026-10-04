import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  phone: '',
  agreeToTerms: false,
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!form.agreeToTerms) {
      nextErrors.agreeToTerms = 'You must agree to the Terms and Privacy Policy.';
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
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone,
      });
      navigate('/login', { replace: true });
    } catch (error) {
      setErrors({ form: error.message || 'Something went wrong while creating your account.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="hidden overflow-hidden rounded-l-[32px] bg-sky-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-sky-400/40 bg-sky-900/40 px-3 py-1.5 text-sm font-medium text-sky-100">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Medical AI Research
              </div>
              <h1 className="max-w-md text-4xl font-semibold leading-tight">Create your retinal analysis account</h1>
              <p className="mt-4 max-w-md text-base leading-7 text-sky-100/80">
                Join a research-focused platform designed for diabetic retinopathy assessment, image review, and transparent explainability.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-400/25 bg-sky-900/30 p-5 backdrop-blur-sm">
              <p className="text-lg font-semibold">Secure onboarding</p>
              <p className="mt-2 text-sm text-sky-100/75">
                Your profile and image history remain organized and ready for future clinical review workflows.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <p className="section-label">Create account</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Register</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Set up your account to begin reviewing retinal fundus images.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  className="input-field"
                  aria-invalid={Boolean(errors.fullName)}
                />
                {errors.fullName && <p className="mt-1 text-sm text-rose-600">{errors.fullName}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      className="input-field pr-11"
                      aria-invalid={Boolean(errors.password)}
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
                  {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="input-field pr-11"
                      aria-invalid={Boolean(errors.confirmPassword)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="mb-2 block text-sm font-medium text-slate-700">Date of Birth (Optional)</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>I agree to the Terms and Privacy Policy.</span>
              </label>
              {errors.agreeToTerms && <p className="text-sm text-rose-600">{errors.agreeToTerms}</p>}

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
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-sky-600 transition hover:text-sky-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
