import React, { useState, useEffect, useRef } from 'react';
import { LegalHeader } from './components/LegalHeader';
import { ChatBubble } from './components/ChatBubble';
import { RetrievedSectionCard } from './components/RetrievedSectionCard';
import { AuthScreen } from './components/AuthScreen';
import { IPCLibrary } from './components/IPCLibrary';
import { CaseHistorySidebar } from './casehistorysidebar';
import { ChatMessage, LegalSection, AppState, User, ChatSession } from './types';
import { retrieveRelevantSections } from './services/ragService';
import { generateLegalAdvice } from './services/geminiService';
import { Send, Book, Scale, Info, Search, Sparkles, FileText, ShieldAlert, Gavel } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'library'>('chat');
  
  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentRetrievedSections, setCurrentRetrievedSections] = useState<LegalSection[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  // Session State (History)
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'mock-1', title: 'Property Dispute (Delhi)', preview: 'Tenant refusing eviction notice...', timestamp: Date.now() - 86400000 },
    { id: 'mock-2', title: 'Corporate Contract Breach', preview: 'NDA violation by former employee...', timestamp: Date.now() - 172800000 },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Auth state
  useEffect(() => {
    const savedUser = localStorage.getItem('legalmind_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [messages, currentView]);

  const handleLogin = (userData: User) => {
    localStorage.setItem('legalmind_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('legalmind_user');
    setUser(null);
    setMessages([]);
    setCurrentRetrievedSections([]);
    setInput('');
    setCurrentView('chat');
    setCurrentSessionId(null);
  };

  // Session Management
  const handleNewSession = () => {
    setMessages([]);
    setCurrentRetrievedSections([]);
    setCurrentSessionId(null);
    setInput('');
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleSelectSession = (id: string) => {
    // In a real app, this would load from DB. Here we just mock switching active state.
    setCurrentSessionId(id);
    // Mock loading different messages for demo purposes (if we had them stored)
    // For now, we just reset to simulate a "clean slate" or "loaded state"
    // In production: setMessages(sessions.find(s => s.id === id).messages);
    setMessages([
      {
        id: 'restored-' + id,
        role: 'assistant',
        content: `### Session Restored \n\nI have reloaded the context for **${sessions.find(s => s.id === id)?.title}**. \n\nPlease continue providing details.`,
        timestamp: Date.now()
      }
    ]);
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || appState !== AppState.IDLE) return;

    // UI Updates
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setAppState(AppState.ANALYZING);

    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // Create a new session if this is the first message
    if (!currentSessionId) {
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : ''),
        preview: textToSend.slice(0, 50) + '...',
        timestamp: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newId);
    }

    try {
      setAppState(AppState.RETRIEVING);
      
      const thinkingMsgId = 'thinking-' + Date.now();
      setMessages(prev => [...prev, {
        id: thinkingMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isThinking: true
      }]);

      const retrievedContext = await retrieveRelevantSections(textToSend);
      setCurrentRetrievedSections(retrievedContext);

      setAppState(AppState.GENERATING);
      const advice = await generateLegalAdvice(textToSend, retrievedContext);

      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingMsgId);
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: advice,
          timestamp: Date.now(),
          retrievedContext: retrievedContext
        }];
      });

    } catch (error) {
      console.error(error);
      setMessages(prev => prev.filter(m => !m.isThinking).concat({
        id: Date.now().toString(),
        role: 'assistant',
        content: "System Error: Unable to access the legal database or AI service. Please try again later.",
        timestamp: Date.now()
      }));
    } finally {
      setAppState(AppState.IDLE);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const QuickActionCard = ({ icon: Icon, title, prompt }: { icon: any, title: string, prompt: string }) => (
    <button 
      onClick={() => handleSend(prompt)}
      className="flex flex-col items-start p-4 bg-white border border-gray-200 hover:border-lense-gold hover:shadow-md transition-all text-left group w-full"
    >
      <div className="p-2 bg-lense-50 rounded-none mb-3 group-hover:bg-lense-gold/10 transition-colors">
        <Icon size={20} className="text-lense-900 group-hover:text-lense-gold transition-colors" />
      </div>
      <span className="text-sm font-bold text-lense-900 mb-1">{title}</span>
      <p className="text-[10px] text-gray-500 line-clamp-2">"{prompt.slice(0, 50)}..."</p>
    </button>
  );

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-lense-50 overflow-hidden font-sans text-lense-900">
      <LegalHeader 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Layout */}
      {currentView === 'library' ? (
        <IPCLibrary />
      ) : (
        <main className="flex-1 flex max-w-full mx-auto w-full h-[calc(100vh-64px)]">
          
          {/* Left: Case History Sidebar */}
          <CaseHistorySidebar 
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
          />

          {/* Center: Chat Interface */}
          <section className="flex-1 flex flex-col relative bg-white border-r border-gray-200 min-w-0">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent bg-lense-50/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="max-w-2xl w-full text-center">
                    <div className="w-16 h-16 bg-lense-900 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-lense-gold/20">
                      <Scale size={32} />
                    </div>
                    <h1 className="text-3xl font-serif text-lense-900 mb-3">Legal Lense AI</h1>
                    <p className="text-gray-500 mb-12 max-w-md mx-auto">
                      Specialized Indian Penal Code assistant. Secure, grounded, and precise legal analysis.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      <QuickActionCard 
                        icon={ShieldAlert}
                        title="Criminal Liability"
                        prompt="Analyze the criminal liability in a case where a person accidentally caused injury while driving rashly."
                      />
                      <QuickActionCard 
                        icon={FileText}
                        title="Contract Breach"
                        prompt="What are the IPC sections relevant to Cheating and Criminal Breach of Trust in a business contract?"
                      />
                      <QuickActionCard 
                        icon={Gavel}
                        title="Property Trespass"
                        prompt="My neighbor has built a structure on my land without permission. What legal recourse do I have under IPC?"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} className="h-4" />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-200 z-10">
              <div className="max-w-4xl mx-auto">
                <div className="relative shadow-sm bg-lense-50 focus-within:bg-white border border-gray-300 focus-within:border-lense-gold transition-all duration-300">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={adjustTextareaHeight}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe the facts of the case..."
                    className="w-full py-4 pl-5 pr-14 border-none focus:ring-0 resize-none max-h-[200px] min-h-[60px] bg-transparent text-lense-900 placeholder-gray-400 text-sm font-sans"
                    disabled={appState !== AppState.IDLE}
                    rows={1}
                  />
                  <div className="absolute right-2 bottom-2">
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || appState !== AppState.IDLE}
                      className={`p-2 transition-all duration-200 flex items-center justify-center ${
                        input.trim() && appState === AppState.IDLE
                          ? 'bg-lense-900 text-white hover:bg-lense-gold'
                          : 'bg-transparent text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {appState !== AppState.IDLE ? (
                        <div className="w-5 h-5 border-2 border-lense-gold border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-mono uppercase tracking-wide">
                  <span className="flex items-center gap-1.5"><Info size={10} /> AI-Generated Legal Guidance</span>
                  <span>Model: Gemini-3-Flash</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Retrieval Evidence Board */}
          <aside className="hidden xl:flex w-[380px] flex-col bg-lense-50 border-l border-gray-200 shadow-inner">
            <div className="p-5 border-b border-gray-200 bg-white sticky top-0 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Book size={14} className="text-lense-gold" />
                <h2 className="text-xs font-bold text-lense-900 uppercase tracking-widest">
                  Evidence Board
                </h2>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono text-gray-400">LIVE RAG</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
              {currentRetrievedSections.length > 0 ? (
                <div className="space-y-6 animate-fadeIn">
                  {currentRetrievedSections.map((section, idx) => (
                    <RetrievedSectionCard key={`${section.id}-${idx}`} section={section} />
                  ))}
                  
                  <div className="p-4 bg-lense-900 text-lense-50 border-l-4 border-lense-gold shadow-lg mt-8">
                    <p className="font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2 text-lense-gold">
                      <Sparkles size={12} /> 
                      Context Active
                    </p>
                    <p className="text-xs leading-relaxed opacity-80 font-serif">
                      The AI response is grounded in these specific IPC sections.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                  <Search size={32} className="mb-4 stroke-1" />
                  <p className="text-xs font-serif italic text-center px-10">
                    Relevant legal sections will appear here automatically when you analyze a case.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </main>
      )}
    </div>
  );
};

export default App;