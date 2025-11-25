import { useState } from 'react';
import { ArrowRight, ArrowLeft, Send, User, Mail, MapPin } from 'lucide-react';

/**
 * @figmaAssetKey 6d1ead89754c0067a0bb4e84712d7a1788101fd3
 */
function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = 3;
  const progress = ((currentStep - 1) / (steps - 1)) * 100;
  
  return (
    <div className="relative h-[41px] w-[200px]">
      <div className="absolute bg-white bottom-0 left-0 right-0 rounded-[50px] top-[51.22%]">
        <div aria-hidden="true" className="absolute border border-[#9ac7d3] border-solid inset-0 pointer-events-none rounded-[50px]" />
      </div>
      <div 
        className="absolute bg-[#9ac7d3] bottom-0 left-0 rounded-[50px] top-[51.22%] transition-all duration-300"
        style={{ right: `${100 - progress * 0.465}%` }}
      />
      <p className="absolute bottom-[58.54%] font-['Chivo:Regular',sans-serif] font-normal leading-[normal] left-0 right-[77%] text-[#528998] text-[14px] text-nowrap top-0 whitespace-pre">
        Step {currentStep}: 
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
        <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <div className="relative z-10 text-center">
          <p className="font-['Instrument_Serif:Regular',sans-serif] leading-[normal] not-italic text-[#27263e] text-[102.308px] text-nowrap whitespace-pre mb-4">
            Wish<span className="text-[#787878]">Mail</span>
          </p>
          <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] text-[#27263e] text-[22px] text-nowrap whitespace-pre mb-8">Create and send letters to your loved ones.</p>
          <button 
            onClick={onStart}
            className="bg-[#3ea7c1] box-border content-stretch flex gap-[10px] items-center justify-center px-[60px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#3598ab] transition-colors mx-auto"
          >
            <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">Start</p>
          </button>
        </div>
      </div>
    </div>
  );
}

interface LetterData {
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  message: string;
}

function Step1({ data, onUpdate, onNext }: { data: LetterData; onUpdate: (data: Partial<LetterData>) => void; onNext: () => void }) {
  const isValid = data.recipientName && data.recipientAddress && data.recipientCity;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
        <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-8">Recipient Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px] mb-2">
                <User className="w-5 h-5 text-[#3ea7c1]" />
                Recipient Name
              </label>
              <input
                type="text"
                value={data.recipientName}
                onChange={(e) => onUpdate({ recipientName: e.target.value })}
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
                onChange={(e) => onUpdate({ recipientAddress: e.target.value })}
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
                onChange={(e) => onUpdate({ recipientCity: e.target.value })}
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

function Step2({ data, onUpdate, onNext, onBack }: { data: LetterData; onUpdate: (data: Partial<LetterData>) => void; onNext: () => void; onBack: () => void }) {
  const isValid = data.message.trim().length > 0;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
        <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-8">Write Your Letter</h2>
          
          <div className="space-y-4">
            <label className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[18px]">
              Your Message
            </label>
            <textarea
              value={data.message}
              onChange={(e) => onUpdate({ message: e.target.value })}
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

function Step3({ data, onBack, onSend }: { data: LetterData; onBack: () => void; onSend: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-[83px]">
      <div className="bg-white h-[654px] relative rounded-[14px] w-[1024px] flex items-center justify-center">
        <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[#27263e] text-[48px] mb-8">Review & Send</h2>
          
          <div className="bg-[#f5fdff] rounded-lg p-8 mb-6 border-2 border-[#9ac7d3]">
            <div className="mb-6">
              <p className="font-['Chivo:Regular',sans-serif] text-[#787878] text-[14px] mb-1">To:</p>
              <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[20px]">{data.recipientName}</p>
              <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[16px]">{data.recipientAddress}</p>
              <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[16px]">{data.recipientCity}</p>
            </div>
            
            <div className="border-t-2 border-[#9ac7d3] pt-6">
              <p className="font-['Chivo:Regular',sans-serif] text-[#787878] text-[14px] mb-2">Message:</p>
              <div className="bg-white rounded-lg p-4 max-h-[200px] overflow-y-auto">
                <p className="font-['Chivo:Regular',sans-serif] text-[#27263e] text-[16px] whitespace-pre-wrap">
                  {data.message}
                </p>
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
        <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-24 h-24 bg-[#3ea7c1] rounded-full flex items-center justify-center">
              <Send className="w-12 h-12 text-white" />
            </div>
            <p className="font-['Instrument_Serif:Regular',sans-serif] leading-[normal] not-italic text-[#27263e] text-[64px] text-nowrap whitespace-pre">
              Letter Sent!
            </p>
          </div>
          <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] text-[#27263e] text-[22px] text-nowrap whitespace-pre mb-8">Your letter is on its way to your loved one.</p>
          <button 
            onClick={onReset}
            className="bg-[#3ea7c1] box-border content-stretch flex gap-[10px] items-center justify-center px-[60px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#3598ab] transition-colors mx-auto"
          >
            <p className="font-['Chivo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">Create Another</p>
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
  });

  const updateLetterData = (data: Partial<LetterData>) => {
    setLetterData(prev => ({ ...prev, ...data }));
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
    setCurrentStep(4);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setLetterData({
      recipientName: '',
      recipientAddress: '',
      recipientCity: '',
      message: '',
    });
  };

  return (
    <div className="bg-[#f5fdff] relative size-full" data-name="iPad Pro 11' - 1">
      <Header currentStep={currentStep} showProgress={currentStep > 0 && currentStep < 4} />
      
      {currentStep === 0 && <WelcomeScreen onStart={handleStart} />}
      {currentStep === 1 && <Step1 data={letterData} onUpdate={updateLetterData} onNext={handleNext} />}
      {currentStep === 2 && <Step2 data={letterData} onUpdate={updateLetterData} onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <Step3 data={letterData} onBack={handleBack} onSend={handleSend} />}
      {currentStep === 4 && <SuccessScreen onReset={handleReset} />}
    </div>
  );
}