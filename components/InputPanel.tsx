
import React, { useState } from 'react';
import { Upload, X, Zap, Loader2 } from 'lucide-react';
import { CharacterInputs, GenerationStatus } from '../types';

interface InputPanelProps {
  onGenerate: (inputs: CharacterInputs) => void;
  status: GenerationStatus;
}

const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, status }) => {
  const [inputs, setInputs] = useState<CharacterInputs>({
    name: '',
    archetype: '',
    appearance: '',
    clothing: '',
    accessories: '',
    expressions: 'Madness, Ecstasy, Cold Stare',
    secretItem: '',
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInputs((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setInputs((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(inputs);
  };

  const isGenerating = status === GenerationStatus.GENERATING;

  return (
    <div className="bg-white border-r border-slate-200 p-6 flex flex-col h-full overflow-y-auto w-full md:w-[450px] shrink-0 shadow-lg relative z-30">
      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono text-cyan-700 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          INPUT_PARAMETERS
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">Define extraction targets.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        
        {/* Reference Image Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">
            Ref. Image (Optional)
          </label>
          <div className="relative group">
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-500 text-white p-1 rounded-md transition-all shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-cyan-600 hover:bg-slate-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-cyan-600 transition-colors" />
                  <p className="text-xs text-slate-400 font-mono">UPLOAD SOURCE MATERIAL</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">SUBJECT_ID</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Unit-01"
              value={inputs.name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/10 focus:outline-none transition-all font-mono placeholder:text-slate-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">ARCHETYPE</label>
            <input
              type="text"
              name="archetype"
              placeholder="e.g. Cyber-Assassin"
              value={inputs.archetype}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none transition-all font-mono placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono font-bold text-slate-600">PHYSICAL_TRAITS</label>
          <textarea
            name="appearance"
            rows={3}
            placeholder="Detailed body description..."
            value={inputs.appearance}
            onChange={handleInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none transition-all resize-none placeholder:text-slate-300"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono font-bold text-slate-600">ATTIRE_LAYER_DATA</label>
          <textarea
            name="clothing"
            rows={3}
            placeholder="Outerwear, main dress, inner layers..."
            value={inputs.clothing}
            onChange={handleInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none transition-all resize-none placeholder:text-slate-300"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono font-bold text-slate-600">INVENTORY_MATRIX</label>
          <textarea
            name="accessories"
            rows={2}
            placeholder="Bag contents, weapons, daily items..."
            value={inputs.accessories}
            onChange={handleInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none transition-all resize-none placeholder:text-slate-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-600">EXPRESSION_SET</label>
                <input
                type="text"
                name="expressions"
                placeholder="Emotions to render"
                value={inputs.expressions}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none transition-all font-mono placeholder:text-slate-300"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-purple-700">PRIVATE_ITEM</label>
                <input
                type="text"
                name="secretItem"
                placeholder="Hidden object..."
                value={inputs.secretItem}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-purple-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-purple-600 focus:outline-none transition-all font-mono placeholder:text-purple-200"
                />
            </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating || (!inputs.appearance && !inputs.image)}
          className={`w-full py-4 mt-6 rounded-md font-bold font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm ${
            isGenerating
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-cyan-700 hover:bg-cyan-800 text-white border border-cyan-800 hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              PROCESSING
            </>
          ) : (
            <>
              INITIATE_DECONSTRUCTION
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
           <span>SYS.VER.2.5.0.LIGHT</span>
           <span className="flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
             STATUS: ONLINE
           </span>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;