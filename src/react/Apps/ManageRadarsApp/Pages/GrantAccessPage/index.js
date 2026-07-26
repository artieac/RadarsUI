'use strict'
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AccountAdminRepository } from 'Repositories/AccountAdminRepository';
import { isValid } from 'Apps/Common/Utilities';
import './GrantAccessPage.css';

const ROLES = [
    { id: 1, label: 'Read Only' },
    { id: 2, label: 'Radar Editor' },
    { id: 3, label: 'Account Admin' },
];

const RoleBadge = ({ roleId, roleName }) => (
    <span className={`grant-role-badge role-${roleId}`}>{roleName}</span>
);

export const GrantAccessPage = () => {
    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const subscriptionId = authenticatedUser && authenticatedUser.subscriptionId;
    const repo = new AccountAdminRepository();

    // Search state
    const [searchQuery, setSearchQuery]   = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching]   = useState(false);
    const [searchError, setSearchError]   = useState('');

    // Grant form state
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState(1);
    const [isGranting, setIsGranting]     = useState(false);
    const [grantMessage, setGrantMessage] = useState({ text: '', type: '' });

    // Grants list state
    const [grants, setGrants]             = useState([]);
    const [grantsLoading, setGrantsLoading] = useState(true);

    // Seat status state
    const [seatUsed, setSeatUsed]   = useState(0);
    const [seatLimit, setSeatLimit] = useState(null); // null = unlimited
    const atCapacity = seatLimit !== null && seatUsed >= seatLimit;

    // Inline role-edit state: maps grantId -> pendingRoleId
    const [pendingRoles, setPendingRoles] = useState({});
    const [savingRoles, setSavingRoles]   = useState({});
    const [roleMessages, setRoleMessages] = useState({});

    const loadGrants = useCallback(() => {
        if (!subscriptionId) return;
        setGrantsLoading(true);
        repo.getGrants(subscriptionId, (success, data) => {
            if (success) setGrants(data);
            setGrantsLoading(false);
        });
        repo.getSeatStatus(subscriptionId, (success, data) => {
            if (success && data) {
                setSeatUsed(data.used);
                // limit of Integer.MAX_VALUE means unlimited — treat as null
                setSeatLimit(data.limit >= 2147483647 ? null : data.limit);
            }
        });
    }, [subscriptionId]);

    useEffect(() => {
        loadGrants();
    }, []);

    // Initialise pending roles when grants load
    useEffect(() => {
        const initial = {};
        grants.forEach(g => { initial[g.id] = g.roleId; });
        setPendingRoles(initial);
    }, [grants]);

    // ── Search ──────────────────────────────────────────────────────────────

    const handleSearch = () => {
        const q = searchQuery.trim();
        if (!q) { setSearchError('Please enter a name or email to search.'); return; }
        setSearchError('');
        setIsSearching(true);
        repo.searchUsers(q, (success, data) => {
            setIsSearching(false);
            if (success) {
                setSearchResults(data);
                if (data.length === 0) setSearchError('No users found matching that query.');
            } else {
                setSearchError('Search failed. Please try again.');
            }
        });
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleSelectUser = (user) => {
        setSelectedUser(prev => (prev && prev.id === user.id) ? null : user);
        setGrantMessage({ text: '', type: '' });
    };

    // ── Grant ────────────────────────────────────────────────────────────────

    const handleGrant = () => {
        if (!selectedUser) { setGrantMessage({ text: 'Please select a user first.', type: 'danger' }); return; }
        setIsGranting(true);
        repo.grantAccess(subscriptionId, selectedUser.id, selectedRoleId, (success, data) => {
            setIsGranting(false);
            if (success) {
                setGrantMessage({ text: `Access granted to ${selectedUser.name}.`, type: 'success' });
                setSelectedUser(null);
                setSearchResults([]);
                setSearchQuery('');
                loadGrants();
            } else {
                setGrantMessage({ text: 'Failed to grant access. Please try again.', type: 'danger' });
            }
        });
    };

    // ── Revoke ───────────────────────────────────────────────────────────────

    const handleRevoke = (grant) => {
        if (!confirm(`Revoke ${grant.roleName} access from ${grant.userName}?`)) return;
        repo.revokeAccess(subscriptionId, grant.id, (success) => {
            if (success) {
                loadGrants();
            } else {
                alert('Failed to revoke access. Please try again.');
            }
        });
    };

    // ── Inline Role Change ────────────────────────────────────────────────────

    const handleRoleChange = (grantId, newRoleId) => {
        setPendingRoles(prev => ({ ...prev, [grantId]: Number(newRoleId) }));
        // Clear any previous message for this row
        setRoleMessages(prev => ({ ...prev, [grantId]: null }));
    };

    const handleSaveRole = (grant) => {
        const newRoleId = pendingRoles[grant.id];
        if (newRoleId === grant.roleId) return; // nothing changed
        setSavingRoles(prev => ({ ...prev, [grant.id]: true }));
        repo.updateGrantRole(subscriptionId, grant.id, newRoleId, (success) => {
            setSavingRoles(prev => ({ ...prev, [grant.id]: false }));
            if (success) {
                setRoleMessages(prev => ({ ...prev, [grant.id]: { text: 'Saved', type: 'success' } }));
                loadGrants();
            } else {
                setRoleMessages(prev => ({ ...prev, [grant.id]: { text: 'Failed', type: 'danger' } }));
            }
        });
    };

    // ── Filtered grants (exclude current user) ───────────────────────────────

    const visibleGrants = grants.filter(
        g => !isValid(authenticatedUser) || g.userId !== authenticatedUser.id
    );

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="grant-access-page">
            <h2>Grant Access</h2>
            <p className="page-subtitle">Search for users and grant them access to your subscription.</p>

            {/* ── Seat Capacity Alert ── */}
            {atCapacity && (
                <div className="grant-seat-alert" role="alert">
                    <span className="grant-seat-alert-icon" title="Seat limit reached">🚫</span>
                    <span className="grant-seat-alert-text">
                        <strong>Seat limit reached</strong> ({seatUsed}/{seatLimit} seats used).
                        Revoke access from an existing user or upgrade to a higher subscription tier to add more.
                    </span>
                </div>
            )}
            {!atCapacity && seatLimit !== null && (
                <div className="grant-seat-info">
                    {seatUsed}/{seatLimit} seats used
                </div>
            )}

            {/* ── Search Panel ── */}
            <div className="grant-search-panel">
                <h3>Search Users</h3>
                <div className="grant-search-input-row">
                    <input
                        id="grant-search-input"
                        type="text"
                        className="form-control"
                        placeholder={atCapacity ? 'Seat limit reached — revoke access to add more' : 'Search by name or email…'}
                        value={searchQuery}
                        onChange={e => { if (!atCapacity) { setSearchQuery(e.target.value); setSearchError(''); } }}
                        onKeyDown={handleSearchKeyDown}
                        disabled={atCapacity}
                    />
                    <button
                        id="btn-grant-search"
                        className="btn btn-techradar"
                        onClick={handleSearch}
                        disabled={isSearching || atCapacity}
                    >
                        {isSearching ? 'Searching…' : 'Search'}
                    </button>
                </div>
                {searchError && <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>{searchError}</p>}
                {searchResults.length > 0 && (
                    <div className="grant-search-results">
                        {searchResults.map(user => (
                            <button
                                key={user.id}
                                id={`grant-user-card-${user.id}`}
                                className={`grant-user-card ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
                                onClick={() => handleSelectUser(user)}
                            >
                                <div className="card-name">{user.name}</div>
                                <div className="card-email">{user.email}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Grant Form ── */}
            <div className="grant-form-panel">
                <h3>Grant Access</h3>
                {selectedUser
                    ? <span className="grant-selected-user">👤 {selectedUser.name} &lt;{selectedUser.email}&gt;</span>
                    : <span className="text-muted" style={{ fontSize: '0.88rem' }}>Select a user above to grant access.</span>
                }
                <select
                    id="grant-role-select"
                    className="form-select"
                    value={selectedRoleId}
                    onChange={e => setSelectedRoleId(Number(e.target.value))}
                    disabled={!selectedUser}
                >
                    {ROLES.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                </select>
                <button
                    id="btn-grant-access"
                    className="btn btn-techradar"
                    onClick={handleGrant}
                    disabled={!selectedUser || isGranting}
                >
                    {isGranting ? 'Granting…' : '🔑 Grant Access'}
                </button>
                {grantMessage.text && (
                    <div className={`alert alert-${grantMessage.type} py-2 mb-0 ms-2`} style={{ fontSize: '0.88rem' }}>
                        {grantMessage.text}
                    </div>
                )}
            </div>

            {/* ── Current Grants ── */}
            <div className="grant-table-panel">
                <div className="panel-header">Current Access Grants</div>
                {grantsLoading ? (
                    <div className="grant-empty-state">Loading…</div>
                ) : visibleGrants.length === 0 ? (
                    <div className="grant-empty-state">No access grants found for this subscription.</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Granted By</th>
                                <th style={{ width: 260 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleGrants.map(grant => {
                                const pending = pendingRoles[grant.id] ?? grant.roleId;
                                const isDirty = pending !== grant.roleId;
                                const isSaving = !!savingRoles[grant.id];
                                const msg = roleMessages[grant.id];
                                return (
                                    <tr key={grant.id}>
                                        <td>{grant.userName || '—'}</td>
                                        <td>{grant.userEmail || '—'}</td>
                                        <td>
                                            <div className="grant-role-edit">
                                                <select
                                                    id={`role-select-${grant.id}`}
                                                    className="form-select form-select-sm grant-inline-role-select"
                                                    value={pending}
                                                    onChange={e => handleRoleChange(grant.id, e.target.value)}
                                                    disabled={isSaving}
                                                >
                                                    {ROLES.map(r => (
                                                        <option key={r.id} value={r.id}>{r.label}</option>
                                                    ))}
                                                </select>
                                                {isDirty && (
                                                    <button
                                                        id={`btn-save-role-${grant.id}`}
                                                        className="btn btn-sm btn-techradar grant-save-role-btn"
                                                        onClick={() => handleSaveRole(grant)}
                                                        disabled={isSaving}
                                                        title="Save role change"
                                                    >
                                                        {isSaving ? '…' : 'Save'}
                                                    </button>
                                                )}
                                                {msg && (
                                                    <span className={`grant-role-msg text-${msg.type}`}>
                                                        {msg.text}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{grant.assignedByName || '—'}</td>
                                        <td>
                                            <button
                                                id={`btn-revoke-${grant.id}`}
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleRevoke(grant)}
                                                title="Revoke access"
                                            >
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GrantAccessPage;
