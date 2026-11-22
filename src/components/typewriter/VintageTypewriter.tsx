import React, { useEffect, useMemo, useRef } from 'react';
import {
  TYPEWRITER_KEY_ROWS,
  type TypewriterKeySpec,
} from '../../lib/letterData';

export interface FloatingParticle {
  id: number;
  symbol: string;
  leftPercent: number;
  hx: string;
  hx2: string;
  dur: string;
  color: string;
  sizeClass: string;
}

interface VintageTypewriterProps {
  unlocked: boolean;
  wakingUp: boolean;
  paperText: string;
  activeKeyId: string | null;
  shiftActive: boolean;
  musicPlaying: boolean;
  isAutoWriting: boolean;
  letterCompleted: boolean;
  carriageCol: number;
  bellActive: boolean;
  strokeCount: number;
  floatingParticles: FloatingParticle[];
  onKeyPress: (key: TypewriterKeySpec) => void;
  onHeartEmblemClick: () => void;
}

const TYPEBAR_COUNT = 19;

function getTypebarIndex(keyId: string | null): number | null {
  if (!keyId || keyId === 'Space' || keyId === 'Shift') return null;
  let hash = 0;
  for (let i = 0; i < keyId.length; i += 1) {
    hash = (hash * 31 + keyId.charCodeAt(i)) % TYPEBAR_COUNT;
  }
  return hash;
}

