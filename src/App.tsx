import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Edit3,
  Heart,
  Music,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CoinSlotMechanism } from './components/typewriter/CoinSlotMechanism';
import { CustomizeLetterModal } from './components/typewriter/CustomizeLetterModal';
import { VintageEnvelope } from './components/typewriter/VintageEnvelope';
import {
  VintageTypewriter,
  type FloatingParticle,
} from './components/typewriter/VintageTypewriter';
import {
  SECRET_MACHINE_NOTE,
  loadCustomLetter,
  saveCustomLetter,
  type TypewriterKeySpec,
} from './lib/letterData';
import { typewriterAudio } from './lib/typewriterAudio';

const SHIFT_SYMBOL_TO_KEY_ID: Record<string, string> = {
  '!': '1',
  '@': '2',
  '#': '3',
  $: '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  _: '-',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
};

function mapCharToKeyMeta(ch: string): { keyId: string; needsShift: boolean } {
  if (ch === ' ') return { keyId: 'Space', needsShift: false };
  if (ch === '\n') return { keyId: 'Enter', needsShift: false };
  if (ch === '♥') return { keyId: 'Heart', needsShift: false };
  if (SHIFT_SYMBOL_TO_KEY_ID[ch]) {
    return { keyId: SHIFT_SYMBOL_TO_KEY_ID[ch], needsShift: true };
  }
  if (/^[A-Z]$/.test(ch)) {
    return { keyId: ch, needsShift: true };
  }
  if (/^[a-z]$/.test(ch)) {
    return { keyId: ch.toUpperCase(), needsShift: false };
  }
  return { keyId: ch, needsShift: false };
}

function getColumnFromText(text: string): number {
  const lastBreak = text.lastIndexOf('\n');
  return lastBreak === -1 ? text.length : text.length - lastBreak - 1;
}

