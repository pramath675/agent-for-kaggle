import React from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Bot, User, AlertCircle } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-emerald-600'
        }`}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl text-sm md:text-base shadow-md ${
            isUser 
              ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
              : 'bg-slate-850 border border-slate-800 text-slate-100 rounded-tl-none'
          }`}>
            {message.error ? (
               <div className="flex items-center text-red-400 gap-2">
                 <AlertCircle size={16} />
                 <span>{message.text}</span>
               </div>
            ) : (
              <>
                {message.isThinking ? (
                  <div className="flex items-center gap-2 text-slate-400">
                     <span className="text-xs font-mono uppercase tracking-wider">Thinking</span>
                     <TypingIndicator />
                  </div>
                ) : (
                  <MarkdownRenderer content={message.text} />
                )}
              </>
            )}
          </div>
          
          {/* Timestamp/Status (Optional) */}
          {!message.isThinking && (
            <span className="text-xs text-slate-600 mt-1 px-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};