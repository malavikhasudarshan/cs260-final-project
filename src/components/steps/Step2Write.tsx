import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LetterData } from '../../types/letter';

type Step2WriteProps = {
  data: LetterData;
  onUpdate: (data: Partial<LetterData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step2Write({ data, onUpdate, onNext, onBack }: Step2WriteProps) {
  const isValid = data.message.trim().length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-brand-bg">
      <div className="bg-white w-full max-w-3xl mx-auto rounded-xl border border-brand-border shadow-sm p-10 text-center">
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