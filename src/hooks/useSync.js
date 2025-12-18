import { useState, useEffect, useRef } from 'react';
import db from '../db/db';
import { azureService } from '../services/azureService';
import { useNetworkStatus } from './useNetworkStatus';

/**
 * useSync Hook
 * Manages Store-and-Forward synchronization logic.
 */
export function useSync() {
    const isOnline = useNetworkStatus();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const syncInProgress = useRef(false);

    useEffect(() => {
        if (isOnline && !syncInProgress.current) {
            runSync();
        }
    }, [isOnline]);

    const runSync = async () => {
        syncInProgress.current = true; // Lock

        try {
            // 1. Check for pending uploads
            // Query for logs that are 'detected' but not 'synced'
            // Note: In a real app we'd use a proper index, here we map/filter for simplicity on small data
            const result = await db.allDocs({ include_docs: true });
            const pendingLogs = result.rows
                .map(row => row.doc)
                .filter(doc => doc.type === 'threat_log' && doc.status === 'detected');

            if (pendingLogs.length === 0) {
                // Nothing to sync
                syncInProgress.current = false;
                return;
            }

            console.log(`[AEGIS_SYNC] Found ${pendingLogs.length} pending logs. Initiating Uplink...`);
            setIsSyncing(true);

            // 2. Upload to Azure (Simulated)
            const response = await azureService.uploadThreats(pendingLogs);

            // 3. Process Response & Update Local State
            if (response.status === 'success') {

                // A. Mark logs as synced
                const updates = pendingLogs.map(doc => ({
                    ...doc,
                    status: 'synced',
                    _deleted: false // Explicitly ensure not deleted
                }));
                await db.bulkDocs(updates);

                // B. Save HQ Intelligence
                const hqDoc = {
                    _id: `hq_${Date.now()}`,
                    type: 'hq_intel',
                    message: response.hq_analysis,
                    timestamp: response.timestamp,
                    related_logs: pendingLogs.map(l => l._id)
                };

                // Use put with _rev to update if exists, or just try put and catch conflict (simple upsert)
                try {
                    const existing = await db.get('hq_latest').catch(() => null);
                    if (existing) hqDoc._rev = existing._rev;
                    await db.put(hqDoc);
                } catch (e) {
                    console.warn("HQ Doc Update conflict", e);
                }

                setLastSyncTime(new Date());
                console.log('[AEGIS_SYNC] Handshake complete. Intel received.');
            }

        } catch (err) {
            console.error('[AEGIS_SYNC] Uplink Failure:', err);
        } finally {
            setIsSyncing(false);
            syncInProgress.current = false; // Unlock
        }
    };

    return { isSyncing, lastSyncTime };
}
