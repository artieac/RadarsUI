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

    const loadGrants = useCallback(() => {
        setGrantsLoading(true);
        repo.getGrants((success, data) => {
            if (success) setGrants(data);
            setGrantsLoading(false);
        });
    }, []);

    useEffect(() => {
        loadGrants();
    }, []);

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
        repo.grantAccess(selectedUser.id, selectedRoleId, (success, data) => {
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
        repo.revokeAccess(grant.id, (success) => {
            if (success) {
                loadGrants();
            } else {
                alert('Failed to revoke access. Please try again.');
            }
        });
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="grant-access-page">
            <h2>Grant Access</h2>
            <p className="page-subtitle">Search for users and grant them access to your subscription.</p>

            {/* ── Search Panel ── */}
            <div className="grant-search-panel">
                <h3>Search Users</h3>
                <div className="grant-search-input-row">
                    <input
                        id="grant-search-input"
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email…"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setSearchError(''); }}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <button
                        id="btn-grant-search"
                        className="btn btn-techradar"
                        onClick={handleSearch}
                        disabled={isSearching}
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
                ) : grants.length === 0 ? (
                    <div className="grant-empty-state">No access grants found for this subscription.</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Granted By</th>
                                <th style={{ width: 100 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grants.map(grant => (
                                <tr key={grant.id}>
                                    <td>{grant.userName || '—'}</td>
                                    <td>{grant.userEmail || '—'}</td>
                                    <td><RoleBadge roleId={grant.roleId} roleName={grant.roleName} /></td>
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
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GrantAccessPage;
