import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Users,
  Search,
  KeyRound,
  ShieldAlert,
  UserCheck,
  UserX,
  Eye,
  RefreshCw,
  Copy,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

const UsersSection = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  // View modal
  const [viewUser, setViewUser] = useState(null);

  // New Code display modal
  const [newCodeData, setNewCodeData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Confirm dialog
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    confirmVariant: 'danger',
    action: null,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const res = await adminApi.getUsers(params);
      if (res.data?.results) {
        setUsers(res.data.results);
        setTotalCount(res.data.count);
      } else {
        setUsers(res.data);
        setTotalCount(res.data.length);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = (user) => {
    if (user.role === 'DEVELOPER') {
      alert('Developer accounts are managed strictly via CLI.');
      return;
    }

    const nextState = !user.is_active;
    setConfirmConfig({
      isOpen: true,
      title: `${nextState ? 'Enable' : 'Disable'} User "${user.email}"?`,
      message: nextState
        ? 'The user will immediately regain authentication rights.'
        : 'The user will be immediately logged out and forbidden from obtaining valid auth sessions.',
      confirmText: nextState ? 'Enable Account' : 'Disable Account',
      confirmVariant: nextState ? 'primary' : 'danger',
      action: async () => {
        await adminApi.updateUser(user.id, { is_active: nextState });
        fetchUsers();
      },
    });
  };

  const handleResetWorkerCode = (user) => {
    setConfirmConfig({
      isOpen: true,
      title: `Reset Access Code for "${user.worker_name || user.username}"?`,
      message: 'This will invalidate the previous access code immediately. The worker must sign in on the till with the newly generated code.',
      confirmText: 'Generate New Code',
      confirmVariant: 'warning',
      action: async () => {
        const res = await adminApi.resetWorkerCode(user.id);
        setNewCodeData({
          worker: user,
          code: res.data.new_code,
        });
      },
    });
  };

  const handleResendVerification = (user) => {
    setConfirmConfig({
      isOpen: true,
      title: `Resend verification to "${user.email}"?`,
      message: 'A new verification code will be sent if this account is eligible. The response does not disclose eligibility.',
      confirmText: 'Resend Code',
      confirmVariant: 'primary',
      action: async () => {
        await adminApi.resendUserVerification(user.id);
        await fetchUsers();
      },
    });
  };

  const handleVerifyEmail = (user) => {
    setConfirmConfig({
      isOpen: true,
      title: `Manually verify "${user.email}"?`,
      message: 'Confirm that the account holder’s email address has been verified through an approved offline process. This action is recorded in the audit log.',
      confirmText: 'Verify Email',
      confirmVariant: 'warning',
      action: async () => {
        await adminApi.verifyUserEmail(user.id);
        await fetchUsers();
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Identity & Access Directory</span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {totalCount} Accounts
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage permissions and access states for Owners, Workers, Customers, and Developers.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by email or username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="SHOP_OWNER">Shop Owners</option>
            <option value="SHOP_WORKER">Shop Workers</option>
            <option value="CUSTOMER">Customers</option>
            <option value="DEVELOPER">Developers</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User & Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Affiliation / Shop</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                    <span>Loading directory...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    No accounts match the selected criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">#{u.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">
                        {u.first_name || u.last_name
                          ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                          : u.worker_name || u.username}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                          u.role === 'DEVELOPER'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : u.role === 'SHOP_OWNER'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                            : u.role === 'SHOP_WORKER'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300 font-medium">{u.shop_name || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.is_active
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {u.is_active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                      {['SHOP_OWNER', 'CUSTOMER'].includes(u.role) && (
                        <div className={`mt-1 text-[9px] font-semibold ${
                          u.is_email_verified
                            ? 'text-emerald-400'
                            : u.email_verification_required
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}>
                          {u.is_email_verified
                            ? 'EMAIL VERIFIED'
                            : u.email_verification_required
                            ? 'VERIFICATION REQUIRED'
                            : 'GRACE PERIOD'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setViewUser(u)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {u.role === 'SHOP_WORKER' && (
                          <button
                            onClick={() => handleResetWorkerCode(u)}
                            title="Generate New Access Code"
                            className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Reset PIN</span>
                          </button>
                        )}

                        {['SHOP_OWNER', 'CUSTOMER'].includes(u.role) && !u.is_email_verified && (
                          <>
                            <button
                              onClick={() => handleResendVerification(u)}
                              title="Send a verification code"
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-600/40 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Resend
                            </button>
                            <button
                              onClick={() => handleVerifyEmail(u)}
                              title="Manually verify after offline confirmation"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/40 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Verify
                            </button>
                          </>
                        )}

                        {u.role !== 'DEVELOPER' && (
                          <button
                            onClick={() => handleToggleActive(u)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                              u.is_active
                                ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40'
                                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/40'
                            }`}
                          >
                            {u.is_active ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Account Profile</span>
              </h3>
              <button
                onClick={() => setViewUser(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">ROLE:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{viewUser.role}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">ACTIVE:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {viewUser.is_active ? 'TRUE' : 'FALSE'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">EMAIL / IDENTIFIER:</span>
                <div className="font-mono text-slate-200 mt-0.5">{viewUser.email}</div>
              </div>
              {['SHOP_OWNER', 'CUSTOMER'].includes(viewUser.role) && (
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">EMAIL VERIFICATION:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {viewUser.is_email_verified
                      ? 'Verified'
                      : viewUser.email_verification_required
                      ? 'Required before access'
                      : 'Existing account grace period'}
                  </div>
                  {viewUser.verified_at && (
                    <div className="text-slate-500 mt-1">
                      Verified {new Date(viewUser.verified_at).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">USERNAME:</span>
                <div className="font-mono text-slate-200 mt-0.5">{viewUser.username}</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">AFFILIATED STORE:</span>
                <div className="text-slate-200 mt-0.5">{viewUser.shop_name || 'None'}</div>
              </div>

              {viewUser.role === 'SHOP_WORKER' && (
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">WORKER PERMISSIONS:</span>
                  <div className="mt-1 space-y-1 text-slate-300">
                    <div>• Invoices View: {viewUser.can_view_invoices ? 'Yes' : 'No'}</div>
                    <div>• Billing Confirm: {viewUser.can_confirm_bills ? 'Yes' : 'No'}</div>
                    <div>• Inventory Manage: {viewUser.can_manage_inventory ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">CREATED:</span>
                  <div className="text-slate-400 mt-0.5">
                    {viewUser.date_joined ? new Date(viewUser.date_joined).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">LAST SEEN:</span>
                  <div className="text-slate-400 mt-0.5">
                    {viewUser.last_login ? new Date(viewUser.last_login).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Code Display Modal */}
      {newCodeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100 text-center">
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">New Access Code Generated</h3>
            <p className="text-xs text-slate-400 mt-1">
              Give this code to worker <span className="text-white font-semibold">{newCodeData.worker.worker_name || newCodeData.worker.username}</span> to authenticate on the Till.
            </p>

            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <code className="text-lg font-mono font-bold tracking-widest text-amber-400">
                {newCodeData.code}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newCodeData.code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              This code is shown only once and cannot be recovered from the database.
            </p>

            <button
              onClick={() => setNewCodeData(null)}
              className="mt-5 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmVariant={confirmConfig.confirmVariant}
        onConfirm={async () => {
          if (confirmConfig.action) {
            await confirmConfig.action();
          }
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        }}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  );
};

export default UsersSection;
