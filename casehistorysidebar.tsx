import React from 'react';
import { Plus, MessageSquare, Clock, ChevronRight, FolderOpen } from 'lucide-react';
import { ChatSession } from './types';

interface Props {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

export const CaseHistorySidebar: React.FC<Props> = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewSession 
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-lense-900 border-r border-lense-800 text-lense-300 h-full">
      {/* Header */}
      <div className="p-5 border-b border-lense-800">
        <button 
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 bg-lense-gold hover:bg-yellow-600 text-white py-3 px-4 transition-all duration-200 group shadow-lg shadow-lense-black/20"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">New Case</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-lense-800">
        <div className="px-5 mb-3 flex items-center justify-between">
           <span className="text-[10px] font-bold uppercase tracking-widest text-lense-500">Recent Matters</span>
           <Clock size={12} className="text-lense-600" />
        </div>

        <div className="space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-5 py-4 border-l-[3px] transition-all hover:bg-lense-800 group relative ${
                currentSessionId === session.id 
                  ? 'bg-lense-800 border-lense-gold text-white' 
                  : 'border-transparent text-lense-400 hover:text-lense-200'
              }`}
            >
              <h4 className="text-sm font-serif font-medium truncate pr-4 mb-1">
                {session.title}
              </h4>
              <p className="text-[10px] truncate opacity-60 font-mono">
                {session.preview}
              </p>
              
              {currentSessionId === session.id && (
                <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-lense-gold" />
              )}
            </button>
          ))}

          {sessions.length === 0 && (
            <div className="px-6 py-8 text-center">
               <div className="w-10 h-10 rounded-full bg-lense-800 flex items-center justify-center mx-auto mb-3 text-lense-600">
                  <FolderOpen size={16} />
               </div>
               <p className="text-xs text-lense-500">No case history found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-lense-950 border-t border-lense-800 text-[10px] text-lense-600 font-mono text-center">
        ENCRYPTED WORKSPACE
      </div>
    </aside>
  );
};