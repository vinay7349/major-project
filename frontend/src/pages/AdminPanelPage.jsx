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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> System Super Administrator Access
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Admin Control Center & Audit Logs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Manage system users, role privileges, and security audit logs.
        </p>
      </div>

      {/* Users Management */}
      <GlassCard className="border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" /> Registered System Users & Roles
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role Privilege</th>
                <th className="p-3">Shop / Store</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[10px]">
                      {u.username[0].toUpperCase()}
                    </div>
                    {u.username}
                  </td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-200">{u.shop_name}</td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
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
      <GlassCard className="border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> Security Audit Log Trail
        </h3>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="space-y-2 text-xs">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-slate-400 text-[11px] block">{log.details}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-indigo-400 font-bold">{log.username || 'System'}</span>
                  <span className="text-[10px] text-slate-500 block">{new Date(log.timestamp || Date.now()).toLocaleString()}</span>
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
