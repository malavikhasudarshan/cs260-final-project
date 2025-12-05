import React from 'react';

function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = 4;
  const clampedStep = Math.min(Math.max(currentStep, 1), steps);
  const progress = ((clampedStep - 1) / (steps - 1)) * 100;

  return (
    <div className="relative h-10 w-48">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-[#9ac7d3]"
        />
      </div>
      <div
        className="absolute inset-y-1/2 left-0 -translate-y-1/2 rounded-full bg-[#9ac7d3] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
      {/* Step label removed */}
      {/*
      <p className="absolute left-0 top-0 text-sm font-normal text-[#528998]">
        Step {clampedStep}:
      </p>
      */}
    </div>
  );
}

type HeaderProps = {
  currentStep: number;
  showProgress: boolean;
};

export function Header({ currentStep, showProgress }: HeaderProps) {
  return (
    <header className="w-full bg-[#ddf7fe] px-6 py-4 flex h-20 items-center justify-between">
      <p className="font-['Instrument_Serif',serif] text-[28px] leading-none text-[#27263e]">
        Wish<span className="text-[#787878]">Mail</span>
      </p>
      {showProgress && <ProgressBar currentStep={currentStep} />}
    </header>
  );
}

export default Header;