import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            return !inline ? (
              <div className="relative group">
                 <div className="absolute right-2 top-2 text-xs text-slate-500 select-none">
                   {/* Language label could go here if parsed from className */}
                   Code
                 </div>
                <code className={`${className} block w-full text-sm`} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className={`${className} font-mono text-sm`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};