import React, { useState } from 'react';
import { Coins, RotateCcw } from 'lucide-react';
import { typewriterAudio } from '../../lib/typewriterAudio';

interface CoinSlotMechanismProps {
  unlocked: boolean;
  onUnlock: () => void;
  onResetMachine: () => void;
}

export const CoinSlotMechanism: React.FC<CoinSlotMechanismProps> = ({
  unlocked,
  onUnlock,
  onResetMachine,
}) => {
  const [inserting, setInserting] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState(false);

  const triggerInsert = () => {
    if (unlocked || inserting) return;
    setInserting(true);
    typewriterAudio.playCoinInsert();
    window.setTimeout(() => {
      setInserting(false);
      onUnlock();
    }, 620);
  };

  return (
    <aside
      aria-label="Vintage coin unlock mechanism"
      className="flex w-full max-w-[230px] flex-col items-center rounded-2xl border border-[#DFD6C7] bg-[#FDFBF7]/90 p-5 text-center shadow-[0_14px_30px_rgba(68,58,46,0.08)]"
    >
      <p className="font-typewriter text-[11px] uppercase tracking-[0.2em] text-[#786D62]">
        INSERT COIN
      </p>

      {/* Metallic Vintage Coin Slot Plate */}
      <div
        onDragOver={(e) => {
          if (unlocked) return;
          e.preventDefault();
          setDragOverSlot(true);
        }}
        onDragLeave={() => setDragOverSlot(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverSlot(false);
          triggerInsert();
        }}
        className={`relative mt-3 flex h-24 w-20 flex-col items-center justify-center rounded-xl border-2 transition-colors ${
          dragOverSlot
            ? 'border-[#C93B4B] bg-[#FFF5F5]'
            : 'border-[#B8AE9D] bg-gradient-to-b from-[#EDE6D8] to-[#D9CFBE]'
        } shadow-inner`}
      >
        {/* Top & Bottom Decorative Brass Screws */}
        <span className="absolute top-1.5 h-1.5 w-1.5 rounded-full bg-[#8E8372]" />
        <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#8E8372]" />

        {/* Vertical Coin Chute Opening */}
        <div className="h-12 w-3 rounded-full border border-[#6E6559] bg-[#221F1C] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />

        {/* Animated Dropping Coin */}
        {inserting && (
          <div
            aria-hidden="true"
            className="vintage-gold-coin animate-coin-insert absolute -top-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#A6741D] font-editorial text-base font-bold text-[#6E4809]"
          >
            ♥
          </div>
        )}
      </div>

      {/* Draggable Golden Coin + Status */}
      {!unlocked ? (
        <>
          <div className="mt-4 flex flex-col items-center">
            {!inserting && (
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', 'gold-coin');
                }}
                onClick={triggerInsert}
                title="Drag coin into the slot or click to insert"
                className="vintage-gold-coin flex h-12 w-12 cursor-grab items-center justify-center rounded-full border-2 border-[#A6741D] font-editorial text-lg font-bold text-[#6E4809] transition-transform hover:scale-105 active:cursor-grabbing"
              >
                ♥
              </div>
            )}
            <p className="mt-2.5 text-xs leading-relaxed text-[#6C6258]">
              Insert a coin to unlock your letter.
            </p>
          </div>

          <button
            type="button"
            disabled={inserting}
            onClick={triggerInsert}
            className="mt-3.5 inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#2C2926] bg-[#74B7C4] px-4 py-2 font-typewriter text-xs font-bold tracking-wider text-[#1F2426] shadow-[0_3px_0_#2C2926] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-70"
          >
            <Coins className="h-3.5 w-3.5" />
            <span>{inserting ? 'UNLOCKING...' : 'INSERT COIN ♥'}</span>
          </button>
        </>
      ) : (
        <div className="mt-4 flex w-full flex-col items-center">
          <p className="font-typewriter text-xs font-bold text-[#3D7D89]">
            MACHINE UNLOCKED ♥
          </p>
          <p className="mt-1 text-[11px] text-[#786D62]">
            Ready to write or type freely.
          </p>
          <button
            type="button"
            onClick={() => {
              typewriterAudio.playKeyClack(true);
              onResetMachine();
            }}
            className="mt-3 inline-flex min-h-[38px] w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#CEC3B2] bg-white px-4 py-1.5 text-xs font-semibold text-[#5C534A] hover:bg-[#F5EFE4] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Machine</span>
          </button>
        </div>
      )}
    </aside>
  );
};
