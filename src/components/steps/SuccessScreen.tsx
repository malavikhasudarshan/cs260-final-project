import React from 'react';
import { Send } from 'lucide-react';

type SuccessScreenProps = {
  onReset: () => void;
};

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-brand-bg">
      <div className="bg-white w-full max-w-3xl mx-auto rounded-xl border border-brand-border shadow-sm p-10 text-center">
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