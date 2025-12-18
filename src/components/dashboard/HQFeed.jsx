import { useEffect, useState } from 'react';
import db from '../../db/db';
import { clsx } from 'clsx';

export default function HQFeed({ isSyncing }) {
    const [intel, setIntel] = useState([]);

    useEffect(() => {
        // 1. Initial Fetch
        const fetchIntel = async () => {
            try {
                const result = await db.allDocs({
                    include_docs: true,
                    descending: true,
                    limit: 5
                });

                const logs = result.rows
                    .map(row => row.doc)
                    .filter(doc => doc.type === 'hq_intel');

                setIntel(logs);
            } catch (err) {
                console.error("HQ Feed Error:", err);
            }
        };
        fetchIntel();

        // 2. Live Changes Feed
        const changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', (change) => {
            if (change.doc && change.doc.type === 'hq_intel') {
                setIntel(prev => [change.doc, ...prev].slice(0, 10));
            }
        });

        return () => changes.cancel();
    }, []);

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour12: false });
    };

    return (
        <div className="border border-cyan-500/50 bg-black/40 p-4 h-full overflow-hidden flex flex-col relative">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500"></div>

            <h3 className="text-cyan-500 font-mono text-sm border-b border-cyan-500/30 pb-2 mb-2 uppercase flex justify-between items-center">
                <span>STRATEGIC INTEL</span>
                <span className={clsx(
                    "text-[10px] px-2 py-0.5 rounded-none font-bold",
                    isSyncing ? "bg-cyan-500 text-black animate-pulse" : "bg-cyan-900/40 text-cyan-300"
                )}>
                    {isSyncing ? "UPLOADING INTEL..." : "HQ LINK"}
                </span>
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-1">
                {intel.length === 0 && (
                    <div className="text-cyan-700 font-mono text-xs p-4 text-center border border-dashed border-cyan-900/50">
                        WAITING FOR UPLINK ANALYSIS...
                    </div>
                )}

                {intel.map((msg) => (
                    <div key={msg._id} className="animate-fadeIn p-2 border-l-2 border-cyan-500 bg-cyan-950/10 hover:bg-cyan-950/20 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">COMMAND RELAY</span>
                            <span className="text-cyan-700 text-[10px] font-mono">{formatTime(msg.timestamp)}</span>
                        </div>
                        <p className="text-cyan-100 font-mono text-xs leading-relaxed">
                            {msg.message.replace('HQ INTEL:', '')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
