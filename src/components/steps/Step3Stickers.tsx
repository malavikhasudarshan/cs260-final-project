import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { LetterData, StickerSource } from '../../types/letter';

const OPENAI_API_KEY = ""; // your key here 

async function getAISuggestedStickers(message: string): Promise<string[]> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an emoji sticker picker for a kids' letter-writing app. " +
            "Given the letter text, respond ONLY with 3–8 emoji that match the tone and content, " +
            "separated by spaces. No words, no explanations.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 32,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI error status:", response.status, errorText);
    throw new Error("OpenAI request failed");
  }

  const data = await response.json();
  const rawText: string = data.choices?.[0]?.message?.content ?? "";

  console.log("OpenAI rawText:", rawText);

  const stickers = rawText
    .split(/[\s,]+/)
    .map((s: string) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(stickers));
}

interface Step3StickersProps {
  data: LetterData;
  onAddSticker: (emoji: string, source: StickerSource) => void;
  onRemoveSticker: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Stickers({
  data,
  onAddSticker,
  onRemoveSticker,
  onNext,
  onBack,
}: Step3StickersProps) {
  const [stickers, setStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [aiStickers, setAiStickers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const stickerOptions = ['💌', '🌈', '⭐', '🎂', '🎉', '🐻'];

  const letterRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleGenerateAI = async () => {
    try {
      setIsGenerating(true);
      const suggestions = await getAISuggestedStickers(data.message);
      setAiStickers(suggestions);
    } catch (err) {
      console.error(err);
      setAiStickers(["💌", "💕", "🌈"]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStickerDragStart = (e, emoji) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('emoji', emoji);
  };

  const handleLetterDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleLetterDrop = (e) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData('emoji');
    if (!emoji || !letterRef.current) return;

    const rect = letterRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSticker = {
      id: Date.now() + Math.random(),
      emoji,
      x,
      y,
      size: 48,
    };

    setStickers([...stickers, newSticker]);
  };

  const handleStickerMouseDown = (e, stickerId) => {
    e.preventDefault();
    e.stopPropagation();

    if (resizeHandleRef.current) return;

    setSelectedStickerId(stickerId);
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;

    const rect = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const handleMouseMove = (moveEvent) => {
      if (!letterRef.current) return;
      const letterRect = letterRef.current.getBoundingClientRect();

      const newX = moveEvent.clientX - letterRect.left - dragOffsetRef.current.x;
      const newY = moveEvent.clientY - letterRect.top - dragOffsetRef.current.y;

      setStickers(prev => prev.map(s =>
        s.id === stickerId ? { ...s, x: newX, y: newY } : s
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e, stickerId) => {
    e.preventDefault();
    e.stopPropagation();

    resizeHandleRef.current = true;
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;

    const startX = e.clientX;
    const startSize = sticker.size;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newSize = Math.max(24, Math.min(120, startSize + deltaX));

      setStickers(prev => prev.map(s =>
        s.id === stickerId ? { ...s, size: newSize } : s
      ));
    };

    const handleMouseUp = () => {
      resizeHandleRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const removeSticker = (stickerId) => {
    setStickers(stickers.filter(s => s.id !== stickerId));
    setSelectedStickerId(null);
  };

  return (
    <div className="absolute inset-0 top-[83px] flex overflow-hidden bg-[#f8fcfd]">
      {/* Left side - Letter Canvas */}
      <div className="w-2/3 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-3xl">
          <div className="mb-4">
            <h2 className="font-['Instrument_Serif',serif] text-[48px] text-[#27263e] mb-2">
              Your Letter
            </h2>
            <p className="font-['Chivo',sans-serif] text-[16px] text-[#787878]">
              Drag stickers from the panel and place them on your letter
            </p>
          </div>

          <div
            ref={letterRef}
            onDragOver={handleLetterDragOver}
            onDrop={handleLetterDrop}
            className="relative bg-white rounded-[14px] border-2 border-[#9ac7d3] shadow-lg p-12 min-h-[600px]"
            style={{ backgroundImage: 'radial-gradient(circle, #e9e9e9 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {/* Letter Content */}
            <div className="relative z-0 pointer-events-none">
              <p className="font-['Chivo',sans-serif] text-[18px] text-[#27263e] leading-[1.75] whitespace-pre-wrap">
                {data.message}
              </p>
            </div>

            {/* Stickers */}
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
                className={`absolute cursor-pointer select-none ${
                  selectedStickerId === sticker.id ? 'z-10' : 'z-[5]'
                }`}
                style={{
                  left: `${sticker.x}px`,
                  top: `${sticker.y}px`,
                  fontSize: `${sticker.size}px`,
                  cursor: 'move',
                }}
              >
                {sticker.emoji}

                {/* Selection indicators */}
                {selectedStickerId === sticker.id && (
                  <>
                    <div className="absolute inset-0 border-2 border-[#3ea7c1] rounded-[8px] pointer-events-none" style={{ margin: '-4px' }}></div>

                    {/* Delete button */}
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        removeSticker(sticker.id);
                      }}
                      className="absolute bg-[#d4183d] text-white rounded-full flex items-center justify-center cursor-pointer border-2 border-white transition-colors hover:bg-[#a01230]"
                      style={{
                        top: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                      }}
                    >
                      <X style={{ width: '12px', height: '12px' }} />
                    </button>

                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, sticker.id)}
                      className="absolute bg-[#3ea7c1] rounded-full border-2 border-white transition-colors hover:bg-[#3598ab]"
                      style={{
                        bottom: '-8px',
                        right: '-8px',
                        width: '16px',
                        height: '16px',
                        cursor: 'nwse-resize',
                      }}
                    />
                  </>
                )}
              </div>
            ))}

            {/* Drop zone hint */}
            {stickers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="font-['Chivo',sans-serif] text-[#9ac7d3] text-center px-4 text-[18px]">
                  Drag stickers from the right panel here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Sticker Panel */}
      <div className="w-1/3 shrink-0 border-solid border-2 border-t-2 border-[#e9e9e9] bg-white overflow-y-auto flex flex-col">
        <div className="p-8 flex-1">
          <div className="space-y-6">
            {/* Preset Stickers */}
            <div>
              <p className="font-['Chivo',sans-serif] text-[#27263e] text-[22px] font-normal mb-4">
                Choose stickers
              </p>
              <div className="flex flex-wrap gap-4">
                {stickerOptions.map((emoji) => (
                  <div
                    key={emoji}
                    draggable
                    onDragStart={(e) => handleStickerDragStart(e, emoji)}
                    className="w-24 h-24 flex items-center justify-center text-[48px] rounded-[14px] border-2 border-[#9ac7d3] bg-[#f5fdff] cursor-pointer transition-all duration-300 hover:bg-[#ddf7fe] hover:scale-110"
                    style={{ userSelect: 'none' }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* AI sticker suggestions */}
            <div className="border-solid border-t-2 border-[#9ac7d3] pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-['Chivo',sans-serif] text-[#27263e] text-[22px] font-normal">
                  AI Suggestions
                </p>
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="text-[14px] font-['Chivo',sans-serif] px-4 py-[10px] rounded-[50px] border border-[#3ea7c1] text-[#3ea7c1] bg-white transition-colors hover:bg-[#ddf7fe] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Thinking…' : 'Generate'}
                </button>
              </div>

              {aiStickers.length === 0 ? (
                <p className="font-['Chivo',sans-serif] text-[#787878] text-[14px]">
                  Click "Generate" to get AI-picked stickers that match your message
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {aiStickers.map((emoji, idx) => (
                    <div
                      key={`${emoji}-${idx}`}
                      draggable
                      onDragStart={(e) => handleStickerDragStart(e, emoji)}
                      className="w-24 h-24 flex items-center justify-center text-[48px] rounded-[14px] border-2 border-[#3ea7c1] bg-[#f5fdff] cursor-pointer transition-all duration-300 hover:bg-[#ddf7fe] hover:scale-110"
                      style={{ userSelect: 'none', borderStyle: 'dashed' }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stickers count */}
            <div className="border-solid border-t-2 border-[#e9e9e9] pt-6">
              <p className="font-['Chivo',sans-serif] text-[#787878] text-[14px]">
                {stickers.length === 0
                  ? 'No stickers added yet'
                  : `${stickers.length} sticker${stickers.length === 1 ? '' : 's'} on your letter`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="shrink-0 border-solid border-t-2 border-[#e9e9e9] p-8">
          <div className="flex justify-between gap-4">
            <button
              onClick={onBack}
              className="bg-gray-200 text-[#27263e] px-8 py-3 rounded-[8px] font-['Chivo',sans-serif] text-[20px] flex items-center gap-2 transition-colors hover:bg-gray-300"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={onNext}
              className="bg-[#3ea7c1] text-white px-8 py-3 rounded-[8px] font-['Chivo',sans-serif] text-[20px] flex items-center gap-2 transition-colors hover:bg-[#3598ab]"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}