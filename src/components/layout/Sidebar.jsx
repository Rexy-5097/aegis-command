import { Shield, Radio, Map as MapIcon, Database, Settings } from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { icon: Shield, label: 'CMD' },
        { icon: MapIcon, label: 'TACMAP' },
        { icon: Radio, label: 'COMMS' },
        { icon: Database, label: 'INTEL' },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-20 bg-cyber-black border-r border-cyber-gray flex flex-col items-center py-6 z-50">
            {/* Brand Icon */}
            <div className="mb-10 text-neon-green">
                <Shield size={32} strokeWidth={1.5} />
            </div>

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col space-y-8 w-full">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className="group relative flex items-center justify-center w-full h-12 text-cyber-gray hover:text-neon-green transition-colors"
                    >
                        {/* Active/Hover Indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />

                        <item.icon size={24} strokeWidth={1.5} />
                    </button>
                ))}
            </nav>

            {/* Settings */}
            <div className="mt-auto mb-6 text-cyber-gray hover:text-alert-red cursor-pointer transition-colors">
                <Settings size={24} strokeWidth={1.5} />
            </div>
        </aside>
    );
}
