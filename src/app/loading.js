import { Logo } from '@/components/logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#001222] z-[100] flex flex-col items-center justify-center transition-opacity duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#003049] via-[#001222] to-[#001222]"></div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative">
          {/* Background glow behind the logo */}
          <div className="absolute inset-0 bg-[#F77F00] blur-[60px] opacity-20 rounded-full animate-pulse-slow"></div>
          <Logo size="xl" variant="iconOnly" animate={true} className="drop-shadow-[0_0_20px_rgba(247,127,0,0.4)]" />
        </div>
        <div className="mt-12 flex items-center gap-3 bg-[#001829]/50 backdrop-blur-sm px-6 py-3 rounded-full border border-[#F77F00]/20">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F77F00] animate-bounce shadow-[0_0_10px_rgba(247,127,0,0.8)]" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#D62828] animate-bounce shadow-[0_0_10px_rgba(214,40,40,0.8)]" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FCBF49] animate-bounce shadow-[0_0_10px_rgba(252,191,73,0.8)]" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="mt-6 text-[#FCBF49] text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">Initializing Orbit Node</p>
      </div>
    </div>
  );
}
