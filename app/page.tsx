"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SecurityCheck() {
  const [clickCount, setClickCount] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const moveButton = () => {
    const x = Math.random() * (window.innerWidth - 200);
    const y = Math.random() * (window.innerHeight - 200);
    setButtonPosition({ x: x, y: y });
  };

  const handleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setIsVerified(true);
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      }
      return newCount;
    });
    moveButton();
  };

  useEffect(() => {
    const interval = setInterval(moveButton, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" text-white relative overflow-hidden min-h-screen bg-background grid-background">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <ShieldCheck className="w-16 h-16 mb-8 text-white" />
        <h1 className="text-4xl font-bold mb-4 text-center">Security Verification</h1>
        <p className="text-lg mb-8 text-center text-slate-300 max-w-md">
          Click the moving button 3 times to verify you're human
        </p>
        
        <div className="relative w-full h-[60vh]">
          <button
            onClick={handleClick}
            style={{
              position: 'absolute',
              left: `${buttonPosition.x}px`,
              top: `${buttonPosition.y}px`,
              transition: 'all 0.3s ease-out',
            }}
            className="bg-white hover:bg-[#c4c4c4] text-black font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
          >
            Click Me! ({3 - clickCount} remaining)
          </button>
        </div>

        {isVerified && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-green-500 text-white p-8 rounded-lg shadow-2xl animate-bounce">
              <h2 className="text-2xl font-bold">Verification Successful!</h2>
              <p>Redirecting to main page...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}