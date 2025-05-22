"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef, useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const WalkingManScene = dynamic(() => import("@/components/walking-man-scene"), {
  ssr: false,
});

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeKeys, setActiveKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const simulateKeyDown = (key: string) => {
    setActiveKeys((prev) => ({ ...prev, [key]: true }));
    const event = new KeyboardEvent("keydown", { key });
    window.dispatchEvent(event);
  };

  const simulateKeyUp = (key: string) => {
    setActiveKeys((prev) => ({ ...prev, [key]: false }));
    const event = new KeyboardEvent("keyup", { key });
    window.dispatchEvent(event);
  };

  const handleTouchStart = (key: string) => simulateKeyDown(key);
  const handleTouchEnd = (key: string) => simulateKeyUp(key);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">3D Walking Man</h1>

      <div ref={containerRef} className="w-full h-[600px] relative">
        <button
          onClick={toggleFullScreen}
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded"
        >
          Fullscreen
        </button>

        <Suspense fallback={<div className="text-white text-center">Loading 3D scene...</div>}>
          <WalkingManScene />
        </Suspense>
      </div>

      <div className="mt-4 relative w-[180px] h-[180px]">
        <button
          className={`absolute top-0 left-[60px] w-[60px] h-[60px] rounded-full flex items-center justify-center ${
            activeKeys.ArrowUp ? "bg-blue-600" : "bg-blue-500"
          } hover:bg-blue-600 active:bg-blue-700 text-white`}
          onMouseDown={() => simulateKeyDown("ArrowUp")}
          onMouseUp={() => simulateKeyUp("ArrowUp")}
          onMouseLeave={() => activeKeys.ArrowUp && simulateKeyUp("ArrowUp")}
          onTouchStart={() => handleTouchStart("ArrowUp")}
          onTouchEnd={() => handleTouchEnd("ArrowUp")}
        >
          <ArrowUp size={30} />
        </button>

        <button
          className={`absolute top-[60px] left-0 w-[60px] h-[60px] rounded-full flex items-center justify-center ${
            activeKeys.ArrowLeft ? "bg-blue-600" : "bg-blue-500"
          } hover:bg-blue-600 active:bg-blue-700 text-white`}
          onMouseDown={() => simulateKeyDown("ArrowLeft")}
          onMouseUp={() => simulateKeyUp("ArrowLeft")}
          onMouseLeave={() => activeKeys.ArrowLeft && simulateKeyUp("ArrowLeft")}
          onTouchStart={() => handleTouchStart("ArrowLeft")}
          onTouchEnd={() => handleTouchEnd("ArrowLeft")}
        >
          <ArrowLeft size={30} />
        </button>

        <button
          className={`absolute top-[60px] right-0 w-[60px] h-[60px] rounded-full flex items-center justify-center ${
            activeKeys.ArrowRight ? "bg-blue-600" : "bg-blue-500"
          } hover:bg-blue-600 active:bg-blue-700 text-white`}
          onMouseDown={() => simulateKeyDown("ArrowRight")}
          onMouseUp={() => simulateKeyUp("ArrowRight")}
          onMouseLeave={() => activeKeys.ArrowRight && simulateKeyUp("ArrowRight")}
          onTouchStart={() => handleTouchStart("ArrowRight")}
          onTouchEnd={() => handleTouchEnd("ArrowRight")}
        >
          <ArrowRight size={30} />
        </button>

        <button
          className={`absolute bottom-0 left-[60px] w-[60px] h-[60px] rounded-full flex items-center justify-center ${
            activeKeys.ArrowDown ? "bg-blue-600" : "bg-blue-500"
          } hover:bg-blue-600 active:bg-blue-700 text-white`}
          onMouseDown={() => simulateKeyDown("ArrowDown")}
          onMouseUp={() => simulateKeyUp("ArrowDown")}
          onMouseLeave={() => activeKeys.ArrowDown && simulateKeyUp("ArrowDown")}
          onTouchStart={() => handleTouchStart("ArrowDown")}
          onTouchEnd={() => handleTouchEnd("ArrowDown")}
        >
          <ArrowDown size={30} />
        </button>
      </div>
    </main>
  );
}
