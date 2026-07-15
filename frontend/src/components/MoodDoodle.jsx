import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, Brush, Trash2, Download, Undo } from 'lucide-react';

const PRESET_COLORS = [
  '#000000', // Black
  '#FFD966', // Yellow
  '#6C9BCF', // Blue
  '#A78BFA', // Purple
  '#81C784', // Green
  '#F48FB1', // Pink
  '#FFB74D', // Orange
  '#E57373', // Red
];

export default function MoodDoodle() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6C9BCF');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush'); // brush or eraser
  const [history, setHistory] = useState([]); // Undo history

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Support high DPI displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Fill background with solid white so download doesn't have transparent gaps
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, rect.width, rect.height);

    // Save initial history state
    setHistory([canvas.toDataURL()]);

    // Handle resizing dynamically
    const handleResize = () => {
      const tempImage = canvas.toDataURL();
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * 2;
      canvas.height = newRect.height * 2;
      canvas.style.width = `${newRect.width}px`;
      canvas.style.height = `${newRect.height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      contextRef.current = ctx;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, newRect.width, newRect.height);
      };
      img.src = tempImage;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update stroke values when settings change
  useEffect(() => {
    if (!contextRef.current) return;
    if (tool === 'eraser') {
      contextRef.current.strokeStyle = '#ffffff'; // Match white background
      contextRef.current.lineWidth = brushSize * 3; // Bigger size for eraser
    } else {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize, tool]);

  // Drawing event handlers
  const startDrawing = ({ nativeEvent }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let clientX, clientY;
    if (nativeEvent.touches) {
      // Touch support
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else {
      // Mouse support
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    nativeEvent.preventDefault(); // Stop mobile scrolling while drawing

    const canvas = canvasRef.current;
    if (!canvas) return;

    let clientX, clientY;
    if (nativeEvent.touches) {
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    
    // Save history state
    const canvas = canvasRef.current;
    if (canvas) {
      setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]); // Keep max 20 states
    }
  };

  // Canvas operations
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    
    const previousState = newHistory[newHistory.length - 1];
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = previousState;
  };

  const downloadDoodle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `moodbuddy-doodle-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div class="clay-card p-6 bg-white/70 max-w-2xl mx-auto border-white/60">
      <div class="flex items-center gap-2 mb-4">
        <Palette class="w-6 h-6 text-violet-500" />
        <h2 class="text-2xl font-bold text-slate-800 font-display">Mood Doodle</h2>
      </div>
      <p class="text-sm text-slate-500 mb-6">
        “Draw your feelings using colors and shapes.” Let your mind wander freely across the canvas.
      </p>

      {/* Toolbar */}
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
        {/* Brush vs Eraser toggle */}
        <div class="flex items-center gap-2">
          <button
            onClick={() => setTool('brush')}
            class={`p-2.5 rounded-xl transition-all ${
              tool === 'brush'
                ? 'bg-violet-500 text-white shadow-clay-sm scale-105'
                : 'text-slate-500 hover:bg-slate-200'
            }`}
            title="Brush"
          >
            <Brush class="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setTool('eraser')}
            class={`p-2.5 rounded-xl transition-all ${
              tool === 'eraser'
                ? 'bg-violet-500 text-white shadow-clay-sm scale-105'
                : 'text-slate-500 hover:bg-slate-200'
            }`}
            title="Eraser"
          >
            <Eraser class="w-5 h-5" />
          </button>
        </div>

        {/* Brush Size Slider */}
        <div class="flex items-center gap-2 flex-1 min-w-[120px]">
          <span class="text-xs font-bold text-slate-500">Size:</span>
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
            class="accent-violet-500 w-full h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span class="text-xs font-bold text-slate-600 w-6 text-right">{brushSize}px</span>
        </div>

        {/* Action Controls */}
        <div class="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={history.length <= 1}
            class="p-2.5 rounded-xl text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Undo"
          >
            <Undo class="w-5 h-5" />
          </button>
          
          <button
            onClick={clearCanvas}
            class="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all"
            title="Clear Canvas"
          >
            <Trash2 class="w-5 h-5" />
          </button>

          <button
            onClick={downloadDoodle}
            class="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-violet-100"
            title="Download Doodle to Device"
          >
            <Download class="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Preset Colors Row */}
      {tool === 'brush' && (
        <div class="flex flex-wrap items-center gap-2.5 mb-4 animate-fade-in">
          <span class="text-xs font-bold text-slate-500 mr-1">Vibes Color:</span>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              class={`w-7 h-7 rounded-full transition-transform hover:scale-110 shadow-clay-sm ${
                color === c ? 'ring-2 ring-violet-500 ring-offset-2 scale-105' : 'border border-slate-200'
              }`}
            ></button>
          ))}
          {/* Custom color input */}
          <div class="relative w-7 h-7 rounded-full border border-slate-200 overflow-hidden shadow-clay-sm hover:scale-110 transition-transform">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              class="absolute inset-0 w-[200%] h-[200%] -translate-x-[25%] -translate-y-[25%] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Drawing Canvas */}
      <div class="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-inner select-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          class="block w-full h-[400px]"
        />
      </div>
    </div>
  );
}