function renderPaperContent(text: string): React.ReactNode {
  const parts = text.split(/(♥)/g);
  return parts.map((part, idx) =>
    part === '♥' ? (
      <span key={idx} className="text-[#C93B4B]">
        ♥
      </span>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

export const VintageTypewriter: React.FC<VintageTypewriterProps> = ({
  unlocked,
  wakingUp,
  paperText,
  activeKeyId,
  shiftActive,
  musicPlaying,
  isAutoWriting,
  letterCompleted,
  carriageCol,
  bellActive,
  strokeCount,
  floatingParticles,
  onKeyPress,
  onHeartEmblemClick,
}) => {
  const paperScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = paperScrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: isAutoWriting ? 'auto' : 'smooth',
    });
  }, [paperText, isAutoWriting, letterCompleted]);

  const activeBarIndex = useMemo(
    () => getTypebarIndex(activeKeyId),
    [activeKeyId]
  );

  // Authentic carriage horizontal travel: shifts smoothly left as characters fill a line
  const cappedCol = Math.min(carriageCol, 52);
  const carriageShiftPx = unlocked ? 26 - cappedCol * 1.15 : 0;
  const spoolRotationDeg = (strokeCount * 18) % 360;

  return (
    <div
      className={`relative mx-auto flex w-full max-w-[740px] flex-col items-center select-none ${
        wakingUp ? 'animate-machine-wake' : ''
      }`}
    >
      {/* Floating Romantic Hearts & Musical Notes Around the Machine */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-10 bottom-10 z-30 overflow-visible"
      >
        {floatingParticles.map((p) => (
          <span
            key={p.id}
            className={`animate-float-heart absolute bottom-20 font-editorial ${p.sizeClass}`}
            style={
              {
                left: `${p.leftPercent}%`,
                color: p.color,
                '--hx': p.hx,
                '--hx2': p.hx2,
                '--hdur': p.dur,
              } as React.CSSProperties
            }
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* ================= CARRIAGE & PAPER ASSEMBLY ================= */}
      <div className="relative z-10 flex w-full max-w-[600px] flex-col items-center px-4">
        <div
          className="relative flex w-full flex-col items-center transition-transform duration-150 ease-out"
          style={{ transform: `translateX(${carriageShiftPx}px)` }}
        >
          {/* Vertical White Letter Paper Sheet */}
          <div
            className={`relative z-10 w-[78%] max-w-[430px] origin-bottom transition-all duration-700 ease-out ${
              !unlocked
                ? 'translate-y-12 opacity-90'
                : letterCompleted
                  ? '-translate-y-4 opacity-100'
                  : 'translate-y-2 opacity-100'
            }`}
          >
            <div className="relative overflow-hidden rounded-t-sm border border-[#D9D0C1] bg-[#FFFEFA] shadow-[0_-6px_20px_rgba(48,40,32,0.12),inset_0_0_24px_rgba(235,226,208,0.35)]">
              {/* Subtle vintage cotton paper header watermark */}
              <div className="flex items-center justify-between border-b border-[#EFE8DA] px-5 py-2 text-[10px] tracking-[0.22em] text-[#A29584]">
                <span className="font-typewriter uppercase">No. 01 · For Migel</span>
                <span className="text-[#C93B4B]/75">♥</span>
              </div>

              {/* Typed Letter Viewport */}
              <div
                ref={paperScrollRef}
                className="font-typewriter relative h-[210px] overflow-y-auto px-5 py-4 text-[13px] leading-[1.68] whitespace-pre-wrap break-words text-[#2B2724] sm:h-[245px] sm:px-7 sm:text-[14px]"
              >
                {!unlocked ? (
                  <p className="italic text-[#A49889]">
                    [ Paper waiting — insert golden coin to feed sheet... ]
                  </p>
                ) : paperText.length === 0 ? (
                  <p className="text-[#9E9181]">
                    Click &ldquo;START WRITING&rdquo; below or type on the keys...
                    <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-[#2B2724] align-middle" />
                  </p>
                ) : (
                  <div>
                    {renderPaperContent(paperText)}
                    {!letterCompleted && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#2B2724] align-middle" />
                    )}
                  </div>
                )}

                {/* Final Crimson Heart Stamp When Letter Finishes */}
                {letterCompleted && (
                  <div className="mt-4 flex items-center justify-center gap-2 border-t border-dashed border-[#E6DDD0] pt-3 text-xs text-[#C93B4B]">
                    <span>♥</span>
                    <span className="font-editorial italic text-[#6E6053]">
                      signed with warmth
                    </span>
                    <span>♥</span>
                  </div>
                )}
              </div>

              {/* Paper Bottom Shadow Near Platen */}
              <div className="h-3 w-full bg-gradient-to-b from-transparent to-[#DDD3C3]/60" />
            </div>
          </div>

          {/* Mechanical Platen Roller + Carriage Return Lever + Knobs */}
          <div className="relative z-20 flex w-full items-center justify-center">
            {/* Left Silver Carriage Return Lever */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-6 z-30 flex items-end sm:-left-6"
            >
              <div
                className={`h-3 w-12 origin-right rounded-full border border-[#545A60] bg-gradient-to-b from-[#F4F6F8] via-[#BFC5CC] to-[#878E96] shadow-md transition-transform duration-200 sm:w-16 ${
                  activeKeyId === 'Enter' ? '-rotate-12 scale-95' : '-rotate-3'
                }`}
              />
            </div>

            {/* Left Textured Black Platen Knob */}
            <div
              aria-hidden="true"
              className="flex items-center"
            >
              <div className="h-9 w-5 rounded-l-md border border-[#191817] bg-gradient-to-b from-[#45423E] via-[#262422] to-[#141312] shadow-md sm:h-10 sm:w-6" />
              <div className="h-3.5 w-3 border-y border-[#777E85] bg-gradient-to-b from-[#E5E8EC] to-[#9AA1A8]" />
            </div>

            {/* Main Dark Rubber Platen Roller & Chrome Paper Bail */}
            <div className="relative h-9 flex-1 rounded-sm border-y-2 border-[#1B1A19] bg-gradient-to-b from-[#3A3734] via-[#23211F] to-[#151413] shadow-[0_6px_12px_rgba(0,0,0,0.35)] sm:h-10">
              {/* Paper Exit Slot Highlight */}
              <div className="mx-auto mt-1 h-[2px] w-[86%] bg-[#5B5650]/65" />

              {/* Chrome Paper Bail Bar & Two Small Hold-Down Rollers */}
              <div className="absolute left-[7%] right-[7%] top-1/2 flex -translate-y-1/2 items-center justify-between">
                <div className="h-3.5 w-4 rounded-sm border border-[#191817] bg-[#2D2B29] shadow-sm" />
                <div className="h-1 flex-1 bg-gradient-to-b from-[#F4F6F8] to-[#8E959C]" />
                <div className="h-3.5 w-4 rounded-sm border border-[#191817] bg-[#2D2B29] shadow-sm" />
              </div>

              {/* Brass End-of-Line Bell Flash */}
              <div
                aria-hidden="true"
                className={`absolute right-2 top-1/2 flex h-3.5 w-3.5 -translate-y-1/2 items-center justify-center rounded-full border border-[#8E6B24] transition-all duration-200 ${
                  bellActive
                    ? 'scale-125 bg-[#F8D66D] shadow-[0_0_12px_#F6C84C]'
                    : 'bg-[#B59242]/70'
                }`}
              />
            </div>

            {/* Right Textured Black Platen Knob */}
            <div
              aria-hidden="true"
              className="flex items-center"
            >
              <div className="h-3.5 w-3 border-y border-[#777E85] bg-gradient-to-b from-[#E5E8EC] to-[#9AA1A8]" />
              <div className="h-9 w-5 rounded-r-md border border-[#191817] bg-gradient-to-b from-[#45423E] via-[#262422] to-[#141312] shadow-md sm:h-10 sm:w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= PASTEL BABY-BLUE / TURQUOISE TYPEWRITER CHASSIS ================= */}
      <div className="relative z-20 -mt-2 w-full rounded-[30px] border-2 border-[#3C7682] bg-gradient-to-b from-[#A7D9E2] via-[#76B9C6] to-[#4A8B98] p-3 pt-4 shadow-[0_26px_48px_rgba(44,58,64,0.28),inset_0_3px_6px_rgba(255,255,255,0.65),inset_0_-8px_16px_rgba(39,85,95,0.45)] sm:rounded-[38px] sm:p-5 sm:pt-5">
        {/* Top Satin Bevel Rim */}
        <div className="rounded-[22px] border border-[#CBEAF0]/70 bg-gradient-to-b from-[#8ECAD5] to-[#63A8B6] p-2.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.45)] sm:rounded-[28px] sm:p-4">
          {/* Open Steel Typebar Basket & Dual Ink Ribbon Spools */}
          <div className="relative mx-auto mb-3 h-28 w-full max-w-[560px] overflow-hidden rounded-t-[44px] rounded-b-2xl border-2 border-[#2D5E68] bg-gradient-to-b from-[#1E2124] via-[#26292D] to-[#17191B] shadow-[inset_0_10px_22px_rgba(0,0,0,0.8)] sm:h-32">
            {/* Left Ribbon Spool */}
            <div
              aria-hidden="true"
              className="absolute left-5 top-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#757C82] bg-[#16181A] shadow-md transition-transform duration-150 sm:left-9 sm:h-14 sm:w-14"
              style={{ transform: `rotate(${spoolRotationDeg}deg)` }}
            >
              <div className="h-8 w-8 rounded-full border border-dashed border-[#4D5258] bg-[#24272B]" />
              <div className="absolute h-2.5 w-2.5 rounded-full border border-[#BFC5CC] bg-[#8D949B]" />
            </div>

            {/* Right Ribbon Spool */}
            <div
              aria-hidden="true"
              className="absolute right-5 top-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#757C82] bg-[#16181A] shadow-md transition-transform duration-150 sm:right-9 sm:h-14 sm:w-14"
              style={{ transform: `rotate(${spoolRotationDeg}deg)` }}
            >
              <div className="h-8 w-8 rounded-full border border-dashed border-[#4D5258] bg-[#24272B]" />
              <div className="absolute h-2.5 w-2.5 rounded-full border border-[#BFC5CC] bg-[#8D949B]" />
            </div>

            {/* Silk Ink Ribbon Band Across Center */}
            <div
              aria-hidden="true"
              className="absolute left-14 right-14 top-7 h-2 border-y border-[#3B1D21] bg-gradient-to-b from-[#17181A] via-[#1C1D20] to-[#7D232D] opacity-90 sm:left-20 sm:right-20"
            />

            {/* Center Chrome Ribbon Vibrator / Strike Guide */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-2 z-20 flex h-10 w-8 -translate-x-1/2 flex-col items-center justify-between rounded-b-md border border-[#AEB5BC] bg-gradient-to-b from-[#ECEFF2] to-[#9AA1A8] py-1 shadow-md"
            >
              <div className="h-3.5 w-3 rounded-xs border border-[#5D6369] bg-[#1E2022]" />
            </div>

            {/* Semicircular Fanned Black Metal Typebars */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 110"
              className="absolute inset-x-0 bottom-0 h-full w-full"
            >
              {/* Segment Arch Slot */}
              <path
                d="M 55 108 A 145 92 0 0 1 345 108"
                fill="none"
                stroke="#3A3F45"
                strokeWidth="5"
              />
              {Array.from({ length: TYPEBAR_COUNT }, (_, idx) => {
                const t = idx / (TYPEBAR_COUNT - 1);
                const angleDeg = -66 + t * 132;
                const isStriking = activeBarIndex === idx;
                const cx = 200;
                const cy = 104;
                const rStart = 30;
                const rEnd = isStriking ? 92 : 84;
                const rad = ((angleDeg - 90) * Math.PI) / 180;
                const x1 = cx + Math.cos(rad) * rStart;
                const y1 = cy + Math.sin(rad) * rStart;
                const x2 = cx + Math.cos(rad) * rEnd;
                const y2 = cy + Math.sin(rad) * rEnd;

                // When striking, animate a crisp arm snapping straight up to center strike point (200, 14)
                return isStriking ? (
                  <g key={idx}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={200}
                      y2={18}
                      stroke="#D7DCE0"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <rect
                      x={195}
                      y={12}
                      width="10"
                      height="9"
                      rx="1.5"
                      fill="#E5E9ED"
                      stroke="#393D42"
                      strokeWidth="1.2"
                    />
                  </g>
                ) : (
                  <g key={idx}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#686F77"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={x2}
                      cy={y2}
                      r="3.2"
                      fill="#9AA1A8"
                      stroke="#2B2E32"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Front Turquoise Cowling + Vintage Nameplate Badge + Heart Emblem */}
          <div className="mb-3 flex items-center justify-between gap-2 px-2">
            <span className="hidden h-2 w-2 rounded-full border border-[#356C78] bg-[#CBEAF0] sm:inline-block" />

            <div className="mx-auto flex items-center gap-2 rounded-full border border-[#366F7B] bg-gradient-to-b from-[#FAF6EE] to-[#E6DEC9] px-4 py-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(32,68,76,0.3)]">
              <span className="font-editorial text-[10px] font-bold tracking-[0.22em] text-[#2F2B28] uppercase sm:text-[11px]">
                Migel&apos;s Vintage Portable
              </span>
              <button
                type="button"
                onClick={onHeartEmblemClick}
                title="Click for a surprise & romantic piano melody"
                aria-label="Heart emblem love button"
                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#C93B4B]/40 transition-transform hover:scale-110 active:scale-95 ${
                  musicPlaying
                    ? 'bg-[#C93B4B] text-white shadow-[0_0_10px_rgba(201,59,75,0.65)]'
                    : 'bg-[#FFF5F5] text-[#C93B4B]'
                }`}
              >
                <span className="text-xs leading-none">♥</span>
              </button>
            </div>

            <span className="hidden h-2 w-2 rounded-full border border-[#356C78] bg-[#CBEAF0] sm:inline-block" />
          </div>

          {/* ================= CREAM MECHANICAL KEYBOARD WELL ================= */}
          <div className="rounded-[20px] border-2 border-[#316773] bg-gradient-to-b from-[#2A535D] to-[#1D3B42] px-1.5 py-3 shadow-[inset_0_8px_16px_rgba(0,0,0,0.45)] sm:px-4 sm:py-4">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              {TYPEWRITER_KEY_ROWS.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex w-full items-center justify-center gap-1 sm:gap-1.5"
                >
                  {row.map((keySpec) => {
                    const isPressed =
                      activeKeyId === keySpec.id ||
                      (keySpec.type === 'shift' && shiftActive);
                    const isHeartKey = keySpec.type === 'heart';
                    const displayLabel =
                      shiftActive && keySpec.shiftLabel
                        ? keySpec.shiftLabel
                        : keySpec.label;

                    return (
                      <button
                        key={keySpec.id}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => onKeyPress(keySpec)}
                        aria-label={
                          isHeartKey
                            ? 'Special Heart Love Key'
                            : `Typewriter key ${keySpec.label}`
                        }
                        title={
                          isHeartKey
                            ? 'Toggle romantic music & add ♥'
                            : keySpec.label
                        }
                        className={`typewriter-keycap relative flex h-8 w-7 cursor-pointer flex-col items-center justify-center rounded-full font-typewriter font-bold sm:h-11 sm:w-11 ${
                          isPressed ? 'is-pressed' : ''
                        } ${
                          isHeartKey
                            ? musicPlaying
                              ? 'ring-2 ring-[#C93B4B] ring-offset-1 ring-offset-[#1D3B42]'
                              : ''
                            : ''
                        } disabled:cursor-not-allowed disabled:opacity-75`}
                      >
                        {keySpec.shiftLabel && (
                          <span className="hidden text-[8px] leading-none text-[#7E7265] sm:block">
                            {keySpec.shiftLabel}
                          </span>
                        )}
                        <span
                          className={`leading-none ${
                            isHeartKey
                              ? 'text-sm text-[#C93B4B] sm:text-lg'
                              : keySpec.type === 'backspace' ||
                                  keySpec.type === 'enter' ||
                                  keySpec.type === 'shift'
                                ? 'text-[11px] text-[#4E463E] sm:text-sm'
                                : 'text-[11px] text-[#2B2724] sm:text-sm'
                          }`}
                        >
                          {displayLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* Bottom Cream Mechanical Spacebar */}
              <div className="mt-1 flex w-full justify-center">
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() =>
                    onKeyPress({
                      id: 'Space',
                      label: 'SPACE',
                      type: 'space',
                    })
                  }
                  aria-label="Typewriter Spacebar"
                  className={`typewriter-spacebar flex h-8 w-[58%] max-w-[300px] cursor-pointer items-center justify-center rounded-full font-typewriter text-[10px] font-bold tracking-[0.25em] text-[#7E7265] sm:h-10 ${
                    activeKeyId === 'Space' ? 'is-pressed' : ''
                  } disabled:cursor-not-allowed disabled:opacity-75`}
                >
                  SPACE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rubber Desk Feet */}
        <div
          aria-hidden="true"
          className="mt-1.5 flex items-center justify-between px-8"
        >
          <span className="h-2 w-10 rounded-b-md bg-[#23211E]" />
          <span className="h-2 w-10 rounded-b-md bg-[#23211E]" />
        </div>
      </div>

      {/* Soft Desk Shadow Underneath Typewriter */}
      <div
        aria-hidden="true"
        className="-mt-1 h-5 w-[86%] rounded-full bg-[#3A3128]/20 blur-md"
      />
    </div>
  );
};
