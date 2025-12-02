import { useState } from 'react';
import { ArrowRight, ArrowLeft, Send, User, Mail, MapPin } from 'lucide-react';

/**
 * @figmaAssetKey 6d1ead89754c0067a0bb4e84712d7a1788101fd3
 */

type StickerSource = 'preset' | 'ai';

interface Sticker {
  id: number;
  emoji: string;
  source: StickerSource;
}

interface LetterData {
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  message: string;
  stickers: Sticker[];
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = 4; // 1: Recipient, 2: Write, 3: Stickers, 4: Review
  const clampedStep = Math.min(Math.max(currentStep, 1), steps);
  const progress = ((clampedStep - 1) / (steps - 1)) * 100;

  return (
    <div className="relative h-[41px] w-[200px]">
      <div className="absolute bg-white bottom-0 left-0 right-0 rounded-[50px] top-[51.22%]">
        <div
          aria-hidden="true"
          className="absolute border border-[#9ac7d3] border-solid inset-0 pointer-events-none rounded-[50px]"
        />
      </div>
      <div
        className="absolute bg-[#9ac7d3] bottom-0 left-0 rounded-[50px] top-[51.22%] transition-all duration-300"
        style={{ right: `${100 - progress * 0.465}%` }}
      />
      <p className="absolute bottom-[58.54%] font-['Chivo:Regular',sans-serif] font-normal leading-[normal] left-0 right-[77%] text-[#528998] text-[14px] text-nowrap top-0 whitespace-pre">
        Step {clampedStep}:
      </p>
    </div>
  );
}

