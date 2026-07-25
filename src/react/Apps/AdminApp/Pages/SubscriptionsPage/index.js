'use strict'
import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionRepository } from 'Repositories/SubscriptionRepository';
import { UserRepository } from 'Repositories/UserRepository';

/* ── Change-Owner modal ─────────────────────────────────────────────────────── */
const ChangeOwnerModal = ({ isOpen, subscription, users, onSave, onClose }) => {
    const [filter, setFilter]       = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const dialogRef = useRef(null);

    // Keep native <dialog> in sync with isOpen
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen) {
            setFilter('');
            setSelectedUserId(subscription?.owningUserId ?? null);
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen, subscription]);

    const filteredUsers = users.filter(u => {
        const q = filter.toLowerCase();
        return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    });

    const handleSave = () => {
        if (selectedUserId !== null) onSave(selectedUserId);
    };

    return (
        <dialog
            ref={dialogRef}
            style={{
                border: 'none',
                borderRadius: '12px',
                padding: 0,
                width: '480px',
                maxWidth: '95vw',
                boxShadow: '0 8px 40px rgba(0,0,0,0.28)',
                background: '#fff',
            }}
            onClose={onClose}
        >
            {/* Header */}
            <div style={{ background: '#1e2330', color: '#e0e6f5', padding: '16px 20px', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                    Change Owner — Subscription #{subscription?.id}
                </span>
                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#8891aa', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
                    title="Close"
                    id="btn-close-change-owner"
                >
                    ✕
                </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
                {/* Current owner info */}
                <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#f4f6fa', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7590' }}>Current owner: </span>
                    <strong style={{ color: '#1e2330' }}>{subscription?.owningUserName || '—'}</strong>
                    {subscription?.owningUserEmail && (
                        <span style={{ color: '#6b7590' }}> &lt;{subscription.owningUserEmail}&gt;</span>
                    )}
                </div>

                {/* Filter input */}
                <input
                    id="change-owner-filter"
                    type="text"
                    placeholder="Search users by name or email…"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d0d5e8',
                        borderRadius: '7px',
                        fontSize: '0.875rem',
                        marginBottom: '10px',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                    autoFocus
                />

                {/* User list */}
                <div style={{ maxHeight: '260px', overflowY: 'auto', border: '1px solid #eef0f6', borderRadius: '8px' }}>
                    {filteredUsers.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#6b7590', fontSize: '0.85rem' }}>No users found.</div>
                    ) : filteredUsers.map(u => {
                        const isSelected = selectedUserId === u.id;
                        return (
                            <div
                                key={u.id}
                                id={`change-owner-user-${u.id}`}
                                onClick={() => setSelectedUserId(u.id)}
                                style={{
                                    padding: '10px 14px',
                                    cursor: 'pointer',
                                    background: isSelected ? '#1a3a5c' : 'transparent',
                                    color: isSelected ? '#4da6ff' : '#2c3452',
                                    borderBottom: '1px solid #f0f2f8',
                                    transition: 'background 0.1s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                }}
                            >
                                <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.88rem' }}>{u.name}</span>
                                <span style={{ fontSize: '0.76rem', color: isSelected ? '#8ab8e8' : '#6b7590' }}>{u.email}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #eef0f6', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                    id="btn-change-owner-cancel"
                    onClick={onClose}
                    style={{ padding: '8px 18px', borderRadius: '7px', border: '1px solid #d0d5e8', background: '#fff', color: '#2c3452', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
                >
                    Cancel
                </button>
                <button
                    id="btn-change-owner-save"
                    onClick={handleSave}
                    disabled={selectedUserId === null || selectedUserId === subscription?.owningUserId}
                    style={{
                        padding: '8px 20px',
                        borderRadius: '7px',
                        border: 'none',
                        background: selectedUserId !== null && selectedUserId !== subscription?.owningUserId ? '#4da6ff' : '#b0b8d0',
                        color: '#fff',
                        fontSize: '0.875rem',
                        cursor: selectedUserId !== null && selectedUserId !== subscription?.owningUserId ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        transition: 'background 0.15s',
                    }}
                >
                    Save
                </button>
            </div>
        </dialog>
    );
};

/* ── Main page ──────────────────────────────────────────────────────────────── */
const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [tiers, setTiers]                 = useState([]);
    const [users, setUsers]                 = useState([]);
    const [isLoading, setIsLoading]         = useState(true);
    /** Map of subscriptionId -> save status: 'idle' | 'saving' | 'saved' | 'error' */
    const [saveStatus, setSaveStatus]       = useState({});
    /** Which subscription's Change Owner modal is open (null = none) */
    const [changeOwnerSub, setChangeOwnerSub] = useState(null);

    const repoRef     = useRef(new SubscriptionRepository());
    const userRepoRef = useRef(new UserRepository());
    const repo     = repoRef.current;
    const userRepo = userRepoRef.current;

    // ── Data loading ──────────────────────────────────────────────────────────

    useEffect(() => {
        repo.getAllTiers((tierOk, tierData) => {
            if (tierOk) setTiers(tierData || []);

            repo.getAllSubscriptions((subOk, subData) => {
                if (subOk) setSubscriptions(subData || []);

                userRepo.getAll((userOk, userData) => {
                    if (userOk) setUsers(userData || []);
                    setIsLoading(false);
                });
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Save helpers ──────────────────────────────────────────────────────────

    const setStatus = (id, status) => {
        setSaveStatus(prev => ({ ...prev, [id]: status }));
    };

    const handleTierChange = (sub, newTierId) => {
        setSubscriptions(prev => prev.map(s =>
            s.id === sub.id
                ? { ...s, subscriptionTierId: parseInt(newTierId, 10), subscriptionTierName: tiers.find(t => t.id === parseInt(newTierId, 10))?.name }
                : s
        ));
        setStatus(sub.id, 'saving');

        repo.updateSubscription(sub.id, sub.owningUserId, parseInt(newTierId, 10), (ok, updated) => {
            if (ok && updated) {
                setSubscriptions(prev => prev.map(s => s.id === sub.id ? updated : s));
                setStatus(sub.id, 'saved');
                setTimeout(() => setStatus(sub.id, 'idle'), 2000);
            } else {
                setStatus(sub.id, 'error');
            }
        });
    };

    const handleOwnerSave = (newUserId) => {
        const sub = changeOwnerSub;
        if (!sub) return;

        const selectedUser = users.find(u => u.id === newUserId);
        setSubscriptions(prev => prev.map(s =>
            s.id === sub.id
                ? { ...s, owningUserId: newUserId, owningUserName: selectedUser?.name, owningUserEmail: selectedUser?.email }
                : s
        ));
        setStatus(sub.id, 'saving');
        setChangeOwnerSub(null);

        repo.updateSubscription(sub.id, newUserId, sub.subscriptionTierId, (ok, updated) => {
            if (ok && updated) {
                setSubscriptions(prev => prev.map(s => s.id === sub.id ? updated : s));
                setStatus(sub.id, 'saved');
                setTimeout(() => setStatus(sub.id, 'idle'), 2000);
            } else {
                setStatus(sub.id, 'error');
            }
        });
    };

    // ── Render ────────────────────────────────────────────────────────────────

    if (isLoading) {
        return <div className="sub-tier-loading">Loading subscriptions…</div>;
    }

    return (
        <div>
            <h1 className="sub-tier-page-title">Subscriptions</h1>
            <p className="sub-tier-page-subtitle">
                Manage user subscriptions. Changes to the tier are saved immediately. Use "Change Owner" to reassign a subscription.
            </p>

            <div className="sub-tier-table-wrapper">
                <table className="sub-tier-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Owner</th>
                            <th>Subscription Tier</th>
                            <th>Last Modified</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map(sub => {
                            const status = saveStatus[sub.id] || 'idle';
                            return (
                                <tr key={sub.id}>
                                    {/* Owner — read only */}
                                    <td style={{ minWidth: '200px' }}>
                                        <div style={{ fontWeight: 600, color: '#2c3452', marginBottom: '2px' }}>
                                            {sub.owningUserName || '—'}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#6b7590' }}>
                                            {sub.owningUserEmail}
                                        </div>
                                    </td>

                                    {/* Tier dropdown */}
                                    <td className="sub-tier-cell">
                                        <select
                                            id={`tier-select-${sub.id}`}
                                            className="subs-select"
                                            value={sub.subscriptionTierId || ''}
                                            onChange={e => handleTierChange(sub, e.target.value)}
                                        >
                                            {tiers.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Last modified */}
                                    <td style={{ color: '#6b7590', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                                        {sub.lastModified
                                            ? new Date(sub.lastModified).toLocaleString()
                                            : '—'}
                                    </td>

                                    {/* Save status indicator */}
                                    <td style={{ textAlign: 'center', width: '80px' }}>
                                        {status === 'saving' && <span style={{ color: '#888', fontSize: '0.78rem' }}>saving…</span>}
                                        {status === 'saved'  && <span style={{ color: '#34c77b', fontSize: '0.78rem' }}>✓ saved</span>}
                                        {status === 'error'  && <span style={{ color: '#e05252', fontSize: '0.78rem' }}>✗ error</span>}
                                    </td>

                                    {/* Actions */}
                                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                        <button
                                            id={`btn-change-owner-${sub.id}`}
                                            onClick={() => setChangeOwnerSub(sub)}
                                            style={{
                                                padding: '5px 12px',
                                                fontSize: '0.8rem',
                                                borderRadius: '6px',
                                                border: '1px solid #4da6ff',
                                                background: 'transparent',
                                                color: '#4da6ff',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                transition: 'background 0.15s, color 0.15s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#4da6ff'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4da6ff'; }}
                                            title="Reassign this subscription to a different user"
                                        >
                                            Change Owner
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Change Owner modal */}
            <ChangeOwnerModal
                isOpen={changeOwnerSub !== null}
                subscription={changeOwnerSub}
                users={users}
                onSave={handleOwnerSave}
                onClose={() => setChangeOwnerSub(null)}
            />
        </div>
    );
};

export default SubscriptionsPage;

