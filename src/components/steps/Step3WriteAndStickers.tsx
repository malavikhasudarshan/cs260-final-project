import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { LetterData } from '../../types/letter';

// You can swap this for an env var / backend in your real app
const OPENAI_API_KEY =
  '';

type CombinedStepProps = {
  data: LetterData;
  onUpdate: (data: Partial<LetterData>) => void;
  onNext: () => void;
  onBack: () => void;
};

type LocalSticker = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  source: 'preset' | 'ai';
};

// Fixed size letter box
const LETTER_BOX_WIDTH = 1500;
const LETTER_BOX_HEIGHT = 415;

// Text zone padding (must match textarea padding)
const TEXT_PADDING_LEFT = 72;   // keep text out of margin (margin line at ~50px)
const TEXT_PADDING_RIGHT = 24;
const TEXT_PADDING_TOP = 24;
const TEXT_PADDING_BOTTOM = 24;

// Font family options
const FONT_OPTIONS = [
  { id: 'chivo', label: 'Simple (Chivo)', family: '"Chivo", sans-serif' },
  { id: 'serif', label: 'Fancy (Instrument Serif)', family: '"Instrument Serif", serif' },
  { id: 'handwriting', label: 'Handwriting (Comic)', family: '"Comic Sans MS","Comic Neue",cursive' },
  { id: 'marker', label: 'Marker', family: '"Permanent Marker","Comic Neue",cursive' },
  { id: 'typewriter', label: 'Typewriter', family: '"Courier New",monospace' },
  { id: 'rounded', label: 'Rounded', family: '"Baloo 2","Comic Neue",cursive' },
];

// 🔤 Font size options
const FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', px: 14 },
  { id: 'normal', label: 'Normal', px: 18 },
  { id: 'large', label: 'Large', px: 22 },
  { id: 'xlarge', label: 'Extra Large', px: 26 },
];

// 🎨 Font color options (you can tweak these)
const FONT_COLOR_OPTIONS = [
  { id: 'ink', label: 'Ink', value: '#27263e' },
  { id: 'sea', label: 'Sea', value: '#3ea7c1' },
  { id: 'berry', label: 'Berry', value: '#d4183d' },
  { id: 'sun', label: 'Sun', value: '#f4a623' },
];

async function getAISuggestedStickers(message: string): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    console.warn('Missing OpenAI API key – returning fallback stickers');
    return ['💌', '💕', '🌈'];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            "You are an emoji sticker picker for a kids' letter-writing app. " +
            'Given the letter text, respond ONLY with 3–8 emoji that match the tone and content, ' +
            'separated by spaces. No words, no explanations.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 32,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI error status:', response.status, errorText);
    throw new Error('OpenAI request failed');
  }

  const data = await response.json();
  const rawText: string = data.choices?.[0]?.message?.content ?? '';

  const stickers = rawText
    .split(/[\s,]+/)
    .map((s: string) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(stickers));
}

// Allow stickers anywhere inside the box, just clamp to bounds
function constrainStickerPosition(
  x: number,
  y: number,
  size: number,
  boxWidth: number,
  boxHeight: number,
) {
  let newX = x;
  let newY = y;

  newX = Math.max(0, Math.min(boxWidth - size, newX));
  newY = Math.max(0, Math.min(boxHeight - size, newY));

  return { x: newX, y: newY };
}

