import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  text,
  className = '',
  inline = false,
}) => {
  if (!text) return null;

  // Function to render single katex string safely
  const renderKaTeXString = (mathString: string, displayMode: boolean): string => {
    try {
      return katex.renderToString(mathString.trim(), {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return mathString;
    }
  };

  // Check if text has explicit LaTeX delimiters like $$...$$ or $...$ or \[...\] or \(...\)
  const hasDelimiters = /\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/.test(text);

  // Check if text looks like pure raw TeX formula (e.g., starts with \ or contains TeX macros)
  const hasTeXMacro = /\\(frac|sqrt|sum|int|lim|alpha|beta|gamma|delta|pi|theta|pm|times|div|le|ge|neq|approx|infty|begin|end|matrix|vec|hat)/.test(text);

  if (!hasDelimiters && hasTeXMacro) {
    // Pure TeX formula without $ delimiters
    const html = renderKaTeXString(text, !inline);
    return (
      <span
        className={`math-rendered ${className} ${inline ? 'inline-block' : 'block my-1'}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (!hasDelimiters) {
    // Plain text without math formulas
    return <span className={className}>{text}</span>;
  }

  // Parse text into segments of plain text and math
  const segments: { type: 'text' | 'inline-math' | 'block-math'; content: string }[] = [];
  
  // Regex pattern matching $$...$$, $...$, \[...\], \(...\)
  const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[\s\S]*?\$|\\\([\s\S]*?\\\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const plainText = text.substring(lastIndex, match.index);
    if (plainText) {
      segments.push({ type: 'text', content: plainText });
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
      segments.push({ type: 'block-math', content: matchedStr.slice(2, -2) });
    } else if (matchedStr.startsWith('\\[') && matchedStr.endsWith('\\]')) {
      segments.push({ type: 'block-math', content: matchedStr.slice(2, -2) });
    } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
      segments.push({ type: 'inline-math', content: matchedStr.slice(1, -1) });
    } else if (matchedStr.startsWith('\\(') && matchedStr.endsWith('\\)')) {
      segments.push({ type: 'inline-math', content: matchedStr.slice(2, -2) });
    }

    lastIndex = regex.lastIndex;
  }

  const remainingText = text.substring(lastIndex);
  if (remainingText) {
    segments.push({ type: 'text', content: remainingText });
  }

  return (
    <span className={`math-container ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <span key={idx}>{seg.content}</span>;
        }

        const isBlock = seg.type === 'block-math';
        const html = renderKaTeXString(seg.content, isBlock);

        return (
          <span
            key={idx}
            className={`math-item ${isBlock ? 'block my-2 text-center overflow-x-auto' : 'inline-block px-1'}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};
