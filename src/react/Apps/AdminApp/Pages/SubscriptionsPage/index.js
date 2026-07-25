'use strict'
import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionRepository } from 'Repositories/SubscriptionRepository';
import { UserRepository } from 'Repositories/UserRepository';

const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [tiers, setTiers]                 = useState([]);
    const [users, setUsers]                 = useState([]);
    const [isLoading, setIsLoading]         = useState(true);
    /** Map of subscriptionId -> save status: 'idle' | 'saving' | 'saved' | 'error' */
    const [saveStatus, setSaveStatus]       = useState({});

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
        // Optimistically update the local list
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

    const handleUserChange = (sub, newUserId) => {
        const parsedUserId = parseInt(newUserId, 10);
        const selectedUser = users.find(u => u.id === parsedUserId);

        setSubscriptions(prev => prev.map(s =>
            s.id === sub.id
                ? { ...s, owningUserId: parsedUserId, owningUserName: selectedUser?.name, owningUserEmail: selectedUser?.email }
                : s
        ));
        setStatus(sub.id, 'saving');

        repo.updateSubscription(sub.id, parsedUserId, sub.subscriptionTierId, (ok, updated) => {
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
                Manage user subscriptions. Changes to the tier or owning user are saved immediately.
            </p>

            <div className="sub-tier-table-wrapper">
                <table className="sub-tier-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>User</th>
                            <th>Subscription Tier</th>
                            <th>Last Modified</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map(sub => {
                            const status = saveStatus[sub.id] || 'idle';
                            return (
                                <tr key={sub.id}>
                                    {/* User column – inline select to reassign */}
                                    <td style={{ minWidth: '220px' }}>
                                        <div style={{ fontWeight: 600, color: '#2c3452', marginBottom: '4px' }}>
                                            {sub.owningUserName || '—'}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#6b7590', marginBottom: '6px' }}>
                                            {sub.owningUserEmail}
                                        </div>
                                        <select
                                            id={`user-select-${sub.id}`}
                                            className="subs-select"
                                            value={sub.owningUserId || ''}
                                            onChange={e => handleUserChange(sub, e.target.value)}
                                        >
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} ({u.email})
                                                </option>
                                            ))}
                                        </select>
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
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionsPage;
