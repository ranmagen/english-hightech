import { useState, useRef } from 'react';
import { GLOSSARY_TERMS } from '../../data/glossary';

interface Props {
  text: string;
}

export function GlossaryTooltip({ text }: Props) {
  const [tooltip, setTooltip] = useState<{ term: string; definition: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Wrap glossary terms in text with tooltip triggers
  const terms = GLOSSARY_TERMS.map(t => t.term).sort((a, b) => b.length - a.length);
  const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  const parts: Array<{ type: 'text' | 'term'; content: string; definition?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const glossary = GLOSSARY_TERMS.find(t => t.term.toLowerCase() === match![0].toLowerCase());
    parts.push({
      type: 'term',
      content: match[0],
      definition: glossary?.definition_he,
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return (
    <span ref={containerRef}>
      {parts.map((part, i) => {
        if (part.type === 'text') return <span key={i}>{part.content}</span>;
        return (
          <span
            key={i}
            className="relative inline font-semibold text-sky-700 border-b border-dashed border-sky-400 cursor-help"
            onMouseEnter={e => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              setTooltip({ term: part.content, definition: part.definition || '', x: rect.left, y: rect.top });
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            {part.content}
            {tooltip?.term === part.content && (
              <span className="tooltip-content text-right" dir="rtl">
                <span className="font-bold text-sky-300">{part.content}</span>
                <br />
                {part.definition}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