export function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [wakingUp, setWakingUp] = useState(false);
  const [letterTemplate, setLetterTemplate] = useState<string>(() =>
    loadCustomLetter()
  );
  const [paperText, setPaperText] = useState('');
  const [isAutoWriting, setIsAutoWriting] = useState(false);
  const [letterCompleted, setLetterCompleted] = useState(false);

  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [shiftActive, setShiftActive] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(() => typewriterAudio.getVolume());
  const [heartClickCount, setHeartClickCount] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState<
    FloatingParticle[]
  >([]);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const autoIndexRef = useRef(0);
  const particleIdRef = useRef(1);
  const keyReleaseTimerRef = useRef<number | null>(null);
  const bellTimerRef = useRef<number | null>(null);
  const userPausedMusicRef = useRef(false);

  const carriageCol = getColumnFromText(paperText);
  const secretUnlocked = heartClickCount >= 3;

  const flashActiveKey = useCallback((keyId: string, duration = 105) => {
    setActiveKeyId(keyId);
    if (keyReleaseTimerRef.current !== null) {
      window.clearTimeout(keyReleaseTimerRef.current);
    }
    keyReleaseTimerRef.current = window.setTimeout(() => {
      setActiveKeyId((curr) => (curr === keyId ? null : curr));
    }, duration);
  }, []);

  const triggerBellCue = useCallback(() => {
    typewriterAudio.playBellDing();
    setBellActive(true);
    if (bellTimerRef.current !== null) {
      window.clearTimeout(bellTimerRef.current);
    }
    bellTimerRef.current = window.setTimeout(() => {
      setBellActive(false);
    }, 450);
  }, []);

  const spawnRomanticBurst = useCallback((count = 7) => {
    const symbols = ['♥', '♡', '♪', '♫', '♥'];
    const colors = ['#C93B4B', '#DF6B79', '#B84B5C', '#4A8B98'];

    const batch: FloatingParticle[] = Array.from({ length: count }, (_, i) => {
      const id = particleIdRef.current++;
      return {
        id,
        symbol: symbols[(id + i) % symbols.length],
        leftPercent: 16 + Math.random() * 68,
        hx: `${Math.round((Math.random() - 0.5) * 44)}px`,
        hx2: `${Math.round((Math.random() - 0.5) * 64)}px`,
        dur: `${(2.6 + Math.random() * 1.1).toFixed(2)}s`,
        color: colors[(id + i) % colors.length],
        sizeClass: Math.random() > 0.45 ? 'text-xl sm:text-2xl' : 'text-base',
      };
    });

    setFloatingParticles((prev) => [...prev.slice(-26), ...batch]);

    window.setTimeout(() => {
      const ids = new Set(batch.map((b) => b.id));
      setFloatingParticles((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 3900);
  }, []);

  const handleToggleMusic = useCallback(() => {
    const playing = typewriterAudio.toggleMusic();
    userPausedMusicRef.current = !playing;
    setMusicPlaying(playing);
    if (playing) {
      spawnRomanticBurst(6);
    }
  }, [spawnRomanticBurst]);

  const handleVolumeChange = (nextVol: number) => {
    setVolume(nextVol);
    typewriterAudio.setVolume(nextVol);
  };

  const handleHeartSurprise = useCallback(
    (insertHeartChar: boolean) => {
      setHeartClickCount((prev) => {
        const next = prev + 1;
        if (next === 3) {
          typewriterAudio.playRomanticChime();
          spawnRomanticBurst(10);
        }
        return next;
      });

      const nowPlaying = typewriterAudio.toggleMusic();
      userPausedMusicRef.current = !nowPlaying;
      setMusicPlaying(nowPlaying);
      spawnRomanticBurst(7);

      if (insertHeartChar && unlocked && !isAutoWriting) {
        typewriterAudio.playKeyClack(false);
        flashActiveKey('Heart', 120);
        setStrokeCount((s) => s + 1);
        setLetterCompleted(false);
        setPaperText((prev) => `${prev}♥`);
      }
    },
    [flashActiveKey, isAutoWriting, spawnRomanticBurst, unlocked]
  );

  const handleUnlockMachine = useCallback(() => {
    setUnlocked(true);
    setWakingUp(true);
    setPaperText('');
    setLetterCompleted(false);
    setIsAutoWriting(false);
    autoIndexRef.current = 0;

    window.setTimeout(() => {
      setWakingUp(false);
    }, 460);
  }, []);

  const handleResetMachine = useCallback(() => {
    setUnlocked(false);
    setWakingUp(false);
    setIsAutoWriting(false);
    setLetterCompleted(false);
    setPaperText('');
    setActiveKeyId(null);
    setShiftActive(false);
    autoIndexRef.current = 0;
  }, []);

  const handleStartWriting = useCallback(() => {
    if (!unlocked) return;
    if (!typewriterAudio.isMusicPlaying() && !userPausedMusicRef.current) {
      typewriterAudio.startMusic();
      setMusicPlaying(true);
    }
    setPaperText('');
    setLetterCompleted(false);
    autoIndexRef.current = 0;
    setIsAutoWriting(true);
  }, [unlocked]);

  const handleTypeCharacter = useCallback(
    (char: string) => {
      if (!unlocked || isAutoWriting) return;
      setLetterCompleted(false);
      const { keyId } = mapCharToKeyMeta(char);
      flashActiveKey(keyId, 100);
      setStrokeCount((s) => s + 1);

      setPaperText((prev) => {
        const prevCol = getColumnFromText(prev);
        if (char === '\n') {
          typewriterAudio.playCarriageReturn();
        } else {
          typewriterAudio.playKeyClack(char === ' ');
          if (prevCol === 46) {
            triggerBellCue();
          }
        }
        return prev + char;
      });
    },
    [flashActiveKey, isAutoWriting, triggerBellCue, unlocked]
  );

  const handleKeyPressFromUI = useCallback(
    (keySpec: TypewriterKeySpec) => {
      if (!unlocked) return;

      if (keySpec.type === 'heart') {
        handleHeartSurprise(true);
        return;
      }

      if (isAutoWriting) return;

      if (keySpec.type === 'shift') {
        typewriterAudio.playKeyClack(true);
        setShiftActive((s) => !s);
        return;
      }

      if (keySpec.type === 'backspace') {
        typewriterAudio.playKeyClack(true);
        flashActiveKey('Backspace');
        setStrokeCount((s) => s + 1);
        setLetterCompleted(false);
        setPaperText((prev) => prev.slice(0, -1));
        return;
      }

      if (keySpec.type === 'enter') {
        handleTypeCharacter('\n');
        return;
      }

      if (keySpec.type === 'space') {
        handleTypeCharacter(' ');
        return;
      }

      const outChar =
        shiftActive && keySpec.shiftLabel
          ? keySpec.shiftLabel
          : shiftActive
            ? keySpec.label.toUpperCase()
            : keySpec.label.toLowerCase();

      handleTypeCharacter(outChar);
      if (shiftActive) {
        setShiftActive(false);
      }
    },
    [
      flashActiveKey,
      handleHeartSurprise,
      handleTypeCharacter,
      isAutoWriting,
      shiftActive,
      unlocked,
    ]
  );

  // Auto-writing character-by-character mechanical engine
  useEffect(() => {
    if (!isAutoWriting || !unlocked) return;

    const fullText = letterTemplate;
    let cancelled = false;
    let timerId: number | null = null;

    const step = () => {
      if (cancelled) return;
      const idx = autoIndexRef.current;

      if (idx >= fullText.length) {
        setIsAutoWriting(false);
        setActiveKeyId(null);
        setShiftActive(false);
        setLetterCompleted(true);
        typewriterAudio.playRomanticChime();
        spawnRomanticBurst(11);
        return;
      }

      const ch = fullText[idx];
      autoIndexRef.current = idx + 1;

      const { keyId, needsShift } = mapCharToKeyMeta(ch);
      setShiftActive(needsShift);
      flashActiveKey(keyId, 82);
      setStrokeCount((s) => s + 1);

      setPaperText((prev) => {
        const prevCol = getColumnFromText(prev);
        if (ch === '\n') {
          typewriterAudio.playCarriageReturn();
        } else {
          typewriterAudio.playKeyClack(ch === ' ');
          if (prevCol === 46) {
            triggerBellCue();
          }
        }
        return prev + ch;
      });

      // Mechanical cadence: natural pauses on punctuation & paragraph breaks
      let delay = 44 + Math.random() * 28;
      if (ch === ' ') delay = 52 + Math.random() * 30;
      if (ch === ',' || ch === ';') delay = 145;
      if (ch === '.' || ch === '!' || ch === '?') delay = 230;
      if (ch === '\n') delay = 260;

      timerId = window.setTimeout(step, delay);
    };

    timerId = window.setTimeout(step, 240);

    return () => {
      cancelled = true;
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [
    flashActiveKey,
    isAutoWriting,
    letterTemplate,
    spawnRomanticBurst,
    triggerBellCue,
    unlocked,
  ]);

  // Real physical keyboard support when unlocked & not auto-writing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showCustomizeModal || !unlocked || isAutoWriting) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Shift') {
        setShiftActive(true);
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        typewriterAudio.playKeyClack(true);
        flashActiveKey('Backspace');
        setStrokeCount((s) => s + 1);
        setLetterCompleted(false);
        setPaperText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleTypeCharacter('\n');
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        handleTypeCharacter(' ');
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        handleTypeCharacter(e.key);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftActive(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [
    flashActiveKey,
    handleTypeCharacter,
    isAutoWriting,
    showCustomizeModal,
    unlocked,
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8F5EF] text-[#2B2724]">
      {/* Subtle Vintage Film Grain Texture */}
      <div
        aria-hidden="true"
        className="vintage-grain-overlay pointer-events-none fixed inset-0 z-40"
      />

      {/* Very Soft Ambient Background Hearts */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      >
        {[
          { left: '8%', dur: '20s', delay: '-4s' },
          { left: '26%', dur: '24s', delay: '-13s' },
          { left: '74%', dur: '21s', delay: '-8s' },
          { left: '91%', dur: '25s', delay: '-15s' },
        ].map((item, idx) => (
          <span
            key={idx}
            className="animate-ambient-heart absolute -bottom-8 text-sm text-[#C93B4B]/25"
            style={
              {
                left: item.left,
                '--adur': item.dur,
                animationDelay: item.delay,
              } as React.CSSProperties
            }
          >
            ♥
          </span>
        ))}
      </div>

      {/* ================= COMPACT TOP BAR ================= */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-8 sm:pt-6">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 fill-[#C93B4B] text-[#C93B4B]" />
          <span className="font-editorial text-sm font-semibold tracking-wide text-[#2F2B28] sm:text-base">
            A Little Love Letter for Migel
          </span>
        </div>

        {/* Music Player & Letter Customization Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Vintage Music Toggle + Volume Slider */}
          <div className="flex items-center gap-2 rounded-full border border-[#DFD5C4] bg-[#FDFBF7]/90 px-3 py-1.5 shadow-xs">
            <button
              type="button"
              onClick={handleToggleMusic}
              aria-label={
                musicPlaying
                  ? 'Pause LeeHi ONLY song'
                  : 'Play LeeHi ONLY song'
              }
              className="inline-flex min-h-[30px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F3ECE0] px-2.5 py-1 font-typewriter text-[11px] font-bold text-[#2F2B28] hover:bg-[#EAE0CF] transition-colors"
            >
              {musicPlaying ? (
                <Pause className="h-3 w-3 text-[#C93B4B]" />
              ) : (
                <Play className="h-3 w-3 text-[#4A8B98]" />
              )}
              <Music className="h-3 w-3 text-[#786D62]" />
              <span>{musicPlaying ? 'LeeHi — ONLY' : 'Play ONLY'}</span>
            </button>

            <div className="hidden items-center gap-1.5 sm:flex">
              {volume === 0 ? (
                <VolumeX className="h-3.5 w-3.5 text-[#8D8175]" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#6C6258]" />
              )}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                aria-label="Music volume"
                className="h-1.5 w-16 cursor-pointer accent-[#C93B4B]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomizeModal(true)}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#DFD5C4] bg-[#FDFBF7]/90 px-3.5 py-1.5 text-xs font-semibold text-[#5C534A] shadow-xs hover:bg-[#F3ECE0] transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5 text-[#4A8B98]" />
            <span>Customize Letter</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN TYPEWRITER WORKSPACE ================= */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-16 pt-4 sm:px-8 sm:pt-6">
        {/* Waiting / Prompt Message Above Machine */}
        <div className="mb-4 text-center sm:mb-6">
          {!unlocked ? (
            <>
              <p className="font-editorial text-xl italic text-[#4E463E] sm:text-2xl">
                A little something is waiting for you...
              </p>
              <p className="mt-1 font-typewriter text-xs text-[#7D7165]">
                Drop or click the golden coin on the right to unlock the machine.
              </p>
            </>
          ) : (
            <>
              <p className="font-editorial text-xl italic text-[#3F3832] sm:text-2xl">
                {letterCompleted
                  ? 'Written one word at a time, just for you.'
                  : isAutoWriting
                    ? 'Writing your letter, Migel...'
                    : 'Your vintage typewriter is ready, Migel.'}
              </p>
              <p className="mt-1 font-typewriter text-xs text-[#7D7165]">
                Tap the ♥ key on the keyboard for romantic piano music &amp; a hidden surprise.
              </p>
            </>
          )}
        </div>

        {/* Hidden Secret Note Banner (Revealed after clicking Heart 3 times) */}
        {secretUnlocked && (
          <div
            role="status"
            className="animate-envelope-enter mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5B8BE] bg-[#FFF8F8] px-5 py-2 font-typewriter text-xs font-semibold text-[#A32E3B] shadow-sm sm:text-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-[#C93B4B]" />
            <span>{SECRET_MACHINE_NOTE}</span>
          </div>
        )}

        {/* Centered Typewriter + Right-Side Vintage Coin Mechanism */}
        <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:gap-10">
          <div className="w-full flex-1">
            <VintageTypewriter
              unlocked={unlocked}
              wakingUp={wakingUp}
              paperText={paperText}
              activeKeyId={activeKeyId}
              shiftActive={shiftActive}
              musicPlaying={musicPlaying}
              isAutoWriting={isAutoWriting}
              letterCompleted={letterCompleted}
              carriageCol={carriageCol}
              bellActive={bellActive}
              strokeCount={strokeCount}
              floatingParticles={floatingParticles}
              onKeyPress={handleKeyPressFromUI}
              onHeartEmblemClick={() => handleHeartSurprise(false)}
            />
          </div>

          <div className="shrink-0">
            <CoinSlotMechanism
              unlocked={unlocked}
              onUnlock={handleUnlockMachine}
              onResetMachine={handleResetMachine}
            />
          </div>
        </div>

        {/* Primary Action Controls Under Typewriter */}
        {unlocked && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {!isAutoWriting && !letterCompleted && (
              <button
                type="button"
                onClick={handleStartWriting}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-2 border-[#2C2926] bg-[#74B7C4] px-8 py-2.5 font-typewriter text-sm font-bold tracking-wider text-[#1C2123] shadow-[0_4px_0_#2C2926] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-[#1C2123]" />
                <span>START WRITING</span>
              </button>
            )}

            {isAutoWriting && (
              <button
                type="button"
                onClick={() => setIsAutoWriting(false)}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#2C2926] bg-[#F6EFE0] px-6 py-2 font-typewriter text-xs font-bold tracking-wider text-[#2C2926] shadow-[0_3px_0_#2C2926]"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>PAUSE TYPING</span>
              </button>
            )}

            {!isAutoWriting && paperText.length > 0 && !letterCompleted && (
              <button
                type="button"
                onClick={() => {
                  typewriterAudio.playCarriageReturn();
                  setPaperText('');
                }}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#CEC3B2] bg-white px-5 py-2 text-xs font-semibold text-[#5C534A] hover:bg-[#F3ECE0] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear Sheet</span>
              </button>
            )}
          </div>
        )}

        {/* Final Keepsake Envelope Revealed After Letter Completion */}
        {letterCompleted && (
          <VintageEnvelope
            onReadAgain={handleStartWriting}
            onOneMoreHeart={() => spawnRomanticBurst(12)}
          />
        )}
      </main>

      {/* Letter Customization Modal */}
      {showCustomizeModal && (
        <CustomizeLetterModal
          currentLetter={letterTemplate}
          onSave={(newText) => {
            setLetterTemplate(newText);
            saveCustomLetter(newText);
          }}
          onClose={() => setShowCustomizeModal(false)}
        />
      )}
    </div>
  );
}

export default App;
