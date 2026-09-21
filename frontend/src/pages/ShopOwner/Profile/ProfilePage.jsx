import React, { useState } from 'react';
import { User, Mail, Phone, Store, MapPin, Shield, Save, Camera } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/NotificationContext';
import GlassCard from '../../../components/GlassCard';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: user?.username || 'shopowner',
    email: user?.email || 'owner@shopgenie.ai',
    first_name: user?.first_name || 'Alex',
    last_name: user?.last_name || 'Morgan',
    shop_name: user?.shop_name || 'Genie Mart Downtown',
    phone_number: user?.phone_number || '+1 (555) 234-5678',
    address: user?.address || '742 Evergreen Terrace, Springfield',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast('Profile & Shop details updated successfully!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          Store Owner Profile
        </h1>
        <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
          Manage your merchant account credentials and shop location details
        </p>
      </div>

      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-warmwhite/60 dark:border-charcoal">
          <div className="w-20 h-20 rounded-3xl bg-amber/10 border border-amber/30 flex items-center justify-center text-amber text-3xl font-extrabold">
            {formData.username[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy dark:text-white">{formData.first_name} {formData.last_name}</h2>
            <p className="text-xs text-amber font-semibold">{user?.role || 'SHOP_OWNER'}</p>
            <p className="text-xs text-slate/60 dark:text-slate/60">{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Shop Name</label>
              <input
                type="text"
                value={formData.shop_name}
                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Phone Number</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Store Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber text-white text-sm font-bold hover:bg-amber/90 transition-all"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;