import React from 'react';

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-brand-bg">
      <div className="bg-white w-full max-w-3xl mx-auto rounded-xl border border-brand-border shadow-sm p-10 text-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 text-center">
          <p className="font-['Instrument Serif',serif] leading-[normal] not-italic text-[#27263e] text-[102.308px] text-nowrap whitespace-pre mb-4">
            Wish<span className="text-[#787878]">Mail</span>
          </p>
          <p className="font-['Chivo',sans-serif] font-normal leading-[normal] text-[#27263e] text-[22px] text-nowrap whitespace-pre mb-8">
            Create and send letters to your loved ones.
          </p>
          <button
            onClick={onStart}
            className="bg-[#3ea7c1] box-border content-stretch flex gap-[10px] items-center justify-center px-[60px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#3598ab] transition-colors mx-auto mb-8"
          >
            <p className="font-['Chivo',sans-serif] font-normal leading-[normal] relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">
              Start
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
