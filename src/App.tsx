import { useState } from 'react';
import { Header } from './components/layout/Header';
import { WelcomeScreen } from './components/steps/WelcomeScreen';
import { Step1Recipient } from './components/steps/Step1Recipient';
import { Step2WriteAndStickers } from './components/steps/Step2WriteAndStickers';
import { Step4Review } from './components/steps/Step4Review';
import { SuccessScreen } from './components/steps/SuccessScreen';
import type { LetterData, StickerSource } from './types/letter';

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
    // go to success screen
    setCurrentStep(4);
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
      {/* Progress hides on welcome + success */}
      <Header
        currentStep={currentStep}
        showProgress={currentStep >= 1 && currentStep < 4}
      />

      {currentStep === 0 && <WelcomeScreen onStart={handleStart} />}

      {currentStep === 1 && (
        <Step1Recipient
          data={letterData}
          onUpdate={updateLetterData}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <Step2WriteAndStickers
          data={letterData}
          onUpdate={updateLetterData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 3 && (
        <Step4Review
          data={letterData}
          onBack={handleBack}
          onSend={handleSend}
        />
      )}

      {currentStep === 4 && (
        <SuccessScreen onReset={handleReset} />
      )}
    </div>
  );
}
