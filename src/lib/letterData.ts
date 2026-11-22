export const DEFAULT_MIGEL_LETTER = `Dear Migel,

I don't really know where to begin, but I guess every little story deserves a beginning.

So here I am, leaving you a little letter, written one word at a time.

Maybe it's just a simple letter, but I hope it brings a little smile to your face.

Some people make ordinary days feel a little more special, and I think you are one of those people.

I hope you never forget how lovely you are.

With a little warmth,
Someone who wanted to make you smile. ♥`;

export const SECRET_MACHINE_NOTE =
  'psst... this little machine was made just for you, Migel. ♥';

export const ENVELOPE_FINAL_LINES = {
  heading: "Well, that's my little letter for you.",
  subheading: 'Hope it made your day a little brighter, Migel. ♥',
  keepsake:
    'No matter how busy or quiet the days get, remember there is someone out there rooting for your happiness and hoping you always have reasons to smile. ♥',
};

export interface TypewriterKeySpec {
  id: string;
  label: string;
  shiftLabel?: string;
  type: 'char' | 'backspace' | 'enter' | 'shift' | 'heart' | 'space';
  widthClass?: string;
}

export const TYPEWRITER_KEY_ROWS: TypewriterKeySpec[][] = [
  [
    { id: '1', label: '1', shiftLabel: '!', type: 'char' },
    { id: '2', label: '2', shiftLabel: '@', type: 'char' },
    { id: '3', label: '3', shiftLabel: '#', type: 'char' },
    { id: '4', label: '4', shiftLabel: '$', type: 'char' },
    { id: '5', label: '5', shiftLabel: '%', type: 'char' },
    { id: '6', label: '6', shiftLabel: '^', type: 'char' },
    { id: '7', label: '7', shiftLabel: '&', type: 'char' },
    { id: '8', label: '8', shiftLabel: '*', type: 'char' },
    { id: '9', label: '9', shiftLabel: '(', type: 'char' },
    { id: '0', label: '0', shiftLabel: ')', type: 'char' },
    { id: '-', label: '-', shiftLabel: '_', type: 'char' },
    { id: 'Backspace', label: '⌫', type: 'backspace' },
  ],
  [
    { id: 'Q', label: 'Q', type: 'char' },
    { id: 'W', label: 'W', type: 'char' },
    { id: 'E', label: 'E', type: 'char' },
    { id: 'R', label: 'R', type: 'char' },
    { id: 'T', label: 'T', type: 'char' },
    { id: 'Y', label: 'Y', type: 'char' },
    { id: 'U', label: 'U', type: 'char' },
    { id: 'I', label: 'I', type: 'char' },
    { id: 'O', label: 'O', type: 'char' },
    { id: 'P', label: 'P', type: 'char' },
  ],
  [
    { id: 'A', label: 'A', type: 'char' },
    { id: 'S', label: 'S', type: 'char' },
    { id: 'D', label: 'D', type: 'char' },
    { id: 'F', label: 'F', type: 'char' },
    { id: 'G', label: 'G', type: 'char' },
    { id: 'H', label: 'H', type: 'char' },
    { id: 'J', label: 'J', type: 'char' },
    { id: 'K', label: 'K', type: 'char' },
    { id: 'L', label: 'L', type: 'char' },
    { id: ';', label: ';', shiftLabel: ':', type: 'char' },
    { id: "'", label: "'", shiftLabel: '"', type: 'char' },
    { id: 'Enter', label: '↵', type: 'enter' },
  ],
  [
    { id: 'Shift', label: '⇧', type: 'shift' },
    { id: 'Z', label: 'Z', type: 'char' },
    { id: 'X', label: 'X', type: 'char' },
    { id: 'C', label: 'C', type: 'char' },
    { id: 'V', label: 'V', type: 'char' },
    { id: 'B', label: 'B', type: 'char' },
    { id: 'N', label: 'N', type: 'char' },
    { id: 'M', label: 'M', type: 'char' },
    { id: ',', label: ',', shiftLabel: '<', type: 'char' },
    { id: '.', label: '.', shiftLabel: '>', type: 'char' },
    { id: '/', label: '/', shiftLabel: '?', type: 'char' },
    { id: 'Heart', label: '♥', type: 'heart' },
  ],
];

const CUSTOM_LETTER_KEY = 'migel_custom_love_letter_v1';

export function loadCustomLetter(): string {
  if (typeof window === 'undefined') return DEFAULT_MIGEL_LETTER;
  try {
    const saved = window.localStorage.getItem(CUSTOM_LETTER_KEY);
    return saved && saved.trim().length > 0 ? saved : DEFAULT_MIGEL_LETTER;
  } catch {
    return DEFAULT_MIGEL_LETTER;
  }
}

export function saveCustomLetter(text: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CUSTOM_LETTER_KEY, text);
  } catch {
    // Ignore quota errors
  }
}
