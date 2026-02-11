import React, { useState, useMemo } from 'react';
import { MOCK_IPC_DATABASE } from '../services/legalData';
import { RetrievedSectionCard } from './RetrievedSectionCard';
import { Search, Grid, Filter } from 'lucide-react';

export const IPCLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const allKeywords = useMemo(() => {
    const keywords = new Set<string>();
    MOCK_IPC_DATABASE.forEach(section => {
      section.keywords.forEach(k => keywords.add(k));
    });
    return Array.from(keywords).sort();
  }, []);

  const filteredSections = useMemo(() => {
    return MOCK_IPC_DATABASE.filter(section => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        section.title.toLowerCase().includes(searchLower) ||
        section.section.toLowerCase().includes(searchLower) ||
        section.description.toLowerCase().includes(searchLower);
      
      const matchesKeyword = selectedKeyword 
        ? section.keywords.includes(selectedKeyword)
        : true;

      return matchesSearch && matchesKeyword;
    });
  }, [searchTerm, selectedKeyword]);

  return (
    <div className="flex-1 h-full bg-lense-50 overflow-y-auto scrollbar-thin">
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-serif font-medium text-lense-900 mb-2">IPC Archives</h2>
          <p className="text-sm text-gray-500 mb-8 font-mono">Full digital repository of the Indian Penal Code.</p>

          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-lense-50 border-b-2 border-gray-200 focus:border-lense-gold outline-none text-lense-900 placeholder-gray-400 font-serif transition-colors"
              placeholder="Search specific codes, acts or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2 items-center">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-2 font-mono">
                <Filter size={10} /> Filters
             </span>
             <button
                onClick={() => setSelectedKeyword(null)}
                className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider transition-colors border ${
                  selectedKeyword === null 
                    ? 'bg-lense-900 text-white border-lense-900' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
             >
                All
             </button>
             {allKeywords.slice(0, 8).map(keyword => (
               <button
                 key={keyword}
                 onClick={() => setSelectedKeyword(selectedKeyword === keyword ? null : keyword)}
                 className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider transition-colors border ${
                   selectedKeyword === keyword
                     ? 'bg-lense-gold text-white border-lense-gold'
                     : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                 }`}
               >
                 {keyword}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-2">
            <span className="text-xs font-mono text-gray-400 uppercase">Index Results</span>
            <span className="text-xs font-bold text-lense-900">{filteredSections.length} Entries</span>
        </div>
        
        {filteredSections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map((section) => (
              <div key={section.id} className="h-full">
                <RetrievedSectionCard section={section} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Grid size={40} strokeWidth={1} className="mb-4 text-gray-300"/>
            <p className="font-serif italic text-lg text-gray-500">No records found matching criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};