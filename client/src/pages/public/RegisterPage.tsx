import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Leaf, Store, Utensils, AlertCircle, ArrowRight, Building2, MapPin, Mail, Lock, User, Phone } from 'lucide-react';
import { UserRole, OrgType } from '../../types/index.js';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('donor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('restaurant_group');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        email,
        password,
        full_name: fullName,
        role,
        phone,
        organization_name: orgName,
        organization_type: orgType,
        address,
        latitude: 37.7749,
        longitude: -122.4194,
      });

      if (role === 'donor') navigate('/donor/dashboard');
      else if (role === 'recipient') navigate('/recipient/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/20">
            <Leaf className="h-6 w-6" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Join FoodRescue AI
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Create your account to start donating or rescuing surplus food
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white dark:bg-stone-900 py-8 px-6 shadow-md rounded-2xl border border-stone-200 dark:border-stone-800 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                I want to participate as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRole('donor');
                    setOrgType('restaurant_group');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    role === 'donor'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 dark:border-emerald-500'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store className={`h-4 w-4 ${role === 'donor' ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">Food Donor</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Restaurant, supermarket, hotel, or food producer
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('recipient');
                    setOrgType('food_bank');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    role === 'recipient'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 dark:border-emerald-500'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Utensils className={`h-4 w-4 ${role === 'recipient' ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">Recipient Charity</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Food bank, community kitchen, or shelter
                  </p>
                </button>
              </div>
            </div>

            {/* User Account Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Work / Org Email
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contact@organization.org"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>
            </div>

            {/* Organization Info */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                {role === 'donor' ? 'Donor Business Details' : 'Charitable Organization Details'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Organization / Facility Name
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      placeholder={role === 'donor' ? 'GreenBistro Cafe' : 'Hope Food Bank'}
                      className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
                    />
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Organization Type
                  </label>
                  <select
                    value={orgType}
                    onChange={e => setOrgType(e.target.value as OrgType)}
                    className="w-full mt-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {role === 'donor' ? (
                      <>
                        <option value="restaurant_group">Restaurant / Cafe</option>
                        <option value="grocery_chain">Supermarket / Grocery</option>
                        <option value="other">Event Caterer / Bakery</option>
                      </>
                    ) : (
                      <>
                        <option value="food_bank">Food Bank / Large Pantry</option>
                        <option value="community_kitchen">Community Soup Kitchen</option>
                        <option value="shelter">Emergency Homeless Shelter</option>
                        <option value="ngo">Charitable NGO</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Primary Location / Pickup Address
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="123 Market St, San Francisco, CA"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

