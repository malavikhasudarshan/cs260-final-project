import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import type { LetterData } from '../../types/letter';

type Step4ReviewProps = {
  data: LetterData;
  onBack: () => void;
  onSend: () => void;
};

// Constants matching Step3WriteAndStickers
const LETTER_BOX_WIDTH = 1500;
const LETTER_BOX_HEIGHT = 415;
const TEXT_PADDING_LEFT = 72;
const TEXT_PADDING_RIGHT = 24;
const TEXT_PADDING_TOP = 24;
const TEXT_PADDING_BOTTOM = 24;

export function Step4Review({ data, onBack, onSend }: Step4ReviewProps) {
  // Calculate scale to fit letter preview in available space
  const previewScale = 0.4; // Scale down to 40% for preview
  const previewWidth = LETTER_BOX_WIDTH * previewScale;
  const previewHeight = LETTER_BOX_HEIGHT * previewScale;

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-brand-bg pb-24 px-4">
      <div className="bg-white w-full max-w-5xl mx-auto rounded-xl border border-brand-border shadow-sm p-12 my-8">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-12 text-center">
            Review &amp; Send
          </h2>

          {/* Recipient Info - Centered */}
          <div className="mb-12 text-center">
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[#787878] text-[16px] mb-2">
              To:
            </p>
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[24px] mb-1">
              {data.recipientName}
            </p>
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[18px] mb-1">
              {data.recipientAddress}
            </p>
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[18px]">
              {data.recipientCity}
            </p>
          </div>

          {/* Letter Preview with Stickers */}
          <div className="mb-12">
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[#787878] text-[18px] mb-6 text-center">
              Letter Preview:
            </p>
            <div className="flex justify-center">
              <div
                className="relative bg-white rounded-[14px] border-2 border-[#9ac7d3] shadow-lg"
                style={{
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`,
                  backgroundImage: `
                    repeating-linear-gradient(to bottom, #e3e7ee 0px, #e3e7ee 1px, transparent 1px, transparent ${28 * previewScale}px),
                    linear-gradient(to right, #9ac7d3 ${50 * previewScale}px, transparent ${50 * previewScale}px)
                  `,
                  backgroundColor: 'white',
                  backgroundRepeat: 'no-repeat, no-repeat',
                  backgroundSize: '100% 100%, 100% 100%',
                  transform: 'scale(1)',
                  transformOrigin: 'top left',
                }}
              >
                {/* Message Text */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    fontFamily: '"Chivo", sans-serif',
                    fontSize: `${18 * previewScale}px`,
                    paddingLeft: `${TEXT_PADDING_LEFT * previewScale}px`,
                    paddingRight: `${TEXT_PADDING_RIGHT * previewScale}px`,
                    paddingTop: `${TEXT_PADDING_TOP * previewScale}px`,
                    paddingBottom: `${TEXT_PADDING_BOTTOM * previewScale}px`,
                    color: '#27263e',
                    lineHeight: '1.75',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                  }}
                >
                  {data.message || 'Your message will appear here...'}
                </div>

                {/* Stickers positioned exactly as placed */}
                {data.stickers.map(sticker => (
                  <div
                    key={sticker.id}
                    className="absolute select-none pointer-events-none"
                    style={{
                      left: `${sticker.x * previewScale}px`,
                      top: `${sticker.y * previewScale}px`,
                      fontSize: `${sticker.size * previewScale}px`,
                    }}
                  >
                    {sticker.emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-12">
            <button
              onClick={onBack}
              className="bg-gray-200 text-[#27263e] px-8 py-3 rounded-lg font-['Instrument_Serif:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={onSend}
              className="bg-[#3ea7c1] text-white px-8 py-3 rounded-lg font-['Instrument_Serif:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-[#3598ab] transition-colors"
            >
              <Send className="w-5 h-5" /> Send Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}