import PouchDB from 'pouchdb/dist/pouchdb.js';

// Initialize local database
let db;
try {
    db = new PouchDB('aegis_local');
    // Info dump for debugging
    db.info().then((info) => {
        console.log('[AEGIS_DB] Initialized:', info);
    }).catch(err => console.error('[AEGIS_DB] Info Error:', err));
    // throw new Error("Disabled");
} catch (err) {
    console.error('[AEGIS_DB] CRITICAL INIT FAILURE:', err);
    // Fallback mock to prevent crash
    db = {
        put: async () => ({ id: 'mock', ok: true }),
        allDocs: async () => ({ rows: [] }),
        bulkDocs: async () => ([]),
        info: async () => ({})
    };
}

/**
 * Logs a detected threat to the local PouchDB
 * @param {string} label - Object label (e.g. 'person', 'backpack')
 * @param {number} confidence - Detection confidence (0-1)
 */
export async function logThreat(label, confidence, snapshot = null) {
    const timestamp = new Date().toISOString();
    const doc = {
        _id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        type: "threat_log",
        label: label,
        confidence: confidence,
        timestamp: timestamp,
        status: "detected",
        snapshot_data: snapshot // Base64 image
    };

    try {
        const response = await db.put(doc);
        console.log('[AEGIS_DB] Threat Logged:', response.id);
        return response;
    } catch (err) {
        console.error('[AEGIS_DB] Log Error:', err);
        return null;
    }
}

export default db;