export function Step2WriteAndStickers({
  data,
  onUpdate,
  onNext,
  onBack,
}: CombinedStepProps) {
  // Initialize stickers from data if they exist (when user goes back)
  const initializeStickers = (): LocalSticker[] => {
    if (data.stickers && data.stickers.length > 0) {
      return data.stickers.map(sticker => ({
        id: sticker.id,
        emoji: sticker.emoji,
        x: sticker.x,
        y: sticker.y,
        size: sticker.size,
        source: sticker.source,
      }));
    }
    return [];
  };

  const [stickers, setStickers] = useState<LocalSticker[]>(initializeStickers);
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
  const [aiStickers, setAiStickers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontId, setFontId] = useState<string>('chivo');
  const [fontSizeId, setFontSizeId] = useState<string>('normal');
  const [fontColor, setFontColor] = useState<string>('#27263e'); // 🎨 NEW

  // Save stickers when moving to next step
  const handleNext = () => {
    // Convert LocalSticker[] to Sticker[] format and save to data
    const stickersToSave = stickers.map(sticker => ({
      id: sticker.id,
      emoji: sticker.emoji,
      source: sticker.source,
      x: sticker.x,
      y: sticker.y,
      size: sticker.size,
    }));
    
    onUpdate({ stickers: stickersToSave });
    onNext();
  };

  const letterRef = useRef<HTMLDivElement | null>(null);
  const resizeHandleRef = useRef<boolean | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const stickerOptions = ['💌', '🌈', '⭐', '🎂', '🎉', '🐻'];
  const isValid = data.message.trim().length > 0;

  const currentFontFamily =
    FONT_OPTIONS.find(f => f.id === fontId)?.family ?? FONT_OPTIONS[0].family;

  const currentFontSize =
    FONT_SIZE_OPTIONS.find(s => s.id === fontSizeId)?.px ?? 18;

  const handleGenerateAI = async () => {
    try {
      setIsGenerating(true);
      const suggestions = await getAISuggestedStickers(data.message);
      setAiStickers(suggestions);
    } catch (err) {
      console.error(err);
      setAiStickers(['💌', '💕', '🌈']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStickerDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    emoji: string,
    source: 'preset' | 'ai' = 'preset',
  ) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('emoji', emoji);
    e.dataTransfer.setData('source', source);
  };

  const handleLetterDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleLetterDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData('emoji');
    const source = (e.dataTransfer.getData('source') || 'preset') as 'preset' | 'ai';
    if (!emoji || !letterRef.current) return;

    const rect = letterRef.current.getBoundingClientRect();
    const boxWidth = rect.width;
    const boxHeight = rect.height;
    const size = 48;

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const adjusted = constrainStickerPosition(x, y, size, boxWidth, boxHeight);

    const newSticker: LocalSticker = {
      id: Date.now() + Math.random(),
      emoji,
      x: adjusted.x,
      y: adjusted.y,
      size,
      source,
    };

    setStickers(prev => [...prev, newSticker]);
  };

  const handleStickerMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    stickerId: number,
  ) => {
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

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!letterRef.current) return;
      const letterRect = letterRef.current.getBoundingClientRect();

      const boxWidth = letterRect.width;
      const boxHeight = letterRect.height;

      let newX =
        moveEvent.clientX - letterRect.left - dragOffsetRef.current.x;
      let newY =
        moveEvent.clientY - letterRect.top - dragOffsetRef.current.y;

      const adjusted = constrainStickerPosition(
        newX,
        newY,
        sticker.size,
        boxWidth,
        boxHeight,
      );

      setStickers(prev =>
        prev.map(s =>
          s.id === stickerId ? { ...s, x: adjusted.x, y: adjusted.y } : s,
        ),
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    stickerId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    resizeHandleRef.current = true;
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;

    const startX = e.clientX;
    const startSize = sticker.size;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!letterRef.current) return;
      const letterRect = letterRef.current.getBoundingClientRect();
      const boxWidth = letterRect.width;
      const boxHeight = letterRect.height;

      const deltaX = moveEvent.clientX - startX;
      const newSize = Math.max(24, Math.min(120, startSize + deltaX));

      setStickers(prev =>
        prev.map(s => {
          if (s.id !== stickerId) return s;
          const adjusted = constrainStickerPosition(
            s.x,
            s.y,
            newSize,
            boxWidth,
            boxHeight,
          );
          return { ...s, size: newSize, x: adjusted.x, y: adjusted.y };
        }),
      );
    };

    const handleMouseUp = () => {
      resizeHandleRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const removeSticker = (stickerId: number) => {
    setStickers(prev => prev.filter(s => s.id !== stickerId));
    setSelectedStickerId(null);
  };

  return (
    <div className="absolute inset-0 top-[83px] bg-[#f8fcfd] overflow-x-hidden overflow-y-auto">
      {/* Centered main content to avoid horizontal scroll */}
      <div className="flex w-full max-w-6xl mx-auto h-full pb-24">
        {/* Left side – single letter box (typing + stickers) */}
        <div className="w-2/3 flex flex-col items-stretch justify-start p-8">
          <div className="w-full">
            <div className="mb-4">
              <h2 className="font-['Instrument Serif',serif] text-[48px] text-[#27263e] mb-2">
                Write & decorate your letter
              </h2>
              <p className="font-['Chivo',sans-serif] text-[16px] text-[#787878]">
                Type your message and drag stickers directly into this box.
              </p>
            </div>

            {/* Font + size + color selector */}
            <div className="mb-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="font-['Chivo',sans-serif] text-[14px] text-[#27263e]">
                  Font:
                </label>
                <select
                  value={fontId}
                  onChange={e => setFontId(e.target.value)}
                  className="font-['Chivo',sans-serif] text-[14px] border border-[#9ac7d3] rounded-[999px] px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#3ea7c1]"
                >
                  {FONT_OPTIONS.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      style={{ fontFamily: option.family }}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-['Chivo',sans-serif] text-[14px] text-[#27263e]">
                  Size:
                </label>
                <select
                  value={fontSizeId}
                  onChange={e => setFontSizeId(e.target.value)}
                  className="font-['Chivo',sans-serif] text-[14px] border border-[#9ac7d3] rounded-[999px] px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#3ea7c1]"
                >
                  {FONT_SIZE_OPTIONS.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🎨 Color selector */}
              <div className="flex items-center gap-2">
                <label className="font-['Chivo',sans-serif] text-[14px] text-[#27263e]">
                  Color:
                </label>
                <div className="flex items-center gap-2">
                  {FONT_COLOR_OPTIONS.map(color => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFontColor(color.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        fontColor === color.value
                          ? 'border-[#27263e] scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                  {/* Custom color input */}
                  <input
                    type="color"
                    value={fontColor}
                    onChange={e => setFontColor(e.target.value)}
                    className="w-8 h-8 border border-[#9ac7d3] rounded-full p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Single fixed-size letter box */}
            <div className="flex flex-col items-stretch">
              <div
                ref={letterRef}
                onDragOver={handleLetterDragOver}
                onDrop={handleLetterDrop}
                className="relative bg-white rounded-[14px] border-2 border-[#9ac7d3] shadow-lg w-full"
                style={{
                  width: `${LETTER_BOX_WIDTH}px`,
                  height: `${LETTER_BOX_HEIGHT}px`,
                  backgroundImage: `
                    repeating-linear-gradient(to bottom, #e3e7ee 0px, #e3e7ee 1px, transparent 1px, transparent 28px),
                    linear-gradient(to right, #9ac7d3 50px, transparent 50px)
                  `,
                  backgroundColor: 'white',
                  backgroundRepeat: 'no-repeat, no-repeat',
                  backgroundSize: '100% 100%, 100% 100%',
                }}
              >
                {/* Text area inside box */}
                <textarea
                  value={data.message}
                  onChange={e => onUpdate({ message: e.target.value })}
                  className="absolute inset-0 w-full h-full border-none outline-none bg-transparent leading-[1.75] resize-none z-[5]"
                  style={{
                    fontFamily: currentFontFamily,
                    fontSize: `${currentFontSize}px`,
                    paddingLeft: `${TEXT_PADDING_LEFT}px`,
                    paddingRight: `${TEXT_PADDING_RIGHT}px`,
                    paddingTop: `${TEXT_PADDING_TOP}px`,
                    paddingBottom: `${TEXT_PADDING_BOTTOM}px`,
                    color: fontColor, // 🎨 apply chosen color
                  }}
                  placeholder="Write your heartfelt message here..."
                />

                {/* Stickers */}
                {stickers.map(sticker => (
                  <div
                    key={sticker.id}
                    onMouseDown={e => handleStickerMouseDown(e, sticker.id)}
                    className={`absolute select-none ${
                      selectedStickerId === sticker.id ? 'z-10' : 'z-[6]'
                    }`}
                    style={{
                      left: `${sticker.x}px`,
                      top: `${sticker.y}px`,
                      fontSize: `${sticker.size}px`,
                      cursor: 'move',
                    }}
                  >
                    {sticker.emoji}

                    {selectedStickerId === sticker.id && (
                      <>
                        <div
                          className="absolute inset-0 border-2 border-[#3ea7c1] rounded-[8px] pointer-events-none"
                          style={{ margin: '-4px' }}
                        />

                        {/* Delete button */}
                        <button
                          onMouseDown={e => {
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
                          onMouseDown={e => handleResizeMouseDown(e, sticker.id)}
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
                {stickers.length === 0 && !data.message.trim() && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="font-['Chivo',sans-serif] text-[#9acs7d3] text-center px-12 text-[18px]">
                      Start typing your letter, then drag stickers from the right panel into this box
                    </p>
                  </div>
                )}
              </div>

              {/* character count */}
              <p className="mt-3 w-full text-right font-['Chivo',sans-serif] text-[#787878] text-[14px]">
                {data.message.length} characters
              </p>
            </div>
          </div>
        </div>

        {/* Right side – sticker panel */}
        <div className="w-1/3 shrink-0 border-l-2 border-[#e9e9e9] bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-8">
            <div className="space-y-8">
              {/* Preset Stickers */}
              <div>
                <p className="font-['Chivo',sans-serif] text-[#27263e] text-[22px] font-normal mb-4">
                  Choose stickers
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {stickerOptions.map(emoji => (
                    <div
                      key={emoji}
                      draggable
                      onDragStart={e => handleStickerDragStart(e, emoji, 'preset')}
                      className="w-full aspect-square flex items-center justify-center text-[48px] rounded-[14px] border-2 border-[#9ac7d3] bg-[#f5fdff] cursor-pointer transition-all duration-300 hover:bg-[#ddf7fe] hover:scale-105"
                      style={{ userSelect: 'none' }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI sticker suggestions */}
              <div className="border-t-2 border-[#9ac7d3] pt-6">
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
                    Click &quot;Generate&quot; to get AI-picked stickers that match your
                    message.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {aiStickers.map((emoji, idx) => (
                      <div
                        key={`${emoji}-${idx}`}
                        draggable
                        onDragStart={e => handleStickerDragStart(e, emoji, 'ai')}
                        className="w-full aspect-square flex items-center justify-center text-[48px] rounded-[14px] border-2 border-[#3ea7c3] bg-[#f5fdff] cursor-pointer transition-all duration-300 hover:bg-[#ddf7fe] hover:scale-105"
                        style={{ userSelect: 'none', borderStyle: 'dashed' }}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stickers count */}
              <div className="border-t-2 border-[#e9e9e9] pt-6">
                <p className="font-['Chivo',sans-serif] text-[#787878] text-[14px]">
                  {stickers.length === 0
                    ? 'No stickers added yet'
                    : `${stickers.length} sticker${
                        stickers.length === 1 ? '' : 's'
                      } on your letter`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed navigation buttons bar – Back bottom-left, Next bottom-right */}
      <div className="fixed bottom-6 inset-x-0 z-50 px-6 flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-200 text-[#27263e] px-8 py-3 rounded-[8px] font-['Chivo',sans-serif] text-[18px] flex items-center gap-2 transition-colors hover:bg-gray-300 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-[#3ea7c1] text-white px-8 py-3 rounded-[8px] font-['Chivo',sans-serif] text-[18px] flex items-center gap-2 transition-colors hover:bg-[#3598ab] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
        >
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
