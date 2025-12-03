import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LetterData, StickerSource } from '../../types/letter';

function getAISuggestedStickers(message: string): string[] {
  const text = message.toLowerCase();
  const suggestions = new Set<string>();

  suggestions.add('💌');
  suggestions.add('💖');
  suggestions.add('🌟');

  if (text.includes('birthday') || text.includes('bday')) {
    suggestions.add('🎂');
    suggestions.add('🎁');
    suggestions.add('🎉');
  }

  if (text.includes('congrats') || text.includes('congratulations') || text.includes('proud')) {
    suggestions.add('🏆');
    suggestions.add('🎓');
  }

  if (text.includes('love') || text.includes('miss you') || text.includes('hug')) {
    suggestions.add('💕');
    suggestions.add('🥰');
  }

  if (text.includes('holiday') || text.includes('christmas') || text.includes('new year')) {
    suggestions.add('🎄');
    suggestions.add('✨');
  }

  if (text.trim().length < 10) {
    suggestions.add('🌈');
    suggestions.add('🐻');
  }

  return Array.from(suggestions);
}

type Step3StickersProps = {
  data: LetterData;
  onAddSticker: (emoji: string, source: StickerSource) => void;
  onRemoveSticker: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step3Stickers({
  data,
  onAddSticker,
  onRemoveSticker,
  onNext,
  onBack,
}: Step3StickersProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const stickerOptions = ['💌', '🌈', '⭐', '🎂', '🎉', '🐻'];

  const [aiStickers, setAiStickers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    const suggestions = getAISuggestedStickers(data.message);
    setAiStickers(suggestions);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-brand-bg">
        <div className="mt-2 flex items-center justify-between">
          <p className="font-['Chivo',sans-serif] text-sm md:text-base text-[#787878]">
            Drag stickers from the panel into your letter canvas.
          </p>

          <button
            type="button"
            onClick={() => setIsPanelOpen(prev => !prev)}
            className="text-xs md:text-sm font-['Chivo',sans-serif] px-3 py-1 rounded-full border border-[#3ea7c1] text-[#3ea7c1] hover:bg-[#e2f6fb] transition-colors"
          >
            {isPanelOpen ? 'Hide sticker panel' : 'Show sticker panel'}
          </button>
        </div>
      <div className="bg-white w-full max-w-3xl mx-auto rounded-xl border border-brand-border shadow-sm p-10 text-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-4">
            Decorate with Stickers
          </h2>
          <p className="font-['Chivo:Regular',sans-serif] text-[#787878] text-[16px] mb-6">
            Add fun stickers to your letter. These will appear on the final card your
            recipient sees.
          </p>

          {/* Preset sticker palette */}
          <div className="mb-6">
            <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px] mb-2">
              Choose stickers
            </p>
            <div className="flex flex-wrap gap-3">
              {stickerOptions.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onAddSticker(emoji, 'preset')}
                  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#9ac7d3] bg-[#f5fdff] text-2xl hover:bg-[#e2f6fb] transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* AI sticker suggestions */}
          <div className="mb-6 border-t border-dashed border-[#9ac7d3] pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px]">
                AI Sticker Suggestions
              </p>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="text-[14px] font-['Chivo:Regular',sans-serif] px-3 py-1 rounded-full border border-[#3ea7c1] text-[#3ea7c1] hover:bg-[#e2f6fb] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Thinking…' : 'Generate from my letter'}
              </button>
            </div>
            {aiStickers.length === 0 ? (
              <p className="font-['Chivo:Regular',sans-serif] text-[#787878] text-[14px]">
                Use “Generate from my letter” to get AI-picked stickers that match your
                message.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {aiStickers.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onAddSticker(emoji, 'ai')}
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-dashed border-[#3ea7c1] bg-[#f5fdff] text-2xl hover:bg-[#e2f6fb] transition-colors relative"
                    title="AI-generated sticker"
                  >
                    {emoji}
                    <span className="absolute -top-1 -right-1 bg-[#3ea7c1] text-white text-[9px] px-1 py-[1px] rounded-full uppercase tracking-wide">
                      AI
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected stickers */}
          <div className="mb-6">
            <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px] mb-2">
              Stickers on your letter
            </p>
            {data.stickers.length === 0 ? (
              <p className="font-['Chivo:Regular',sans-serif] text-[#787878] text-[14px]">
                You haven&apos;t added any stickers yet. Tap a sticker above to add it!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.stickers.map(sticker => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => onRemoveSticker(sticker.id)}
                    className="px-3 py-1 rounded-full bg-[#f5fdff] border border-[#9ac7d3] text-2xl hover:bg-[#e2f6fb] flex items-center gap-1"
                    title={
                      sticker.source === 'ai'
                        ? 'Remove AI-generated sticker'
                        : 'Remove sticker'
                    }
                  >
                    {sticker.emoji}
                    {sticker.source === 'ai' && (
                      <span className="text-[9px] uppercase tracking-wide text-[#3ea7c1] ml-1">
                        AI
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={onBack}
              className="bg-gray-200 text-[#27263e] px-8 py-3 rounded-lg font-['Chivo:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={onNext}
              className="bg-[#3ea7c1] text-white px-8 py-3 rounded-lg font-['Chivo:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-[#3598ab] transition-colors"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}