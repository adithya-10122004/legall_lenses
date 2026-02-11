import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { Scale, User as UserIcon, Loader2, Gavel, FileText } from 'lucide-react';

interface Props {
  message: ChatMessage;
}

export const ChatBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';

  if (message.isThinking) {
    return (
      <div className="flex gap-4 p-6 max-w-4xl mx-auto w-full my-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="w-10 h-10 bg-white border border-lense-100 shadow-sm flex items-center justify-center shrink-0">
            <Loader2 className="animate-spin text-lense-gold" size={18} />
        </div>
        <div className="flex-1 space-y-3 py-1">
             <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-lense-200 rounded animate-pulse"></div>
                <span className="text-[10px] font-mono text-lense-400 uppercase tracking-widest">
                  Reviewing Precedents
                </span>
             </div>
             <div className="space-y-2 opacity-50">
               <div className="h-2 w-full max-w-md bg-lense-100 rounded animate-pulse"></div>
               <div className="h-2 w-full max-w-sm bg-lense-50 rounded animate-pulse"></div>
             </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group w-full border-b border-gray-100 transition-colors duration-300 ${isUser ? 'bg-white py-10' : 'bg-lense-50/50 py-12'}`}>
      <div className="max-w-4xl mx-auto px-6 flex gap-8">
        
        {/* Avatar / Icon Column */}
        <div className="shrink-0 flex flex-col items-center">
           <div className={`w-12 h-12 flex items-center justify-center border shadow-sm transition-transform duration-500 hover:scale-105 ${
             isUser 
               ? 'bg-white border-gray-200 text-gray-400 rounded-full' 
               : 'bg-lense-900 border-lense-900 text-lense-gold rounded-none' // Square for AI (Official feel)
           }`}>
             {isUser ? <UserIcon size={20} /> : <Scale size={24} />}
           </div>
           
           {!isUser && (
             <div className="h-full w-px bg-lense-200/50 mt-4 mb-4 group-hover:bg-lense-gold/30 transition-colors"></div>
           )}
        </div>
        
        {/* Content Column */}
        <div className="flex-1 min-w-0">
           {/* Meta Header */}
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isUser ? 'text-gray-400' : 'text-lense-900'}`}>
                  {isUser ? 'Case Scenario' : 'Legal Opinion'}
                </span>
                {!isUser && <div className="px-2 py-0.5 bg-lense-gold/10 text-lense-gold text-[9px] font-bold uppercase tracking-wider border border-lense-gold/20">AI Generated</div>}
              </div>
              <span className="text-[10px] text-gray-300 font-mono">
                 {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
           </div>

           {/* Message Body */}
           {isUser ? (
             <div className="text-lg text-gray-800 font-serif leading-relaxed italic opacity-90">
               "{message.content}"
             </div>
           ) : (
             <div className="bg-white p-8 md:p-10 border border-gray-200 shadow-sm relative">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lense-gold to-lense-900"></div>
                
                {/* Watermark effect */}
                <Gavel className="absolute right-6 top-6 text-gray-50 opacity-[0.03] transform rotate-12" size={120} />

                <div className="prose prose-sm max-w-none 
                  text-gray-600
                  
                  // Headings
                  prose-headings:font-serif 
                  prose-headings:text-lense-900 
                  
                  // H1 - Main Title
                  prose-h1:text-2xl 
                  prose-h1:font-medium
                  prose-h1:border-b 
                  prose-h1:border-gray-100 
                  prose-h1:pb-4 
                  prose-h1:mb-8
                  
                  // H3 - Section Headers (Offense Names)
                  prose-h3:text-lg 
                  prose-h3:mt-10 
                  prose-h3:mb-4
                  prose-h3:flex
                  prose-h3:items-center
                  prose-h3:gap-3
                  prose-h3:text-lense-900
                  
                  // Paragraphs
                  prose-p:leading-8 
                  prose-p:text-base
                  prose-p:font-light
                  prose-p:mb-6
                  
                  // Bold Text (Highlighted IPC Sections)
                  prose-strong:font-bold 
                  prose-strong:text-lense-800
                  prose-strong:bg-lense-gold/10
                  prose-strong:px-1.5
                  prose-strong:py-0.5
                  prose-strong:rounded-sm
                  prose-strong:border-b-2
                  prose-strong:border-lense-gold/30
                  prose-strong:font-mono
                  prose-strong:text-xs
                  
                  // Lists
                  prose-ul:my-6
                  prose-li:my-2
                  prose-li:pl-2
                  
                  // Blockquotes (Punishment / Verdicts)
                  prose-blockquote:bg-gray-50 
                  prose-blockquote:border-l-4 
                  prose-blockquote:border-lense-900 
                  prose-blockquote:px-6 
                  prose-blockquote:py-5
                  prose-blockquote:my-8
                  prose-blockquote:not-italic
                  prose-blockquote:text-lense-800
                  prose-blockquote:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]
                  
                  // Horizontal Rules
                  prose-hr:my-10
                  prose-hr:border-gray-100
                ">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                   <FileText size={12} />
                   <span>End of Analysis</span>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};