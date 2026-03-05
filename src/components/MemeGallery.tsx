import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import { Meme, fetchMemes } from '../services/imgflip';

interface MemeGalleryProps {
  onSelectMeme: (meme: Meme) => void;
}

export default function MemeGallery({ onSelectMeme }: MemeGalleryProps) {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadMemes = async () => {
      const fetchedMemes = await fetchMemes();
      setMemes(fetchedMemes);
      setLoading(false);
    };
    loadMemes();
  }, []);

  const filteredMemes = memes.filter(meme => 
    meme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRandom = () => {
    if (memes.length > 0) {
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      onSelectMeme(randomMeme);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-display uppercase leading-none mb-2">
            Select <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-600" style={{ WebkitTextStroke: '2px black' }}>Template</span>
          </h2>
          <p className="font-mono text-gray-500 uppercase tracking-widest text-sm">
            {memes.length} templates available
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={handleRandom}
            className="brutal-btn bg-yellow-300 hover:bg-yellow-400 flex items-center justify-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            Random
          </button>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="SEARCH TEMPLATES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="brutal-input w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse border-2 border-black" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMemes.map((meme) => (
            <motion.div
              key={meme.id}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => onSelectMeme(meme)}
              className="group cursor-pointer bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="aspect-square overflow-hidden border-b-2 border-black relative">
                <img 
                  src={meme.url} 
                  alt={meme.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-lime-400/0 group-hover:bg-lime-400/20 transition-colors" />
              </div>
              <div className="p-3">
                <h3 className="font-display uppercase text-lg leading-tight truncate">{meme.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {filteredMemes.length === 0 && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-black bg-gray-50">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="font-mono text-xl uppercase">No memes found</p>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
