import { clsx } from 'clsx';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function NetworkStatus({ isSyncing }) {
    const isOnline = useNetworkStatus();

    // Override visual state if syncing
    const showSync = isOnline && isSyncing;

    return (
        <div className={clsx(
            "flex items-center space-x-3 font-mono text-xs tracking-widest border px-4 py-2 uppercase transition-colors duration-300",
            showSync ? "border-cyan-500 bg-cyan-950/30" : "border-cyber-gray bg-black/50"
        )}>
            <div className="relative flex items-center justify-center w-3 h-3">
                {/* Status Dot */}
                <div
                    className={clsx(
                        "w-2 h-2 rounded-none transition-all duration-300",
                        showSync ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" :
                            isOnline ? "bg-neon-green shadow-[0_0_8px_#00ff41]" : "bg-alert-red animate-pulse shadow-[0_0_8px_#ff0033]"
                    )}
                />
                {/* Outer Ring */}
                <div className={clsx(
                    "absolute inset-0 border opacity-50",
                    showSync ? "border-cyan-400" :
                        isOnline ? "border-neon-green" : "border-alert-red"
                )} />
            </div>

            <span className={clsx(
                "transition-colors duration-300",
                showSync ? "text-cyan-400" :
                    isOnline ? "text-neon-green" : "text-alert-red"
            )}>
                {showSync ? "UPLINK ACTIVE" :
                    isOnline ? "UPLINK ESTABLISHED" : "DISCONNECTED // LOCAL OPS"}
            </span>
        </div>
    );
}
