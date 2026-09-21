import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Mail, Clock, Save, Camera, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { useToast } from '../../../context/NotificationContext';

const ShopProfilePage = () => {
  const { addToast } = useToast();
  const [shopData, setShopData] = useState({
    shop_name: 'Genie Mart Downtown',
    description: 'Your premium retail store offering fresh products and daily essentials.',
    address: '123 Main Street, Springfield, IL 62701',
    phone: '+1 (555) 234-5678',
    email: 'shop@geniemart.com',
    is_open: true,
    opening_time: '08:00',
    closing_time: '22:00',
    categories: ['Electronics', 'Clothing', 'Home & Garden', 'Food & Beverages'],
    rating: 4.8,
    followers: 145
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(shopData);

  useEffect(() => {
    setFormData(shopData);
  }, [shopData]);

  const handleSave = () => {
    setShopData(formData);
    setIsEditing(false);
    addToast('Shop profile updated successfully!', 'success');
  };

  const handleToggleStatus = () => {
    setShopData(prev => ({ ...prev, is_open: !prev.is_open }));
    addToast(`Shop is now ${shopData.is_open ? 'closed' : 'open'}`, 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          Shop Management
        </h1>
        <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
          Manage your shop profile, hours, and contact information
        </p>
      </div>

      {/* Shop Status Banner */}
      <div className={`rounded-2xl border p-6 flex items-center justify-between ${
        shopData.is_open
          ? 'bg-mutedgreen/10 border-mutedgreen/30'
          : 'bg-red/10 border-red/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            shopData.is_open ? 'bg-mutedgreen/20' : 'bg-red/20'
          }`}>
            <Store className={`w-7 h-7 ${shopData.is_open ? 'text-mutedgreen' : 'text-red'}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy dark:text-white">{shopData.shop_name}</h2>
            <p className="text-sm text-slate/60 dark:text-slate/60">
              {shopData.is_open ? 'Currently Open' : 'Currently Closed'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleStatus}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            shopData.is_open
              ? 'bg-mutedgreen/20 text-mutedgreen hover:bg-mutedgreen/30'
              : 'bg-red/20 text-red hover:bg-red/30'
          }`}
        >
          {shopData.is_open ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          {shopData.is_open ? 'Open' : 'Closed'}
        </button>
      </div>

      {/* Shop Info Card */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-navy dark:text-white">Shop Information</h3>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber/90 transition-all"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Shop Name</label>
            <input
              type="text"
              value={formData.shop_name}
              onChange={(e) => setFormData(prev => ({ ...prev, shop_name: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            disabled={!isEditing}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Opening Time</label>
            <input
              type="time"
              value={formData.opening_time}
              onChange={(e) => setFormData(prev => ({ ...prev, opening_time: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate/60 dark:text-slate/60 block mb-2">Closing Time</label>
            <input
              type="time"
              value={formData.closing_time}
              onChange={(e) => setFormData(prev => ({ ...prev, closing_time: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60"
            />
          </div>
        </div>
      </GlassCard>

      {/* Shop Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-navy dark:text-white">{shopData.rating}</h3>
          <p className="text-xs text-slate/60 dark:text-slate/60">Average Rating</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-mutedgreen/10 border border-mutedgreen/30 text-mutedgreen flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-navy dark:text-white">{shopData.followers}</h3>
          <p className="text-xs text-slate/60 dark:text-slate/60">Followers</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-navy dark:text-white">{shopData.categories.length}</h3>
          <p className="text-xs text-slate/60 dark:text-slate/60">Categories</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default ShopProfilePage;