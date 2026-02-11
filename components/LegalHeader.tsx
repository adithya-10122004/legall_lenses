import React from 'react';
import { Scale, LogOut, User as UserIcon, Settings, Bell } from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User | null;
  onLogout: () => void;
  currentView: 'chat' | 'library';
  onViewChange: (view: 'chat' | 'library') => void;
}

export const LegalHeader: React.FC<Props> = ({ user, onLogout, currentView, onViewChange }) => {
  return (
    <header className="bg-lense-900 text-white z-20 sticky top-0 border-b border-lense-800">
      <div className="max-w-full px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer group w-64 -ml-6 pl-6 border-r border-lense-800 h-16" onClick={() => onViewChange('chat')}>
            <div className="w-8 h-8 border border-lense-gold flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300 bg-lense-900">
               <Scale className="w-4 h-4 text-lense-gold transform group-hover:-rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
               <h1 className="text-lg font-serif tracking-wide text-white leading-none">Legal Lense</h1>
               <span className="text-[9px] font-mono text-lense-400 tracking-widest">AI COUNSEL</span>
            </div>
          </div>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onViewChange('chat')}
                className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full border ${
                  currentView === 'chat' 
                    ? 'bg-lense-800 border-lense-700 text-white' 
                    : 'border-transparent text-lense-400 hover:text-white hover:bg-lense-800'
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => onViewChange('library')}
                className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full border ${
                  currentView === 'library' 
                    ? 'bg-lense-800 border-lense-700 text-white' 
                    : 'border-transparent text-lense-400 hover:text-white hover:bg-lense-800'
                }`}
              >
                IPC Library
              </button>
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {user && (
            <>
              <div className="flex items-center gap-4 text-lense-400">
                 <Bell size={16} className="hover:text-white cursor-pointer transition-colors" />
                 <Settings size={16} className="hover:text-white cursor-pointer transition-colors" />
              </div>

              <div className="flex items-center gap-4 pl-6 border-l border-lense-800 h-8">
                <div className="flex items-center gap-3 group cursor-pointer">
                   <div className="h-8 w-8 rounded-full bg-lense-800 flex items-center justify-center text-lense-300 border border-lense-700 overflow-hidden">
                      {user.profile_picture_url ? (
                      <img src={user.profile_picture_url} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                      <UserIcon size={14} />
                      )}
                  </div>
                  <div className="hidden lg:flex flex-col">
                      <span className="text-xs font-bold text-white tracking-wide group-hover:text-lense-gold transition-colors">{user.name}</span>
                  </div>
                </div>
                <button 
                    onClick={onLogout}
                    className="text-lense-400 hover:text-white transition-colors ml-2"
                    title="Logout"
                >
                    <LogOut size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};