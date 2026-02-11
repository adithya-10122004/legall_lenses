import React from 'react';
import { LegalSection } from '../types';
import { Gavel } from 'lucide-react';

interface Props {
  section: LegalSection;
}

export const RetrievedSectionCard: React.FC<Props> = ({ section }) => {
  return (
    <div className="group bg-white rounded-none border-l-4 border-l-lense-200 border-y border-r border-gray-200 p-5 mb-4 hover:border-l-lense-gold transition-all duration-300 shadow-sm hover:shadow-md">
      
      {/* Meta Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
           IPC / {section.section}
        </span>
        <div className="h-px w-12 bg-gray-200 group-hover:bg-lense-gold/50 transition-colors"></div>
      </div>

      {/* Title */}
      <h3 className="font-serif font-bold text-lense-900 text-2xl leading-tight mb-9">
        {section.title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed font-sans mb-7 border-l-2 border-gray-100 pl-3">
        {section.description}
      </p>

      {/* Punishment */}
      {section.punishment && (
        <div className="bg-gray-50 p-3 border border-gray-100 flex gap-3 items-start">
          <Gavel size={14} className="text-lense-gold mt-0.5 shrink-0" />
          <div className="flex-1">
             <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">Penal Provision</span>
             <p className="text-xs font-medium text-lense-800">
                {section.punishment}
             </p>
          </div>
        </div>
      )}
      
      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1">
        {section.keywords.slice(0, 4).map((k) => (
          <span key={k} className="text-[9px] px-1.5 py-0.5 border border-gray-200 text-gray-400 font-mono uppercase hover:border-lense-gold hover:text-lense-gold transition-colors">
            {k}
          </span>
        ))}
      </div>
    </div>
  );
};