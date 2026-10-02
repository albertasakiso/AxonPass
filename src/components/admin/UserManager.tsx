/* ===================================================================
   AXONPASS — Enterprise User & Access Management Studio
   Super Admin & Owner capabilities:
   - Create accounts for others with role assignment
   - Hard password reset & temporary credentials
   - Suspend / Unsuspend user accounts
   - Process self-service account deletion requests
   - Permanent account removal & progress purging
   =================================================================== */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import type { UserProfile, Certification } from '../../types';

interface UserManagerProps {
  certifications?: Certification[];
}

export const UserManager: React.FC<UserManagerProps> = ({ certifications = [] }) => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'learner' | 'admin' | 'owner'>('learner');
  const [newCertId, setNewCertId] = useState<string>('');

  const [resetNewPassword, setResetNewPassword] = useState('');

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setFeedback({ type: 'error', message: `Could not load users: ${error.message}` });
      } else if (data) {
        setUsers(data as UserProfile[]);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error fetching users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // 1. Create New User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc('admin_create_user', {
        p_email: newEmail.trim().toLowerCase(),
        p_password: newPassword,
        p_full_name: newFullName.trim() || null,
        p_role: newRole,
        p_target_cert_id: newCertId || null,
      });

      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', `✓ Successfully created account for ${newEmail} with role '${newRole}'.`);
        setIsCreateModalOpen(false);
        setNewEmail('');
        setNewFullName('');
        setNewPassword('');
        await fetchUsers();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create user account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Hard Reset Password
  const handleHardResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc('admin_hard_reset_password', {
        p_user_id: selectedUser.id,
        p_new_password: resetNewPassword,
      });

      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', `✓ Hard reset password for ${selectedUser.email} applied successfully.`);
        setIsResetPasswordModalOpen(false);
        setResetNewPassword('');
        setSelectedUser(null);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Suspend / Unsuspend User
  const handleToggleSuspend = async (user: UserProfile) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      const { error } = await supabase.rpc('admin_set_user_status', {
        p_user_id: user.id,
        p_status: nextStatus,
      });

      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', `✓ User ${user.email} marked as ${nextStatus}.`);
        await fetchUsers();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user status.');
    }
  };

  // 4. Change Role
  const handleChangeRole = async (userId: string, targetRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: targetRole })
        .eq('id', userId);

      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', `✓ Role updated to ${targetRole}.`);
        await fetchUsers();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update role.');
    }
  };

  // 5. Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc('admin_delete_user', {
        p_user_id: selectedUser.id,
      });

      if (error) {
        showNotification('error', error.message);
      } else {
        showNotification('success', `✓ User account ${selectedUser.email} has been permanently deleted.`);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await fetchUsers();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Users list
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && (u.status || 'active') !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchName = u.full_name?.toLowerCase().includes(q);
      return matchEmail || matchName;
    }
    return true;
  });

  const deletionRequests = users.filter((u) => u.status === 'deletion_requested');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Top Banner & KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
        <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 'bold' }}>
            👥 Total Registered
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
            {users.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>Verified accounts</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 'bold' }}>
            🎓 Active Learners
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
            {users.filter((u) => (u.status || 'active') === 'active' && u.role === 'learner').length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>Currently studying</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 'bold' }}>
            🛡️ Administrators &amp; Owners
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
            {users.filter((u) => u.role === 'owner' || u.role === 'admin').length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>System operators</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: deletionRequests.length > 0 ? '#fef2f2' : 'var(--color-bg)', borderColor: deletionRequests.length > 0 ? '#f87171' : 'var(--border-color)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: deletionRequests.length > 0 ? '#991b1b' : 'var(--color-ink-muted)', fontWeight: 'bold' }}>
            ⚠️ Deletion Requests
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: deletionRequests.length > 0 ? '#dc2626' : 'var(--color-ink-muted)', marginTop: '4px' }}>
            {deletionRequests.length}
          </div>
          <div style={{ fontSize: '11px', color: deletionRequests.length > 0 ? '#991b1b' : 'var(--color-ink-muted)' }}>
            {deletionRequests.length > 0 ? 'Action required' : 'None pending'}
          </div>
        </div>
      </div>

      {/* Action Notifications */}
      {feedback && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${feedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Pending Deletion Requests Alert Banner */}
      {deletionRequests.length > 0 && (
        <div
          className="card"
          style={{
            padding: '14px 18px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fda4af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: '#9f1239', fontSize: '14px' }}>
              ⚠️ {deletionRequests.length} User Account Deletion Request{deletionRequests.length > 1 ? 's' : ''} Pending
            </div>
            <div style={{ fontSize: '12px', color: '#be123c', marginTop: '2px' }}>
              Learners have requested permanent removal of their accounts and personal data.
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('deletion_requested')}
            className="btn btn-sm btn-primary"
            style={{ backgroundColor: '#e11d48', borderColor: '#e11d48', fontSize: '12px', fontWeight: 'bold' }}
          >
            Review Deletion Requests →
          </button>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          backgroundColor: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search users by name or email..."
            className="input"
            style={{ width: '100%', maxWidth: '320px', fontSize: '13px' }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input"
            style={{ fontSize: '12px', width: '130px' }}
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner / Super Admin</option>
            <option value="admin">Administrator</option>
            <option value="learner">Learner</option>
            <option value="student">Student</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
            style={{ fontSize: '12px', width: '150px' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="suspended">Suspended Accounts</option>
            <option value="deletion_requested">Deletion Requested</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={fetchUsers}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            title="Refresh User Roster"
          >
            <span>⟳ Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
          >
            <span>+ Create New Account</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
        {loading ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
            <div className="animate-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>⟳</div>
            <p className="text-muted" style={{ marginTop: '8px' }}>Loading registered users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
            <p className="text-muted">No user accounts found matching your filter criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 16px' }}>User Details</th>
                  <th style={{ padding: '10px 16px' }}>Role</th>
                  <th style={{ padding: '10px 16px' }}>Status</th>
                  <th style={{ padding: '10px 16px' }}>Study Stats</th>
                  <th style={{ padding: '10px 16px' }}>Registered</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right' }}>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  const isSuspended = u.status === 'suspended';
                  const isDeletionReq = u.status === 'deletion_requested';

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: isDeletionReq ? 'rgba(254, 226, 226, 0.25)' : isSuspended ? 'rgba(254, 243, 199, 0.25)' : 'transparent',
                      }}
                    >
                      {/* Name & Email */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: u.role === 'owner' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              flexShrink: 0,
                            }}
                          >
                            {(u.full_name || u.email || 'U').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{u.full_name || 'Unnamed User'}</span>
                              {isCurrent && (
                                <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 5px' }}>
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ color: 'var(--color-ink-muted)', fontSize: '11px' }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td style={{ padding: '12px 16px' }}>
                        <select
                          value={u.role}
                          disabled={isCurrent}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="input"
                          style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: u.role === 'owner' ? '#fef3c7' : u.role === 'admin' ? '#e0e7ff' : 'var(--color-bg-subtle)',
                            color: u.role === 'owner' ? '#92400e' : u.role === 'admin' ? '#3730a3' : 'var(--color-ink)',
                            borderColor: 'transparent',
                          }}
                        >
                          <option value="learner">Learner</option>
                          <option value="student">Student</option>
                          <option value="admin">Administrator</option>
                          <option value="owner">Owner / Super Admin</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        {isDeletionReq ? (
                          <span
                            className="badge font-bold"
                            style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                          >
                            🔴 Deletion Requested
                          </span>
                        ) : isSuspended ? (
                          <span
                            className="badge font-bold"
                            style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
                          >
                            ⏸ Suspended
                          </span>
                        ) : (
                          <span
                            className="badge font-bold"
                            style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                          >
                            ✓ Active
                          </span>
                        )}
                      </td>

                      {/* Stats */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                          <span title="Study Streak">🔥 {u.streak_days || 0}d</span>
                          <span>•</span>
                          <span title="Study Minutes">⏱ {u.total_study_minutes || 0}m</span>
                          <span>•</span>
                          <span title="Daily Target">🎯 {u.daily_study_goal_minutes || 45}m/d</span>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td style={{ padding: '12px 16px', color: 'var(--color-ink-muted)', fontSize: '11px' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* Hard Reset Password */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setResetNewPassword('');
                              setIsResetPasswordModalOpen(true);
                            }}
                            className="btn btn-xs btn-secondary"
                            title="Set a new password for this user directly"
                          >
                            🔑 Reset Password
                          </button>

                          {/* Suspend / Activate */}
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleToggleSuspend(u)}
                              className={`btn btn-xs ${isSuspended ? 'btn-success' : 'btn-secondary'}`}
                              title={isSuspended ? 'Re-activate this user account' : 'Temporarily suspend this user account'}
                            >
                              {isSuspended ? '▶ Activate' : '⏸ Suspend'}
                            </button>
                          )}

                          {/* Delete Account */}
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setIsDeleteModalOpen(true);
                              }}
                              className="btn btn-xs btn-secondary"
                              style={{ color: '#dc2626' }}
                              title="Permanently remove account and erase records"
                            >
                              🗑 Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. CREATE ACCOUNT MODAL                                         */}
      {/* ============================================================== */}
      {isCreateModalOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateModalOpen(false);
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', color: '#fff' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Create User Account</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.85 }}>
                Provision a new learner or administrator with credentials and role.
              </p>
            </div>

            <form onSubmit={handleCreateUser} style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="learner@company.com"
                  className="input"
                  style={{ width: '100%', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Samuel Amponsah"
                  className="input"
                  style={{ width: '100%', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Initial Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = Math.random().toString(36).slice(-8) + '!' + Math.floor(Math.random() * 100);
                      setNewPassword(rand);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                  >
                    🎲 Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input"
                  style={{ width: '100%', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Account Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="input"
                  style={{ width: '100%', fontSize: '13px' }}
                >
                  <option value="learner">🎓 Learner (Standard Access)</option>
                  <option value="admin">🛡️ Administrator (Manage Content &amp; Users)</option>
                  <option value="owner">👑 Owner / Super Admin (Full Root Permissions)</option>
                </select>
              </div>

              {certifications.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Assigned Track (Optional)
                  </label>
                  <select
                    value={newCertId}
                    onChange={(e) => setNewCertId(e.target.value)}
                    className="input"
                    style={{ width: '100%', fontSize: '13px' }}
                  >
                    <option value="">Default (CISA 28th Edition)</option>
                    {certifications.map((c) => (
                      <option key={c.id} value={c.id}>
                        🎯 {c.code || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HARD RESET PASSWORD MODAL                                    */}
      {/* ============================================================== */}
      {isResetPasswordModalOpen && selectedUser && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsResetPasswordModalOpen(false);
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            <div style={{ padding: '18px 22px', backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Admin Hard Password Reset</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-ink-muted)' }}>
                Target account: <strong>{selectedUser.email}</strong>
              </p>
            </div>

            <form onSubmit={handleHardResetPassword} style={{ padding: '20px 22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>New Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = Math.random().toString(36).slice(-8) + '!' + Math.floor(Math.random() * 100);
                      setResetNewPassword(rand);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                  >
                    🎲 Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="input"
                  style={{ width: '100%', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting || resetNewPassword.length < 6}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Updating...' : 'Set Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PERMANENT DELETE CONFIRMATION MODAL                          */}
      {/* ============================================================== */}
      {isDeleteModalOpen && selectedUser && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDeleteModalOpen(false);
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              padding: '24px',
              border: '1px solid #f87171',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>
                  Permanently Delete User?
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>
                  This action is irreversible.
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-ink)', marginBottom: '16px' }}>
              Are you sure you want to permanently delete the account for <strong>{selectedUser.email}</strong>?
              All associated Leitner boxes, quiz session history, and metrics will be wiped.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: '#dc2626', borderColor: '#dc2626', padding: '10px', fontSize: '13px', fontWeight: 700 }}
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '10px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
