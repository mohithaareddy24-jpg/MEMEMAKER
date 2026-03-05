import React, { useState, useRef, useEffect } from 'react';
import { Download, RefreshCw, Wand2, Image as ImageIcon, Type, X } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'motion/react';
import { Meme } from '../services/imgflip';
import { generateMemeCaption } from '../services/ai';

interface MemeEditorProps {
  selectedMeme: Meme | null;
  onClose: () => void;
}

export default function MemeEditor({ selectedMeme, onClose }: MemeEditorProps) {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textShadow, setTextShadow] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  
  const memeRef = useRef<HTMLDivElement>(null);

  // Fetch image as blob to avoid CORS issues with html-to-image
  useEffect(() => {
    const fetchImageAsBlob = async () => {
      if (!selectedMeme?.url) return;
      
      setImageLoading(true);
      setBlobUrl(null);
      
      try {
        const response = await fetch(selectedMeme.url, {
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error('Error loading image:', error);
        // Fallback to original URL if blob fails
        setBlobUrl(selectedMeme.url);
      } finally {
        setImageLoading(false);
      }
    };

    fetchImageAsBlob();

    // Cleanup blob URL to avoid memory leaks
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [selectedMeme?.url]);

  // Reset state when meme changes
  useEffect(() => {
    setTopText('');
    setBottomText('');
  }, [selectedMeme]);

  const handleDownload = async () => {
    if (memeRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(memeRef.current);
        saveAs(dataUrl, `meme-${selectedMeme?.name.replace(/\s+/g, '-').toLowerCase() || 'generated'}.png`);
      } catch (error) {
        console.error('Error downloading meme:', error);
      }
    }
  };

  const handleGenerateCaption = async () => {
    if (!selectedMeme) return;
    
    setIsGenerating(true);
    try {
      const { topText: newTop, bottomText: newBottom } = await generateMemeCaption(selectedMeme.name);
      setTopText(newTop);
      setBottomText(newBottom);
    } catch (error) {
      console.error('Failed to generate caption', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedMeme) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white brutal-border p-6 max-w-4xl mx-auto w-full"
    >
      <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
        <h2 className="text-3xl font-display uppercase tracking-tighter">
          Editor <span className="text-lime-500">//</span> {selectedMeme.name}
        </h2>
        <button onClick={onClose} className="hover:bg-red-100 p-2 rounded-full transition-colors border-2 border-transparent hover:border-black">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="flex flex-col gap-4">
          <div className="relative bg-gray-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden group">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin rounded-full" />
              </div>
            )}
            <div ref={memeRef} className="relative bg-white w-full h-full flex items-center justify-center overflow-hidden">
              <img 
                src={blobUrl || selectedMeme?.url} 
                alt={selectedMeme.name} 
                className="w-full h-auto object-contain max-h-[500px]"
                crossOrigin="anonymous"
              />
              
              <h2 
                className="absolute top-4 left-4 right-4 text-center leading-tight uppercase font-display break-words pointer-events-none"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  color: textColor,
                  textShadow: textShadow ? '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' : 'none',
                  fontFamily: 'Anton, sans-serif'
                }}
              >
                {topText}
              </h2>
              
              <h2 
                className="absolute bottom-4 left-4 right-4 text-center leading-tight uppercase font-display break-words pointer-events-none"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  color: textColor,
                  textShadow: textShadow ? '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' : 'none',
                  fontFamily: 'Anton, sans-serif'
                }}
              >
                {bottomText}
              </h2>
            </div>
          </div>
          <p className="text-xs font-mono text-gray-500 text-center uppercase">Preview Canvas</p>
        </div>

        {/* Controls Area */}
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-bold uppercase text-sm mb-2 font-mono">Top Text</label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="ENTER TOP TEXT"
                className="brutal-input"
              />
            </div>
            
            <div>
              <label className="block font-bold uppercase text-sm mb-2 font-mono">Bottom Text</label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="ENTER BOTTOM TEXT"
                className="brutal-input"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-2 border-black border-dashed">
            <h3 className="font-bold uppercase text-sm mb-4 font-mono flex items-center gap-2">
              <Type className="w-4 h-4" /> Style Controls
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Font Size</label>
                <input 
                  type="range" 
                  min="20" 
                  max="80" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Text Color</label>
                <div className="flex gap-2">
                  {['#ffffff', '#000000', '#ff0000', '#ffff00'].map(color => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-8 h-8 rounded-full border-2 border-black ${textColor === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={textShadow} 
                   onChange={(e) => setTextShadow(e.target.checked)}
                   className="w-5 h-5 border-2 border-black rounded-none accent-black"
                 />
                 <span className="text-sm font-bold uppercase">Enable Text Outline</span>
               </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <button 
              onClick={handleGenerateCaption}
              disabled={isGenerating}
              className="brutal-btn bg-lime-300 hover:bg-lime-400 flex items-center justify-center gap-2 w-full"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              {isGenerating ? 'Generating caption...' : 'Generate Caption'}
            </button>
            
            <button 
              onClick={handleDownload}
              className="brutal-btn bg-pink-300 hover:bg-pink-400 flex items-center justify-center gap-2 w-full"
            >
              <Download className="w-5 h-5" />
              Download Meme
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
