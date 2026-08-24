import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, UserCheck, Mail, Phone, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CustomerDiscoveryHeader from '../components/CustomerDiscoveryHeader';

const CustomerProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  });
  const [saved, setSaved] = useState(false);

  const saveProfile = (event) => {
    event.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950 pb-20">
      <CustomerDiscoveryHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10">
        <NavLink
          to="/customer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to customer discovery</span>
        </NavLink>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 font-bold text-white text-xl shadow-lg shadow-cyan-500/20">
              {user?.first_name ? user.first_name[0].toUpperCase() : (user?.username?.[0]?.toUpperCase() || 'C')}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Customer profile</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Manage the details for your product and shop discovery account.
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">First Name</label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="First name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Last Name</label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Last name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="Phone number"
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save profile</span>
              </button>

              {saved && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Profile saved successfully.
                </span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfilePage;
