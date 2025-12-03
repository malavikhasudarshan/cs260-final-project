import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import type { LetterData } from '../../types/letter';

type Step4ReviewProps = {
  data: LetterData;
  onBack: () => void;
  onSend: () => void;
};

export function Step4Review({ data, onBack, onSend }: Step4ReviewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-brand-bg">
      <div className="bg-white w-full max-w-3xl mx-auto rounded-xl border border-brand-border shadow-sm p-10 text-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-8">
            Review &amp; Send
          </h2>

          <div className="bg-[#f5fdff] rounded-lg p-8 mb-6 border-2 border-[#9ac7d3]">
            <div className="mb-6">
              <p className="font-['Chivo:Regular',sans-serif] text-[#787878] text-[14px] mb-1">
                To:
              </p>
              <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[20px]">
                {data.recipientName}
              </p>
              <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[16px]">
                {data.recipientAddress}
              </p>
              <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[16px]">
                {data.recipientCity}
              </p>
            </div>

            <div className="border-t-2 border-[#9ac7d3] pt-6">
              <p className="font-['Chivo:Regular',sans-serif] text-[#787878] text-[14px] mb-2">
                Message:
              </p>
              <div className="bg-white rounded-lg p-4 max-h-[200px] overflow-y-auto">
                <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[16px] whitespace-pre-wrap">
                  {data.message}
                </p>

                {data.stickers.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.stickers.map(sticker => (
                      <span
                        key={sticker.id}
                        className="text-2xl relative inline-flex items-center"
                        title={sticker.source === 'ai' ? 'AI-generated sticker' : 'Sticker'}
                      >
                        {sticker.emoji}
                        {sticker.source === 'ai' && (
                          <span className="ml-1 text-[9px] uppercase tracking-wide text-[#3ea7c1]">
                            AI
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="bg-gray-200 text-[#27263e] px-8 py-3 rounded-lg font-['Chivo:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={onSend}
              className="bg-[#3ea7c1] text-white px-8 py-3 rounded-lg font-['Chivo:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-[#3598ab] transition-colors"
            >
              <Send className="w-5 h-5" /> Send Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}