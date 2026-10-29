import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
          <Leaf className="h-8 w-8" />
        </div>

        <h1 className="text-4xl font-black text-stone-900 dark:text-stone-100">
          404
        </h1>

        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200">
          Page Not Found
        </h2>

        <p className="text-xs text-stone-500 dark:text-stone-400">
          The requested surplus coordination page or listing does not exist or has been relocated.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

