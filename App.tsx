import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send, Menu, Sparkles } from 'lucide-react';

import { Message, ChatConfig, DEFAULT_CONFIG } from './types';
import { geminiService } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [config, setConfig] = useState<ChatConfig>(DEFAULT_CONFIG);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  // Initialize chat on mount or config change
  useEffect(() => {
    // If we already have messages, we might not want to hard reset unless user clicks "New Chat"
    // But changing system instruction or model usually requires a new session context in this simple implementation.
    // To allow changing models mid-chat, we'd need to reconstruct history. 
    // For this demo, changing config resets the session logic internally but we keep visual messages until explicit clear.
    geminiService.startChat(config);
    setChatInitialized(true);
  }, [config]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Placeholder for AI message
    const aiMessageId = uuidv4();
    const aiPlaceholder: Message = {
      id: aiMessageId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isThinking: true,
    };
    setMessages((prev) => [...prev, aiPlaceholder]);

    try {
      let fullText = '';
      
      // Start streaming
      const stream = geminiService.sendMessageStream(userText);
      
      for await (const chunk of stream) {
        fullText += chunk;
        
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMessageId 
              ? { ...msg, text: fullText, isThinking: false } 
              : msg
          )
        );
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMessageId 
            ? { ...msg, text: "Sorry, I encountered an error processing your request.", isThinking: false, error: true } 
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    geminiService.startChat(config); // Reset underlying session
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar 
        config={config} 
        onConfigChange={setConfig} 
        onClearChat={clearChat}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Bar (Mobile only mainly, or global status) */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/50 backdrop-blur-md absolute top-0 w-full z-10 md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            <Menu size={20} className="text-slate-400" />
          </button>
          <span className="font-semibold text-sm">Nexus AI</span>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-4">
                  <Sparkles className="text-white w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500">
                  How can I help you today?
                </h2>
                <p className="text-slate-400 max-w-md">
                  I'm Nexus, capable of complex reasoning, coding assistance, and creative writing.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8">
                   {['Explain quantum entanglement', 'Write a Python script to scrape a website', 'Debug this React component', 'Write a haiku about AI'].map((suggestion) => (
                     <button 
                       key={suggestion}
                       onClick={() => {
                         setInput(suggestion);
                         // Optional: auto-send logic could go here, but usually better to let user confirm
                       }}
                       className="p-3 text-sm text-left bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 rounded-xl transition-all text-slate-300"
                     >
                       {suggestion}
                     </button>
                   ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="p-4 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/50">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Nexus..."
              rows={1}
              className="w-full bg-slate-900 text-slate-200 rounded-xl pl-4 pr-12 py-3.5 shadow-lg border border-slate-800 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none resize-none overflow-hidden min-h-[52px] max-h-32 transition-all"
              style={{ height: 'auto', minHeight: '52px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-600">
               AI can make mistakes. Please verify important information.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;