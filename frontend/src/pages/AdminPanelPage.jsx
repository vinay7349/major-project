import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Activity, FileText, CheckCircle2, Lock } from 'lucide-react';
import { authAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { TableSkeleton } from '../components/LoadingSkeleton';

const AdminPanelPage = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const usersList = [
    { id: 1, username: 'admin', email: 'admin@shopgenie.ai', role: 'ADMIN', shop_name: 'ShopGenie HQ', status: 'ACTIVE' },
    { id: 2, username: 'shopowner', email: 'owner@shopgenie.ai', role: 'SHOP_OWNER', shop_name: 'Genie Mart Downtown', status: 'ACTIVE' },
    { id: 3, username: 'customer', email: 'customer@gmail.com', role: 'CUSTOMER', shop_name: 'N/A', status: 'ACTIVE' },
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await authAPI.getAuditLogs();
      setAuditLogs(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
      setAuditLogs([
        { id: 1, username: 'admin', action: 'System Login', details: 'Admin logged into control panel', timestamp: new Date().toISOString() },
        { id: 2, username: 'shopowner', action: 'Order Created', details: 'Generated Invoice #INV-2026-001', timestamp: new Date().toISOString() },
        { id: 3, username: 'shopowner', action: 'Restock Action', details: 'Added +20 units to Almond Milk', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red/10 border border-red/30 text-rose-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> System Super Administrator Access
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-charcoal dark:text-white">
          Admin Control Center & Audit Logs
        </h1>
        <p className="text-slate dark:text-slate/80 text-xs mt-1">
          Manage system users, role privileges, and security audit logs.
        </p>
      </div>

      {/* Users Management */}
      <GlassCard className="border-charcoal space-y-4">
        <h3 className="font-bold text-slate/60 text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" /> Registered System Users & Roles
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal/80 border-b border-charcoal text-slate/80 uppercase font-semibold">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role Privilege</th>
                <th className="p-3">Shop / Store</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-charcoal/40">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-charcoal/20 text-indigo-400 flex items-center justify-center font-mono text-[10px]">
                      {u.username[0].toUpperCase()}
                    </div>
                    {u.username}
                  </td>
                  <td className="p-3 text-slate/80">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-charcoal/10 border border-charcoal/30 text-indigo-400 text-[10px] font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate/60">{u.shop_name}</td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-mutedgreen/10 text-emerald-400 text-[10px] font-bold">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Audit Log Trail */}
      <GlassCard className="border-charcoal space-y-4">
        <h3 className="font-bold text-slate/60 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> Security Audit Log Trail
        </h3>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="space-y-2 text-xs">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-charcoal/60 border border-charcoal flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-slate/80 text-[11px] block">{log.details}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-indigo-400 font-bold">{log.username || 'System'}</span>
                  <span className="text-[10px] text-slate block">{new Date(log.timestamp || Date.now()).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdminPanelPage;



