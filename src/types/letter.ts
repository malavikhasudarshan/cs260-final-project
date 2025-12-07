export type StickerSource = 'preset' | 'ai';

export interface Sticker {
  id: number;
  emoji: string;
  source: StickerSource;
  x: number;
  y: number;
  size: number;
}

export interface LetterData {
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  message: string;
  stickers: Sticker[];
}