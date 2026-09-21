import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLocationContext } from '../../../context/LocationContext';
import { useToast } from '../../../context/NotificationContext';
import { authAPI } from '../../../services/api';

const CustomerProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { areaName, radius, setLocation, setRadius } = useLocationContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    address: user?.address || '',
  });
  const [areaPreference, setAreaPreference] = useState(areaName || 'Current Location');
  const [radiusPreference, setRadiusPreference] = useState(radius);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    authAPI
      .getProfile()
      .then((response) => {
        if (!mounted) return;
        const profile = response.data?.user || response.data;
        updateProfile(profile);
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          phone_number: profile.phone_number || '',
          address: profile.address || '',
        });
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;
    let mounted = true;
    setActivityLoading(true);

    authAPI
      .getAuditLogs()
      .then((response) => {
        if (!mounted) return;
        const logs = response.data?.results || response.data || [];
        const userId = String(user.id);
        setActivity(
          logs.filter(
            (log) =>
              String(log.user) === userId ||
              String(log.user?.id) === userId ||
              log.username === user.username
          )
        );
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setActivityLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user?.id, user?.username]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveMessage('');

    try {
      const response = await authAPI.updateProfile(formData);
      const updatedUser = response.data?.user || response.data;
      updateProfile(updatedUser);
      setFormData((current) => ({
        ...current,
        first_name: updatedUser.first_name || current.first_name,
        last_name: updatedUser.last_name || current.last_name,
        email: updatedUser.email || current.email,
        phone_number: updatedUser.phone_number ?? current.phone_number,
        address: updatedUser.address ?? current.address,
      }));
      setSaveMessage('Profile updated');
      toast.success('Profile changes saved');
    } catch {
      updateProfile(formData);
      setSaveMessage('Saved on this device. The account service is unavailable.');
      toast.error('Profile could not be synced with the account service');
    } finally {
      setSaving(false);
    }
  };

  const saveLocationPreference = (event) => {
    event.preventDefault();
    const nextArea = areaPreference.trim();
    if (!nextArea) {
      toast.error('Enter a discovery area');
      return;
    }
    setLocation(null, null, nextArea);
    setRadius(Number(radiusPreference) || 5);
    toast.success('Discovery preference updated');
  };

  const handleSignOut = () => {
    logout();
    navigate('/customer/login');
  };

  const formatDate = (value) => {
    if (!value) return 'Not available';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-warmwhite pb-16 text-navy transition-colors dark:bg-navy dark:text-slate/60">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <NavLink
          to="/customer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber transition-colors hover:text-amber dark:text-amber-300 dark:hover:text-amber-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to discovery
        </NavLink>

        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-3xl border border-warmwhite/60 bg-white p-6 shadow-sm dark:border-charcoal dark:bg-charcoal">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-2xl font-extrabold text-white shadow-lg shadow-amber/20">
                {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'C'}
              </div>
              <h1 className="mt-4 text-xl font-extrabold text-navy dark:text-white">{user?.username || 'Customer'}</h1>
              <p className="mt-1 max-w-[180px] truncate text-xs text-slate dark:text-slate/80">{user?.email || 'Email not provided'}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-mutedgreen/10 px-3 py-1.5 text-[11px] font-bold text-mutedgreen dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Customer account
              </div>
            </div>

            <div className="mt-8 space-y-3 border-t border-warmwhite/60 pt-6 text-xs dark:border-charcoal">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate dark:text-slate/80">Member since</span>
                <span className="font-semibold text-navy dark:text-white">{formatDate(user?.created_at)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate dark:text-slate/80">Account ID</span>
                <span className="font-semibold text-navy dark:text-white">#{user?.id || 'Not available'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate dark:text-slate/80">Discovery area</span>
                <span className="max-w-[130px] truncate font-semibold text-navy dark:text-white">{areaName || 'Current Location'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-red transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-red/20 dark:text-rose-300 dark:hover:bg-red/40"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-warmwhite/60 bg-white p-6 shadow-sm dark:border-charcoal dark:bg-charcoal sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber dark:text-amber-300">Personal details</p>
                  <h2 className="mt-1 text-xl font-extrabold text-navy dark:text-white">Profile information</h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate dark:text-slate/80">Keep your contact details current for account access and local discovery.</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber dark:text-amber-300">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={saveProfile} className="mt-7 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate dark:text-slate/80">First name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
                      <input
                        id="first-name"
                        type="text"
                        value={formData.first_name}
                        onChange={(event) => setFormData({ ...formData, first_name: event.target.value })}
                        className="h-11 w-full rounded-xl border border-warmwhite/60 bg-warmwhite pl-10 pr-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/80 focus:border-amber focus:bg-white focus:ring-2 focus:ring-amber/10 dark:border-charcoal dark:bg-charcoal/60 dark:text-white dark:focus:bg-charcoal"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate dark:text-slate/80">Last name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
                      <input
                        id="last-name"
                        type="text"
                        value={formData.last_name}
                        onChange={(event) => setFormData({ ...formData, last_name: event.target.value })}
                        className="h-11 w-full rounded-xl border border-warmwhite/60 bg-warmwhite pl-10 pr-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/80 focus:border-amber focus:bg-white focus:ring-2 focus:ring-amber/10 dark:border-charcoal dark:bg-charcoal/60 dark:text-white dark:focus:bg-charcoal"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="profile-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate dark:text-slate/80">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
                      <input
                        id="profile-email"
                        type="email"
                        value={formData.email}
                        onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                        className="h-11 w-full rounded-xl border border-warmwhite/60 bg-warmwhite pl-10 pr-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/80 focus:border-amber focus:bg-white focus:ring-2 focus:ring-amber/10 dark:border-charcoal dark:bg-charcoal/60 dark:text-white dark:focus:bg-charcoal"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="profile-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate dark:text-slate/80">Phone number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
                      <input
                        id="profile-phone"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })}
                        className="h-11 w-full rounded-xl border border-warmwhite/60 bg-warmwhite pl-10 pr-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/80 focus:border-amber focus:bg-white focus:ring-2 focus:ring-amber/10 dark:border-charcoal dark:bg-charcoal/60 dark:text-white dark:focus:bg-charcoal"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-address" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate dark:text-slate/80">Address</label>
                  <textarea
                    id="profile-address"
                    value={formData.address}
                    onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                    rows="3"
                    className="w-full resize-none rounded-xl border border-warmwhite/60 bg-warmwhite p-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/80 focus:border-amber focus:bg-white focus:ring-2 focus:ring-amber/10 dark:border-charcoal dark:bg-charcoal/60 dark:text-white dark:focus:bg-charcoal"
                    placeholder="Address"
                  />
                </div>

                <div className="flex flex-col items-start justify-between gap-3 border-t border-warmwhite/60 pt-5 sm:flex-row sm:items-center dark:border-charcoal">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save profile'}
                  </button>
                  {saveMessage && (
                    <span className={`text-[11px] font-semibold ${saveMessage.startsWith('Saved on') ? 'text-amber dark:text-amber-300' : 'text-mutedgreen dark:text-emerald-300'}`}>
                      {saveMessage}
                    </span>
                  )}
                </div>
              </form>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-warmwhite/60 bg-white p-6 shadow-sm dark:border-charcoal dark:bg-charcoal">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber dark:text-amber-300">Account settings</p>
                    <h2 className="mt-1 text-lg font-extrabold text-navy dark:text-white">Access and preferences</h2>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mutedgreen/10 text-mutedgreen dark:text-emerald-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-warmwhite p-3 dark:bg-charcoal/50">
                    <span className="text-slate dark:text-slate/80">Role</span>
                    <span className="font-bold text-navy dark:text-white">{user?.role === 'CUSTOMER' ? 'Customer' : user?.role || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-warmwhite p-3 dark:bg-charcoal/50">
                    <span className="text-slate dark:text-slate/80">Username</span>
                    <span className="max-w-[160px] truncate font-bold text-navy dark:text-white">{user?.username || 'Not available'}</span>
                  </div>
                  <NavLink
                    to="/forgot-password"
                    className="flex items-center justify-between gap-3 rounded-xl border border-warmwhite/60 p-3 font-bold text-charcoal transition-colors hover:border-amber hover:text-amber dark:border-charcoal dark:text-slate/60 dark:hover:border-amber dark:hover:text-amber-300"
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-amber dark:text-amber-300" />
                      Password reset
                    </span>
                    <span className="text-[10px] text-slate/80">Open</span>
                  </NavLink>
                </div>
              </section>

              <section className="rounded-3xl border border-warmwhite/60 bg-white p-6 shadow-sm dark:border-charcoal dark:bg-charcoal">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber dark:text-amber-300">Discovery</p>
                    <h2 className="mt-1 text-lg font-extrabold text-navy dark:text-white">Location preferences</h2>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber dark:text-amber-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <form onSubmit={saveLocationPreference} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="discovery-area" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate dark:text-slate/80">Preferred area</label>
                    <input
                      id="discovery-area"
                      type="text"
                      value={areaPreference}
                      onChange={(event) => setAreaPreference(event.target.value)}
                      className="h-11 w-full rounded-xl border border-warmwhite/60 bg-warmwhite px-3 text-sm text-navy outline-none transition-colors focus:border-amber focus:bg-white focus:ring-2 focus:ring-amber/10 dark:border-charcoal dark:bg-charcoal/60 dark:text-white dark:focus:bg-charcoal"
                      placeholder="Neighborhood or area"
                    />
                  </div>
                  <div>
                    <label htmlFor="discovery-radius" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate dark:text-slate/80">Search radius</label>
                    <select
                      id="discovery-radius"
                      value={radiusPreference}
                      onChange={(event) => setRadiusPreference(event.target.value)}
                      className="h-11 w-full rounded-xl border border-warmwhite/60 bg-warmwhite px-3 text-sm text-navy outline-none transition-colors focus:border-amber focus:bg-white focus:ring-2 focus:ring-amber/10 dark:border-charcoal dark:bg-charcoal/60 dark:text-white dark:focus:bg-charcoal"
                    >
                      <option value="1">1 km</option>
                      <option value="2">2 km</option>
                      <option value="5">5 km</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl border border-warmwhite/60 px-4 py-2.5 text-xs font-bold text-charcoal transition-colors hover:border-amber hover:text-amber dark:border-charcoal dark:text-slate/60 dark:hover:border-amber dark:hover:text-amber-300"
                  >
                    <MapPin className="h-4 w-4" />
                    Save preference
                  </button>
                </form>
              </section>
            </div>

            <section className="rounded-3xl border border-warmwhite/60 bg-white p-6 shadow-sm dark:border-charcoal dark:bg-charcoal">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber dark:text-amber-300">Account history</p>
                  <h2 className="mt-1 text-lg font-extrabold text-navy dark:text-white">Recent activity</h2>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal text-white dark:bg-charcoal">
                  <Bell className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <div className="mt-5">
                {activityLoading ? (
                  <div className="rounded-xl border border-dashed border-warmwhite/60 p-5 text-center text-xs text-slate dark:border-charcoal dark:text-slate/80">Loading account activity...</div>
                ) : activity.length > 0 ? (
                  <div className="space-y-3">
                    {activity.slice(0, 6).map((item) => (
                      <div key={item.id || `${item.action}-${item.timestamp}`} className="flex items-start justify-between gap-4 rounded-xl border border-warmwhite/60 bg-warmwhite p-4 dark:border-charcoal dark:bg-charcoal/40">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-navy dark:text-white">{item.action || 'Account activity'}</p>
                          {item.details && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate dark:text-slate/80">{item.details}</p>}
                        </div>
                        <span className="shrink-0 text-[10px] font-semibold text-slate/80">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-warmwhite/60 p-5 text-center text-xs text-slate dark:border-charcoal dark:text-slate/80">
                    No recent account activity is available yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfilePage;



