'use strict'
import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionRepository } from 'Repositories/SubscriptionRepository';

/**
 * Builds a lookup key for the grant map.
 * @param {number} tierId
 * @param {number} rightId
 */
const grantKey = (tierId, rightId) => `${tierId}_${rightId}`;

const SubscriptionTiersPage = () => {
    const [tiers, setTiers]   = useState([]);
    const [rights, setRights] = useState([]);
    /** Map of "tierId_rightId" -> { value, status: 'idle'|'saved'|'error' } */
    const [grantMap, setGrantMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const repoRef = useRef(new SubscriptionRepository());
    const repo = repoRef.current;

    // ── Data loading ──────────────────────────────────────────────────────────

    useEffect(() => {
        repo.getAllTiers((tierOk, tierData) => {
            if (!tierOk) { setIsLoading(false); return; }
            setTiers(tierData);

            repo.getAllRights((rightOk, rightData) => {
                if (!rightOk) { setIsLoading(false); return; }
                setRights(rightData);

                repo.getAllGrants((grantOk, grantData) => {
                    setIsLoading(false);
                    if (!grantOk) return;

                    const map = {};
                    (grantData || []).forEach(grant => {
                        const key = grantKey(
                            grant.subscriptionTier?.id,
                            grant.subscriptionRight?.id
                        );
                        map[key] = { value: grant.value, status: 'idle' };
                    });
                    setGrantMap(map);
                });
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Cell change/save ──────────────────────────────────────────────────────

    const handleCellChange = (tierId, rightId, newValue) => {
        const key = grantKey(tierId, rightId);
        setGrantMap(prev => ({
            ...prev,
            [key]: { value: newValue, status: 'idle' }
        }));
    };

    const handleCellBlur = (tierId, rightId) => {
        const key = grantKey(tierId, rightId);
        const current = grantMap[key];
        const numericValue = parseInt(current?.value ?? '0', 10);
        const safeValue = isNaN(numericValue) ? 0 : numericValue;

        repo.saveGrant(tierId, rightId, safeValue, (ok) => {
            setGrantMap(prev => ({
                ...prev,
                [key]: { value: safeValue, status: ok ? 'saved' : 'error' }
            }));

            // Clear the saved/error indicator after 2 seconds
            if (ok) {
                setTimeout(() => {
                    setGrantMap(prev => ({
                        ...prev,
                        [key]: { ...prev[key], status: 'idle' }
                    }));
                }, 2000);
            }
        });
    };

    const getCellValue = (tierId, rightId) => {
        const key = grantKey(tierId, rightId);
        return grantMap[key]?.value ?? 0;
    };

    const getCellStatus = (tierId, rightId) => {
        const key = grantKey(tierId, rightId);
        return grantMap[key]?.status ?? 'idle';
    };

    // ── Render ────────────────────────────────────────────────────────────────

    if (isLoading) {
        return <div className="sub-tier-loading">Loading subscription data…</div>;
    }

    return (
        <div>
            <h1 className="sub-tier-page-title">Subscription Tiers</h1>
            <p className="sub-tier-page-subtitle">
                Set the value for each right per subscription tier. Changes are saved automatically on leaving a field.
            </p>

            <div className="sub-tier-table-wrapper">
                <table className="sub-tier-table">
                    <thead>
                        <tr>
                            <th>Subscription Right</th>
                            {tiers.map(tier => (
                                <th key={tier.id}>{tier.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rights.map(right => (
                            <tr key={right.id}>
                                <td className="sub-tier-right-name">{right.name}</td>
                                {tiers.map(tier => {
                                    const status = getCellStatus(tier.id, right.id);
                                    return (
                                        <td key={tier.id} className="sub-tier-cell">
                                            <input
                                                id={`grant-${tier.id}-${right.id}`}
                                                type="number"
                                                min="0"
                                                className={
                                                    'sub-tier-input' +
                                                    (status === 'saved' ? ' sub-tier-input--saved' : '') +
                                                    (status === 'error' ? ' sub-tier-input--error' : '')
                                                }
                                                value={getCellValue(tier.id, right.id)}
                                                onChange={e => handleCellChange(tier.id, right.id, e.target.value)}
                                                onBlur={() => handleCellBlur(tier.id, right.id)}
                                            />
                                            <span className="sub-tier-saved-indicator">
                                                {status === 'saved' ? '✓ saved' : status === 'error' ? '✗ error' : ''}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionTiersPage;
