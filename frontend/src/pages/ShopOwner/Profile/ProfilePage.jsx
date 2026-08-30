import React, { useState } from 'react';
import { User, Mail, Phone, Store, MapPin, Shield, Save } from 'lucide-react';
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
        <h1 className="text-3xl font-extrabold text-white">Store Owner Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your merchant account credentials and shop location details.</p>
      </div>

      <GlassCard className="bg-slate-900/70 border-slate-800 p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
            {formData.username[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{formData.first_name} {formData.last_name}</h2>
            <p className="text-xs text-indigo-400 font-semibold">{user?.role || 'SHOP_OWNER'}</p>
            <p className="text-xs text-slate-400">{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Shop Name</label>
              <input
                type="text"
                value={formData.shop_name}
                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Store Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <button
            type="submit"
            className="gradient-btn-primary px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;
