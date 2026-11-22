import React, { useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';
import { ENVELOPE_FINAL_LINES } from '../../lib/letterData';
import { typewriterAudio } from '../../lib/typewriterAudio';

interface VintageEnvelopeProps {
  onReadAgain: () => void;
  onOneMoreHeart: () => void;
}

export const VintageEnvelope: React.FC<VintageEnvelopeProps> = ({
  onReadAgain,
  onOneMoreHeart,
}) => {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const handleOpenSeal = () => {
    if (envelopeOpen) return;
    setEnvelopeOpen(true);
    typewriterAudio.playRomanticChime();
    onOneMoreHeart();
  };

  return (
    <section
      aria-label="Final keepsake envelope"
      className="animate-envelope-enter mx-auto mt-8 flex w-full max-w-xl flex-col items-center rounded-3xl border border-[#DFD5C4] bg-[#FCF9F2] p-6 text-center shadow-[0_18px_40px_rgba(55,46,35,0.09)] sm:p-8"
    >
      {/* Final Closing Text */}
      <h2 className="font-editorial text-2xl font-semibold text-[#2F2B28] sm:text-3xl">
        {ENVELOPE_FINAL_LINES.heading}
      </h2>
      <p className="mt-1.5 font-typewriter text-sm text-[#6C6258] sm:text-base">
        {ENVELOPE_FINAL_LINES.subheading}
      </p>

      {/* Vintage Sealed Envelope */}
      <div className="my-6 w-full max-w-sm">
        {!envelopeOpen ? (
          <button
            type="button"
            onClick={handleOpenSeal}
            aria-label="Click red wax heart seal to open final message"
            className="group relative mx-auto block h-44 w-full cursor-pointer overflow-hidden rounded-2xl border border-[#D4C7B2] bg-gradient-to-b from-[#FAF3E6] to-[#EFE4D0] shadow-[0_12px_26px_rgba(68,54,36,0.14)] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C93B4B]"
          >
            {/* Envelope Triangular Flap Lines */}
            <svg
              viewBox="0 0 384 120"
              className="absolute left-0 top-0 w-full"
              fill="none"
            >
              <path
                d="M0 0L192 98L384 0H0Z"
                fill="#FDF9F0"
                stroke="#D4C7B2"
                strokeWidth="2"
              />
            </svg>

            {/* Red Wax Heart Seal */}
            <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#E69AA3] bg-[#C93B4B] shadow-[0_5px_12px_rgba(140,28,42,0.42)] transition-transform duration-200 group-hover:scale-110">
              <Heart className="h-6 w-6 fill-[#FFF5F5] text-[#FFF5F5]" />
            </div>

            <span className="absolute bottom-3 left-0 right-0 font-editorial text-sm italic text-[#6D6052]">
              For Migel — tap the wax seal ♥
            </span>
          </button>
        ) : (
          <div className="rounded-2xl border border-[#D4C7B2] bg-[#FFFEFA] p-5 text-center shadow-inner">
            <Heart className="mx-auto mb-2 h-5 w-5 fill-[#C93B4B] text-[#C93B4B]" />
            <p className="font-typewriter text-sm leading-relaxed text-[#2F2B28]">
              {ENVELOPE_FINAL_LINES.keepsake}
            </p>
          </div>
        )}
      </div>

      {/* Final Interactive Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            typewriterAudio.playCarriageReturn();
            onReadAgain();
          }}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#2C2926] bg-[#F6EFE0] px-6 py-2 font-typewriter text-xs font-bold tracking-wider text-[#2C2926] shadow-[0_3px_0_#2C2926] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" />
          <span>READ AGAIN</span>
        </button>

        <button
          type="button"
          onClick={() => {
            typewriterAudio.playRomanticChime();
            onOneMoreHeart();
          }}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#8E1E2B] bg-[#C93B4B] px-6 py-2 font-typewriter text-xs font-bold tracking-wider text-white shadow-[0_3px_0_#7D1824] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <Heart className="h-4 w-4 fill-white" />
          <span>ONE MORE HEART ♥</span>
        </button>
      </div>
    </section>
  );
};
