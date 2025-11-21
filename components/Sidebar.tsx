import React from 'react';
import { ChatConfig, MODELS, GeminiModel } from '../types';
import { Settings, MessageSquare, Zap, BrainCircuit } from 'lucide-react';

interface SidebarProps {
  config: ChatConfig;
  onConfigChange: (newConfig: ChatConfig) => void;
  onClearChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ config, onConfigChange, onClearChat, isOpen, toggleSidebar }) => {
  
  const handleChange = (key: keyof ChatConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-72 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">Nexus AI</h1>
        </div>

        {/* Settings Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Model Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Zap size={14} />
              Model Selection
            </label>
            <div className="grid gap-3">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleChange('model', model.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    config.model === model.id
                      ? 'bg-blue-600/10 border-blue-600/50 ring-1 ring-blue-600/50'
                      : 'bg-slate-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`font-medium text-sm ${config.model === model.id ? 'text-blue-400' : 'text-slate-200'}`}>
                    {model.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {model.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Thinking Budget */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                 Thinking Budget
               </label>
               <span className="text-xs font-mono text-slate-500">{config.thinkingBudget} tokens</span>
            </div>
            <input
              type="range"
              min="0"
              max="8192"
              step="1024"
              value={config.thinkingBudget}
              onChange={(e) => handleChange('thinkingBudget', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-xs text-slate-600">
              Allocates tokens for internal reasoning before answering. Set to 0 to disable.
            </p>
          </div>

           {/* System Instruction */}
           <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Settings size={14} />
              System Persona
            </label>
            <textarea
              value={config.systemInstruction}
              onChange={(e) => handleChange('systemInstruction', e.target.value)}
              className="w-full h-32 bg-slate-850 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none"
              placeholder="How should the AI behave?"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onClearChat}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <MessageSquare size={16} />
            New Chat
          </button>
        </div>

      </aside>
    </>
  );
};