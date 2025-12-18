export default function TacticalMap() {
    return (
        <div className="border border-cyber-gray bg-black/40 h-[400px] w-full relative flex items-center justify-center overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#00ff41 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Crosshair Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1px] h-full bg-neon-green/20"></div>
                <div className="h-[1px] w-full bg-neon-green/20"></div>
            </div>

            <div className="text-neon-green font-mono text-sm tracking-widest animate-pulse">
                [ TACTICAL GRID OFFLINE ]
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-neon-green"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-neon-green"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-neon-green"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-neon-green"></div>
        </div>
    );
}
