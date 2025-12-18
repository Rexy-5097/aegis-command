import { useEffect, useState } from 'react';
import db from '../../db/db';

export default function ThreatFeed() {
    const [threats, setThreats] = useState([]);

    useEffect(() => {
        // 1. Initial Fetch
        const fetchThreats = async () => {
            try {
                const result = await db.allDocs({
                    include_docs: true,
                    descending: true,
                    limit: 10
                });

                const logs = result.rows
                    .map(row => row.doc)
                    .filter(doc => doc.type === 'threat_log');

                setThreats(logs);
            } catch (err) {
                console.error("Feed Error:", err);
            }
        };
        fetchThreats();

        // 2. Live Changes Feed
        const changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', (change) => {
            if (change.doc && change.doc.type === 'threat_log') {
                setThreats(prev => {
                    if (prev.some(t => t._id === change.doc._id)) return prev;
                    return [change.doc, ...prev].slice(0, 50);
                });
            }
        });

        return () => changes.cancel();
    }, []);

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour12: false });
    };

    return (
        <div className="border border-cyber-gray bg-black/40 p-4 h-full overflow-hidden flex flex-col">
            <h3 className="text-neon-green font-mono text-sm border-b border-cyber-gray pb-2 mb-2 uppercase flex justify-between">
                <span>Detected Signatures</span>
                <span className="text-xs text-gray-500">LIVE FEED</span>
            </h3>

            <div className="space-y-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {threats.length === 0 && (
                    <div className="text-gray-600 font-mono text-xs p-2 text-center italic">
                        NO ACTIVE PROXIMITY THREATS LOGGED
                    </div>
                )}

                {threats.map((t) => (
                    <div key={t._id} className="group flex items-center justify-between font-mono text-xs p-2 bg-white/5 border-l-2 border-transparent hover:border-neon-green transition-all animate-fadeIn">
                        <div className='flex flex-col'>
                            <span className="text-white font-bold uppercase">{t.label}</span>
                            <span className="text-gray-500 text-[10px]">{formatTime(t.timestamp)}</span>
                        </div>

                        <div className='flex flex-col items-end'>
                            <span className="text-neon-green">
                                {Math.round(t.confidence * 100)}%
                            </span>
                            <span className="text-gray-600 text-[10px]">DETECTED</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
