/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MemeGallery from './components/MemeGallery';
import MemeEditor from './components/MemeEditor';
import { Meme } from './services/imgflip';
import { Zap } from 'lucide-react';

export default function App() {
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-2">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display uppercase tracking-tighter">
              Meme<span className="text-lime-500">Gen</span>
            </h1>
          </div>
          <div className="hidden md:block font-mono text-xs uppercase tracking-widest">
            AI Enabled MeMe Maker
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedMeme ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <MemeEditor 
                selectedMeme={selectedMeme} 
                onClose={() => setSelectedMeme(null)} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-8xl font-display uppercase leading-[0.8] mb-6">
                  Make it <br/>
                  <span className="bg-black text-white px-2">Viral</span>
                </h1><br></br>
                <p className="font-mono text-lg md:text-xl border-l-4 border-lime-400 pl-4 text-left mx-auto max-w-md">
                  Select a template below to start creating. 
                  Generate captions instantly.
                </p>
              </div>
              
              <MemeGallery onSelectMeme={setSelectedMeme} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

