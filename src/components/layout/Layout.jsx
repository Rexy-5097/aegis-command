import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-neon-green selection:text-black">
            <Sidebar />
            <Header />

            {/* Main Content Area */}
            {/* Offset left for sidebar (w-20 -> 5rem) and top for header (h-16 -> 4rem) */}
            <main className="ml-20 pt-16 min-h-screen p-6 relative">
                {/* Grid Background Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="relative z-10 h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
