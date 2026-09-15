import React, { useState } from 'react';
import {
  CreditCard,
  RotateCw,
  QrCode,
  ShieldCheck,
  Sparkles,
  Wifi,
  Copy,
  Check,
  Download,
  Maximize2,
  X,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useAlumni } from '../../context/AlumniContext';

interface DigitalAlumniCardProps {
  user?: UserProfile;
  compact?: boolean;
}

export const DigitalAlumniCard: React.FC<DigitalAlumniCardProps> = ({ user: propUser, compact = false }) => {
  const { currentUser, showToast } = useAlumni();
  const user = propUser || currentUser;

  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!user) return null;

  const rawId = user.studentId || `SC-${user.batch || '2024'}-${user.uid.slice(-4).toUpperCase()}`;
  const formattedId = rawId.startsWith('SC-') ? rawId : `SC-${rawId}`;

  // Mask card number like a credit card: SC •••• •••• 2024
  const maskedId = showFullNumber
    ? formattedId
    : `SC •••• •••• ${user.batch || formattedId.slice(-4)}`;

  const handleCopyCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(formattedId);
    setCopied(true);
    showToast(`Alumni Card ID (${formattedId}) copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
    showToast('Alumni Pass ready for printing or saving as PDF.', 'info');
  };

  const cardFront = (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#800000] via-[#520000] to-[#260000] text-white p-4 sm:p-5 flex flex-col justify-between shadow-2xl border border-amber-500/30 select-none">
      {/* Background Guilloche Wave / Holographic Effect */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.4),transparent_50%),linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.2)_50%,transparent_60%)]" />
      <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border border-amber-400/20 pointer-events-none" />
      <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border border-amber-400/20 pointer-events-none" />

      {/* Card Header: Institution Logo + Chip & NFC */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src="/assets/cecilians-seal.jpg"
            alt="St. Cecilia's College Seal"
            referrerPolicy="no-referrer"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400/80 shadow-md object-cover bg-white shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] tracking-widest text-amber-300 font-semibold uppercase block truncate">
              St. Cecilia’s College - Cebu
            </span>
            <span className="text-xs sm:text-sm font-black tracking-wide text-white drop-shadow-xs block truncate">
              ALUMNI DIGITAL PASS
            </span>
          </div>
        </div>

        {/* Contactless Wave Logo */}
        <div className="flex items-center gap-1.5 text-amber-300/80 shrink-0">
          <Wifi className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
        </div>
      </div>

      {/* Middle Row: EMV Chip & QR Code */}
      <div className="relative z-10 flex items-center justify-between my-auto py-1 sm:py-2">
        {/* Metallic EMV Smart Chip */}
        <div className="w-10 h-7 sm:w-11 sm:h-8 rounded-md bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border border-amber-600 shadow-inner flex flex-col justify-around p-1">
          <div className="w-full h-0.5 bg-amber-700/50 rounded-xs" />
          <div className="flex justify-between">
            <div className="w-2.5 h-1.5 sm:w-3 sm:h-2 border border-amber-700/50 rounded-xs" />
            <div className="w-2.5 h-1.5 sm:w-3 sm:h-2 border border-amber-700/50 rounded-xs" />
          </div>
          <div className="w-full h-0.5 bg-amber-700/50 rounded-xs" />
        </div>

        {/* Dynamic Campus Gate Pass Mini QR Code */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xs p-1.5 rounded-lg border border-amber-400/30">
          <QrCode className="w-7 h-7 sm:w-8 sm:h-8 text-amber-200" />
          <div className="text-[9px] leading-tight text-amber-100 hidden sm:block">
            <div className="font-bold uppercase tracking-wider text-amber-300">GATE PASS</div>
            <div className="text-amber-200/80">Scan for entry</div>
          </div>
        </div>
      </div>

      {/* Card Number */}
      <div className="relative z-10 my-0.5 sm:my-1 flex items-center justify-between">
        <span className="font-mono text-sm sm:text-base md:text-lg tracking-widest text-amber-100 font-bold drop-shadow-sm truncate">
          {maskedId}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowFullNumber(!showFullNumber);
          }}
          className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 text-amber-200 border border-amber-400/20 transition-colors shrink-0"
        >
          {showFullNumber ? 'Hide' : 'Reveal'}
        </button>
      </div>

      {/* Card Footer: Member Name, Program & Batch */}
      <div className="relative z-10 pt-1.5 sm:pt-2 border-t border-amber-500/20 flex items-end justify-between gap-2">
        <div className="min-w-0 pr-1 sm:pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold tracking-wide uppercase truncate block text-white drop-shadow-sm">
              {user.name}
            </span>
            {user.isVerified && (
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" title="Verified Graduate" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] text-amber-200/90 tracking-wide truncate block">
            {user.course || 'Alumni Member'}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[8px] sm:text-[9px] text-amber-300/80 uppercase tracking-widest block font-medium">
            CLASS / STATUS
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-100 uppercase tracking-wider">
            {user.batch ? `BATCH ${user.batch}` : 'LIFETIME ALUM'}
          </span>
        </div>
      </div>
    </div>
  );

  const cardBack = (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E0303] via-[#330505] to-[#120000] text-white p-5 flex flex-col justify-between shadow-2xl border border-amber-500/30 select-none">
      {/* Magnetic Stripe */}
      <div className="absolute top-4 left-0 right-0 h-9 bg-stone-900 border-y border-stone-800 shadow-inner" />

      <div className="pt-10 space-y-2">
        {/* Signature Strip */}
        <div className="bg-white/95 rounded px-3 py-1.5 flex items-center justify-between text-stone-900">
          <span className="font-serif italic text-xs tracking-wider text-stone-700">
            {user.name}
          </span>
          <span className="font-mono text-[10px] font-bold text-stone-500">
            SEC: {user.batch || '2024'}-SCC
          </span>
        </div>

        {/* Security / Barcode representation */}
        <div className="p-2 bg-black/40 rounded-lg border border-amber-500/20 flex items-center justify-between">
          <div className="space-y-0.5 text-[9px] text-stone-300">
            <p className="font-semibold text-amber-300">OFFICIAL ALUMNI IDENTIFICATION</p>
            <p className="text-[8px] text-stone-400 leading-tight">
              Property of St. Cecilia's College Alumni Association. Valid for campus entry, library access, and certified alumni privileges.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[8px] text-amber-400 block font-mono">REGISTRAR SEAL</span>
            <span className="text-[10px] text-emerald-400 font-bold block">VALIDATED</span>
          </div>
        </div>
      </div>

      {/* Optical Barcode simulation */}
      <div className="pt-2 border-t border-amber-500/20 flex flex-col items-center">
        <div className="w-full flex items-center justify-center gap-1 h-7 bg-white/10 rounded px-2 py-1">
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className={`h-full bg-amber-200 ${
                i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'
              }`}
            />
          ))}
        </div>
        <div className="text-[8px] font-mono text-amber-300/80 tracking-widest mt-1">
          *{formattedId}*
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`flex flex-col items-center ${compact ? 'max-w-md w-full' : 'max-w-lg w-full'} mx-auto`}>
        {/* Card Canvas Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full aspect-[1.586/1] cursor-pointer perspective-1000 transition-transform hover:scale-[1.01] active:scale-[0.99] duration-300 group"
          title="Click card to flip between front and back"
        >
          <div
            className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front Side */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {cardFront}
            </div>

            {/* Back Side */}
            <div
              className="absolute inset-0 backface-hidden rotate-y-180"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              {cardBack}
            </div>
          </div>
        </div>

        {/* Card Action Toolbar */}
        <div className="flex items-center justify-between w-full mt-3 px-1 text-xs gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700/80 font-semibold transition-colors shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFlipped ? 'View Front' : 'Flip to Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCard}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700/80 font-medium transition-colors shadow-2xs"
              title="Copy Alumni Card ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullScreen(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-colors shadow-2xs"
              title="Full screen gate pass for campus scanning"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Gate Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Gate Pass Modal for Campus Turnstiles & Verification */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-amber-200">Official Campus Gate Pass</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Render large card front */}
            <div className="w-full aspect-[1.586/1]">{cardFront}</div>

            {/* High-Contrast Turnstile QR Code */}
            <div className="bg-white p-4 rounded-xl flex flex-col items-center gap-2 text-stone-900">
              <QrCode className="w-36 h-36 text-black" />
              <div className="text-center">
                <div className="font-mono text-xs font-black tracking-widest">{formattedId}</div>
                <div className="text-[10px] text-stone-500 font-medium">
                  Scan at Turnstile Gate / Library Circulation Desk
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleDownloadCard}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
