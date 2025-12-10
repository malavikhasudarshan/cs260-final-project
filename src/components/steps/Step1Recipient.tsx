import React from 'react';
import { User, Mail, MapPin, ArrowRight } from 'lucide-react';
import type { LetterData } from '../../types/letter';

type Step1RecipientProps = {
  data: LetterData;
  onUpdate: (data: Partial<LetterData>) => void;
  onNext: () => void;
};

export function Step1Recipient({ data, onUpdate, onNext }: Step1RecipientProps) {
  const isValid = data.recipientName && data.recipientAddress && data.recipientCity;

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-brand-bg">
      <div className="bg-white w-full max-w-3xl mx-auto rounded-xl border border-brand-border shadow-sm p-10 text-center">
        <div
          aria-hidden="true"
          className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[14px]"
        />
        <div className="relative z-10 w-[800px] px-12">
          <h2 className="font-['Instrument Serif',serif] text-[#27263e] text-[48px] mb-8">
            Recipient Details
          </h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 font-['Chivo',sans-serif] text-[#27263e] text-[18px] mb-2">
                <User className="w-5 h-5 text-[#3ea7c1]" />
                Recipient Name
              </label>
              <input
                type="text"
                value={data.recipientName}
                onChange={e => onUpdate({ recipientName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#9ac7d3] rounded-lg font-['Chivo',sans-serif] text-[18px] focus:outline-none focus:border-[#3ea7c1] transition-colors"
                placeholder="Enter recipient's name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-['Chivo',sans-serif] text-[#27263e] text-[18px] mb-2">
                <MapPin className="w-5 h-5 text-[#3ea7c1]" />
                Street Address
              </label>
              <input
                type="text"
                value={data.recipientAddress}
                onChange={e => onUpdate({ recipientAddress: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#9ac7d3] rounded-lg font-['Chivo',sans-serif] text-[18px] focus:outline-none focus:border-[#3ea7c1] transition-colors"
                placeholder="Enter street address"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-['Chivo',sans-serif] text-[#27263e] text-[18px] mb-2">
                <Mail className="w-5 h-5 text-[#3ea7c1]" />
                City, State, ZIP
              </label>
              <input
                type="text"
                value={data.recipientCity}
                onChange={e => onUpdate({ recipientCity: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#9ac7d3] rounded-lg font-['Chivo',sans-serif] text-[18px] focus:outline-none focus:border-[#3ea7c1] transition-colors"
                placeholder="Enter city, state, and ZIP code"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={onNext}
              disabled={!isValid}
              className="bg-[#3ea7c1] text-white px-8 py-3 rounded-lg font-['Chivo',sans-serif] text-[20px] flex items-center gap-2 hover:bg-[#3598ab] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}