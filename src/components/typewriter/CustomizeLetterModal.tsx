import React, { useState } from 'react';
import { RotateCcw, Save, X } from 'lucide-react';
import { DEFAULT_MIGEL_LETTER } from '../../lib/letterData';

interface CustomizeLetterModalProps {
  currentLetter: string;
  onSave: (newText: string) => void;
  onClose: () => void;
}

export const CustomizeLetterModal: React.FC<CustomizeLetterModalProps> = ({
  currentLetter,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState(currentLetter);

  const handleSave = () => {
    const cleaned = draft.trim();
    if (!cleaned) return;
    onSave(cleaned);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2724]/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl border border-[#D7CBB3] bg-[#FDFBF7] p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close letter customizer"
          className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#DFD5C4] bg-white text-[#5C534A] hover:bg-[#F5EFE4]"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-editorial text-2xl font-semibold text-[#2F2B28]">
          Customize Love Letter
        </h2>
        <p className="mt-1 text-xs text-[#6C6258]">
          Edit the letter below to personalize what the vintage typewriter writes for Migel.
        </p>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={11}
          className="font-typewriter mt-4 w-full rounded-2xl border border-[#D4C7B2] bg-[#FFFEFA] p-4 text-sm leading-relaxed text-[#2B2724] focus:border-[#4A8B98] focus:outline-none"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_MIGEL_LETTER)}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border border-[#D4C7B2] bg-white px-4 py-2 text-xs font-semibold text-[#5C534A] hover:bg-[#F5EFE4]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] cursor-pointer rounded-full border border-[#D4C7B2] bg-white px-4 py-2 text-xs font-semibold text-[#5C534A] hover:bg-[#F5EFE4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border border-[#2C2926] bg-[#74B7C4] px-5 py-2 font-typewriter text-xs font-bold text-[#1F2426] shadow-[0_2px_0_#2C2926]"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Letter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
