
import React from 'react';
import { Download, Terminal } from 'lucide-react';
import { GenerationStatus } from '../types';

interface CanvasProps {
  imageUrl: string | null;
  status: GenerationStatus;
  error: string | null;
}

const Canvas: React.FC<CanvasProps> = ({ imageUrl, status, error }) => {
  const isLoading = status === GenerationStatus.GENERATING;

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `character_sheet_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Background Grid Elements */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none"></div>
      
      {/* Decorative HUD Elements - Watermark Style */}
      <div className="absolute top-8 left-8 text-slate-200 font-mono text-6xl font-extrabold select-none pointer-events-none">
        01
      </div>
      <div className="absolute bottom-8 right-8 text-slate-200 font-mono text-6xl font-extrabold select-none pointer-events-none">
        CAM_A
      </div>
      
      {/* Top Border Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"></div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full h-full flex flex-col">
        
        {/* Header Actions */}
        <div className="flex justify-end mb-4 gap-2">
           {imageUrl && !isLoading && (
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-cyan-700 hover:text-cyan-800 hover:border-cyan-300 hover:bg-slate-50 rounded-md text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export_Schematic
            </button>
           )}
        </div>

        {/* Viewport */}
        <div className="flex-1 border border-slate-200 bg-white/60 backdrop-blur-sm relative rounded-lg shadow-xl overflow-hidden group">
          
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-200"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-200"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-200"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-200"></div>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20">
               <div className="w-16 h-16 border-4 border-slate-100 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
               <div className="font-mono text-cyan-700 font-bold animate-pulse text-sm">
                 DECONSTRUCTING_ASSETS...
               </div>
               <div className="font-mono text-slate-400 text-xs mt-2 uppercase tracking-widest">
                 Rending Textures // Generating Layers
               </div>
            </div>
          )}

          {/* Empty State */}
          {!imageUrl && !isLoading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
               <Terminal className="w-16 h-16 mb-4 opacity-30" />
               <p className="font-mono text-sm tracking-widest font-bold">AWAITING INPUT DATA</p>
               <p className="text-xs mt-2 opacity-50 uppercase">Configure parameters in left panel</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-white/95 z-20 p-8 text-center">
               <div className="border border-red-200 p-6 rounded-lg bg-red-50 max-w-md shadow-sm">
                 <h3 className="font-bold font-mono mb-2 text-red-700">SYSTEM_FAILURE</h3>
                 <p className="text-sm font-mono text-red-600/80">{error}</p>
                 <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase rounded-md transition-all shadow-md active:scale-95"
                 >
                   Reset_System
                 </button>
               </div>
            </div>
          )}

          {/* Image Display */}
          {imageUrl && !isLoading && (
            <div className="w-full h-full flex items-center justify-center bg-slate-100/50 overflow-auto">
              <img 
                src={imageUrl} 
                alt="Character Sheet" 
                className="max-w-full max-h-full object-contain shadow-lg border border-slate-100 bg-white" 
              />
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-4 flex justify-between items-end font-mono text-[10px] text-slate-400 uppercase tracking-tight">
           <div className="space-y-0.5">
             <p>RES: 1024x1024 [OUTPUT_OPTIMIZED]</p>
             <p>MODE: STUDIO_DECONSTRUCTION_LIGHT</p>
           </div>
           <div className="flex gap-4">
             <span className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
               CPU: STABLE
             </span>
             <span className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
               GPU: CLOUD_RENDER
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;