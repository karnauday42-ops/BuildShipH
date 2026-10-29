import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg">
            <Leaf className="h-6 w-6" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Reset Your Password
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          We'll send you an encrypted link to reset your credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-stone-900 py-8 px-6 shadow-md rounded-2xl border border-stone-200 dark:border-stone-800">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Check Your Inbox
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                If an account exists for <span className="font-semibold text-stone-800 dark:text-stone-200">{email}</span>, password reset instructions have been dispatched.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="donor@foodrescue.ai"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 pl-10 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                Send Reset Link
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center text-xs text-stone-500 mt-4">
                Remember your password?{' '}
                <Link to="/login" className="font-bold text-emerald-600 hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

