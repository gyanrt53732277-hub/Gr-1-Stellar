import { FiActivity } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-white/50 font-mono">
          <FiActivity className="h-4 w-4 text-white" />
          <span>CHAINTRACE — TRUSTLESS TRADE</span>
        </div>
      </div>
    </footer>
  );
}