function Header({ currentStep, showProgress }: { currentStep: number; showProgress: boolean }) {
  return (
    <div className="absolute w-full top-0 left-0">
      <div className="bg-[#ddf7fe] box-border content-stretch flex h-[83px] items-center justify-between px-[25px] py-[19px] relative w-full">
        <p className="font-['Instrument_Serif:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#27263e] text-[33.706px] text-nowrap whitespace-pre">
          Wish<span className="text-[#787878]">Mail</span>
        </p>
        {showProgress && <ProgressBar currentStep={currentStep} />}
      </div>
    </div>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 text-center">
          <p className="font-['Instrument_Serif:Regular',sans-serif] leading-[normal] not-italic text-[#27263e] text-[102.308px] text-nowrap whitespace-pre mb-4">
            Wish<span className="text-[#787878]">Mail</span>
          </p>
          <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] text-[#27263e] text-[22px] text-nowrap whitespace-pre mb-8">
            Create and send letters to your loved ones.
          </p>
          <button
            onClick={onStart}
            className="bg-[#3ea7c1] box-border content-stretch flex gap-[10px] items-center justify-center px-[60px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#3598ab] transition-colors mx-auto"
          >
            <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">
              Start
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

function Step1Recipient({
  data,
  onUpdate,
  onNext,
}: {
  data: LetterData;
  onUpdate: (data: Partial<LetterData>) => void;
  onNext: () => void;
}) {
  const isValid = data.recipientName && data.recipientAddress && data.recipientCity;

  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-8">
            Recipient Details
          </h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px] mb-2">
                <User className="w-5 h-5 text-[#3ea7c1]" />
                Recipient Name
              </label>
              <input
                type="text"
                value={data.recipientName}
                onChange={e => onUpdate({ recipientName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#9ac7d3] rounded-lg font-['Chivo:Regular',sans-serif] text-[18px] focus:outline-none focus:border-[#3ea7c1] transition-colors"
                placeholder="Enter recipient's name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px] mb-2">
                <MapPin className="w-5 h-5 text-[#3ea7c1]" />
                Street Address
              </label>
              <input
                type="text"
                value={data.recipientAddress}
                onChange={e => onUpdate({ recipientAddress: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#9ac7d3] rounded-lg font-['Chivo:Regular',sans-serif] text-[18px] focus:outline-none focus:border-[#3ea7c1] transition-colors"
                placeholder="Enter street address"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px] mb-2">
                <Mail className="w-5 h-5 text-[#3ea7c1]" />
                City, State, ZIP
              </label>
              <input
                type="text"
                value={data.recipientCity}
                onChange={e => onUpdate({ recipientCity: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#9ac7d3] rounded-lg font-['Chivo:Regular',sans-serif] text-[18px] focus:outline-none focus:border-[#3ea7c1] transition-colors"
                placeholder="Enter city, state, and ZIP code"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={onNext}
              disabled={!isValid}
              className="bg-[#3ea7c1] text-white px-8 py-3 rounded-lg font-['Chivo:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-[#3598ab] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2Write({
  data,
  onUpdate,
  onNext,
  onBack,
}: {
  data: LetterData;
  onUpdate: (data: Partial<LetterData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid = data.message.trim().length > 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-8">
            Write Your Letter
          </h2>

          <div className="space-y-4">
            <label className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px]">
              Your Message
            </label>
            <textarea
              value={data.message}
              onChange={e => onUpdate({ message: e.target.value })}
              className="w-full h-[320px] px-4 py-3 border-2 border-[#9ac7d3] rounded-lg font-['Chivo:Regular',sans-serif] text-[18px] focus:outline-none focus:border-[#3ea7c1] transition-colors resize-none"
              placeholder="Write your heartfelt message here..."
            />
            <p className="text-right font-['Chivo:Regular',sans-serif] text-[#787878] text-[14px]">
              {data.message.length} characters
            </p>
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
              disabled={!isValid}
              className="bg-[#3ea7c1] text-white px-8 py-3 rounded-lg font-['Chivo:Regular',sans-serif] text-[20px] flex items-center gap-2 hover:bg-[#3598ab] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple “fake AI” helper you can later swap with a real API call.
 * Given the letter text, returns some emoji suggestions.
 */
function getAISuggestedStickers(message: string): string[] {
  const text = message.toLowerCase();
  const suggestions = new Set<string>();

  // Generic warm stickers
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

  // If message is very short/empty, fall back to some generic ones
  if (text.trim().length < 10) {
    suggestions.add('🌈');
    suggestions.add('🐻');
  }

  return Array.from(suggestions);
}

function Step3Stickers({
  data,
  onAddSticker,
  onRemoveSticker,
  onNext,
  onBack,
}: {
  data: LetterData;
  onAddSticker: (emoji: string, source: StickerSource) => void;
  onRemoveSticker: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const stickerOptions = ['💌', '🌈', '⭐', '🎂', '🎉', '🐻'];

  const [aiStickers, setAiStickers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    // In a real app, you’d call your AI endpoint here:
    // const res = await fetch('/api/generate-stickers', { ... })
    // const data = await res.json();
    const suggestions = getAISuggestedStickers(data.message);
    setAiStickers(suggestions);
    setIsGenerating(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
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

function Step4Review({
  data,
  onBack,
  onSend,
}: {
  data: LetterData;
  onBack: () => void;
  onSend: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
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

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-24 h-24 bg-[#3ea7c1] rounded-full flex items-center justify-center">
              <Send className="w-12 h-12 text-white" />
            </div>
            <p className="font-['Instrument_Serif:Regular',sans-serif] leading-[normal] not-italic text-[#27263e] text-[64px] text-nowrap whitespace-pre">
              Letter Sent!
            </p>
          </div>
          <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] text-[#27263e] text-[22px] text-nowrap whitespace-pre mb-8">
            Your letter is on its way to your loved one.
          </p>
          <button
            onClick={onReset}
            className="bg-[#3ea7c1] box-border content-stretch flex gap-[10px] items-center justify-center px-[60px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#3598ab] transition-colors mx-auto"
          >
            <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">
              Create Another
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IPadPro() {
  const [currentStep, setCurrentStep] = useState(0);
  const [letterData, setLetterData] = useState<LetterData>({
    recipientName: '',
    recipientAddress: '',
    recipientCity: '',
    message: '',
    stickers: [],
  });

  const updateLetterData = (data: Partial<LetterData>) => {
    setLetterData(prev => ({ ...prev, ...data }));
  };

  const addSticker = (emoji: string, source: StickerSource) => {
    setLetterData(prev => ({
      ...prev,
      stickers: [
        ...prev.stickers,
        {
          id: Date.now() + Math.random(),
          emoji,
          source,
        },
      ],
    }));
  };

  const removeSticker = (id: number) => {
    setLetterData(prev => ({
      ...prev,
      stickers: prev.stickers.filter(s => s.id !== id),
    }));
  };

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSend = () => {
    setCurrentStep(5);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setLetterData({
      recipientName: '',
      recipientAddress: '',
      recipientCity: '',
      message: '',
      stickers: [],
    });
  };

  return (
    <div className="bg-[#f5fdff] relative size-full" data-name="iPad Pro 11' - 1">
      <Header currentStep={currentStep} showProgress={currentStep > 0 && currentStep < 5} />

      {currentStep === 0 && <WelcomeScreen onStart={handleStart} />}
      {currentStep === 1 && (
        <Step1Recipient data={letterData} onUpdate={updateLetterData} onNext={handleNext} />
      )}
      {currentStep === 2 && (
        <Step2Write
          data={letterData}
          onUpdate={updateLetterData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <Step3Stickers
          data={letterData}
          onAddSticker={addSticker}
          onRemoveSticker={removeSticker}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 4 && (
        <Step4Review data={letterData} onBack={handleBack} onSend={handleSend} />
      )}
      {currentStep === 5 && <SuccessScreen onReset={handleReset} />}
    </div>
  );
}
