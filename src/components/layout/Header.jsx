import NetworkStatus from '../dashboard/NetworkStatus';

export default function Header({ isSyncing }) {
    return (
        <header className="fixed top-0 left-20 right-0 h-16 bg-cyber-black/90 backdrop-blur-sm border-b border-cyber-gray flex items-center justify-between px-6 z-40">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold tracking-tighter text-white uppercase">
                    Aegis <span className="text-neon-green">Command</span>
                </h1>
                <span className="text-xs text-cyber-gray font-mono border-l border-cyber-gray pl-4">
                    v2.0.0-BETA
                </span>
            </div>

            <div className="flex items-center">
                <NetworkStatus isSyncing={isSyncing} />
            </div>
        </header>
    );
}
