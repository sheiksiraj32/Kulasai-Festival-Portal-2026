import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, AlertCircle, RefreshCw, Upload } from 'lucide-react';

interface MapViewerProps {
  imageUrl: string;
  onBack: () => void;
  onUpdateImageUrl?: (newUrl: string) => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({ imageUrl, onBack, onUpdateImageUrl }) => {
  // Zoom and Pan states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Loading & Error states
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(imageUrl);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchDistanceRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.5;

  useEffect(() => {
    setCurrentSrc(imageUrl);
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  // Reset zoom & pan to fit screen
  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Zoom In
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + ZOOM_STEP, MAX_SCALE));
  };

  // Zoom Out
  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(prev - ZOOM_STEP, MIN_SCALE);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setScale(prev => {
      const next = Math.min(Math.max(prev + delta, MIN_SCALE), MAX_SCALE);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  // Drag and pan handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || scale <= 1) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const maxDeltaX = (clientWidth * (scale - 1)) / 2;
      const maxDeltaY = (clientHeight * (scale - 1)) / 2;

      setPosition({
        x: Math.max(Math.min(newX, maxDeltaX), -maxDeltaX),
        y: Math.max(Math.min(newY, maxDeltaY), -maxDeltaY),
      });
    } else {
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Touch pinch-to-zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        touchDistanceRef.current = dist;
        touchStartScaleRef.current = scale;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDistanceRef.current) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = dist / touchDistanceRef.current;
        const newScale = Math.min(Math.max(touchStartScaleRef.current * factor, MIN_SCALE), MAX_SCALE);
        setScale(newScale);
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      }
    };

    const onTouchEnd = () => {
      touchDistanceRef.current = null;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [scale]);

  // Handle file selection and save to server
  const handleSelectOriginalMap = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          await fetch('/api/upload-asset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: 'Kulasai Festival Single Map.jpeg',
              dataBase64: base64Data,
            }),
          });
        } catch (err) {
          console.warn('Could not save to disk, using data URI:', err);
        }
        setCurrentSrc(base64Data);
        setImageError(false);
        setImageLoaded(false);
        handleResetZoom();
        if (onUpdateImageUrl) onUpdateImageUrl(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 min-h-[calc(100vh-70px)] bg-slate-900 text-white">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 shadow-xs">
        <button
          onClick={onBack}
          type="button"
          aria-label="Back to Homepage"
          className="min-h-[44px] min-w-[44px] px-3 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-900 text-slate-100 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Home</span>
        </button>

        <div className="text-center truncate px-2">
          <h2 className="text-sm sm:text-base font-semibold tracking-normal text-slate-100 truncate">
            Festival Location Map
          </h2>
          <span className="text-[11px] text-slate-400 block truncate font-normal">
            Pinch or use + / − controls to zoom
          </span>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          aria-label="Select original map file"
          title="Select Kulasai Festival Single Map.jpeg"
          className="min-h-[44px] min-w-[44px] px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Upload className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Select Map File</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleSelectOriginalMap}
        />
      </div>

      {/* Main Map Viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-slate-950 select-none cursor-grab active:cursor-grabbing touch-none"
        style={{ minHeight: '70vh' }}
      >
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-slate-950 z-10 text-slate-300">
            <RefreshCw className="w-7 h-7 animate-spin text-emerald-500" />
            <p className="text-xs sm:text-sm font-medium">Loading original festival map...</p>
          </div>
        )}

        {/* Required Placeholder if Original Asset Needs to be Added */}
        {imageError && (
          <div className="max-w-md mx-4 p-6 bg-slate-900 border border-slate-700 rounded-xl text-center shadow-lg">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2.5" />
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5">
              Original Map Asset Needed
            </h3>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              Please provide the original <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">Kulasai Festival Single Map.jpeg</code> image uploaded for the Kulasai Dasara Festival.
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              Click below to select your original map file to display the official consolidated map directly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[44px] px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Select &quot;Kulasai Festival Single Map.jpeg&quot;</span>
              </button>
              <button
                onClick={() => {
                  setImageError(false);
                  setImageLoaded(false);
                }}
                className="min-h-[44px] px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* The Exact Original Map Image */}
        {!imageError && (
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <img
              ref={imageRef}
              src={currentSrc}
              alt="Arulmigu Mutharamman Thirukovil, Kulasekarapattinam Panchayat - Special Route map for Dasara"
              referrerPolicy="no-referrer"
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
              className="pointer-events-auto will-change-transform"
              draggable={false}
            />
          </div>
        )}

        {/* Zoom Controls */}
        {!imageError && (
          <div className="absolute bottom-5 right-4 z-20 flex flex-col gap-1.5 items-center bg-slate-800/90 backdrop-blur-sm p-1.5 rounded-xl border border-slate-700 shadow-xl">
            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              type="button"
              aria-label="Zoom In"
              title="Zoom In (+)"
              className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-emerald-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5 text-emerald-400" />
            </button>

            {/* Current Zoom Level */}
            <span className="text-[11px] font-mono font-medium text-slate-300 px-1 py-0.5 tabular-nums select-none">
              {Math.round(scale * 100)}%
            </span>

            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
              type="button"
              aria-label="Zoom Out"
              title="Zoom Out (−)"
              className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-emerald-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5 text-emerald-400" />
            </button>

            {/* Reset / Fit to Screen */}
            <button
              onClick={handleResetZoom}
              type="button"
              aria-label="Reset zoom to 100%"
              title="Fit to screen / Reset"
              className={`min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center transition-colors ${
                scale > 1
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
