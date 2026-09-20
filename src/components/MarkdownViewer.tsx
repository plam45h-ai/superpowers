import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  // A lightweight, highly polished regex-based markdown parser
  const renderLine = (line: string, index: number) => {
    const trimmed = line.trim();

    // 1. Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      return <hr key={index} className="my-8 border-stone-200" />;
    }

    // 2. Headings
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={index} className="text-3xl font-bold tracking-tight text-stone-900 mt-8 mb-4">
          {trimmed.slice(2)}
        </h1>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={index} className="text-2xl font-semibold tracking-tight text-stone-900 mt-8 mb-3 border-b border-stone-100 pb-2">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={index} className="text-xl font-medium text-stone-900 mt-6 mb-2">
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith('#### ')) {
      return (
        <h4 key={index} className="text-lg font-medium text-stone-800 mt-5 mb-2">
          {trimmed.slice(5)}
        </h4>
      );
    }

    // 3. Blockquotes
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={index} className="pl-4 border-l-4 border-amber-500 text-stone-600 italic my-4 bg-stone-50 py-2 pr-2 rounded-r-md">
          {parseInline(trimmed.slice(2))}
        </blockquote>
      );
    }

    // 4. Bullet lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <li key={index} className="ml-6 list-disc text-stone-600 mb-2 leading-relaxed">
          {parseInline(trimmed.slice(2))}
        </li>
      );
    }

    // 5. Numbered lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <li key={index} className="ml-6 list-decimal text-stone-600 mb-2 leading-relaxed">
          {parseInline(numMatch[2])}
        </li>
      );
    }

    // 6. Code Block boundaries (handled simplified here, but we can style lines inside)
    if (trimmed.startsWith('```')) {
      return null; // Ignore boundaries or handle differently
    }

    // 7. Regular paragraph
    if (trimmed === '') {
      return <div key={index} className="h-4" />;
    }

    return (
      <p key={index} className="text-stone-600 leading-relaxed mb-4 text-[15px]">
        {parseInline(line)}
      </p>
    );
  };

  // Helper to parse inline styles like **bold**, `code`, etc.
  const parseInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    while (currentText.length > 0) {
      // Find first occurrence of bold or code
      const boldIdx = currentText.indexOf('**');
      const codeIdx = currentText.indexOf('`');

      // Helper to process text before any markdown characters
      const processNormalText = (endIdx: number) => {
        parts.push(currentText.substring(0, endIdx));
        currentText = currentText.substring(endIdx);
      };

      if (boldIdx === -1 && codeIdx === -1) {
        parts.push(currentText);
        break;
      }

      // Handle bold first if it occurs first
      if (boldIdx !== -1 && (codeIdx === -1 || boldIdx < codeIdx)) {
        if (boldIdx > 0) {
          processNormalText(boldIdx);
        }
        // Skip '**'
        currentText = currentText.substring(2);
        const nextBoldIdx = currentText.indexOf('**');
        if (nextBoldIdx !== -1) {
          parts.push(
            <strong key={key++} className="font-semibold text-stone-900">
              {currentText.substring(0, nextBoldIdx)}
            </strong>
          );
          currentText = currentText.substring(nextBoldIdx + 2);
        } else {
          parts.push('**' + currentText);
          break;
        }
      }
      // Handle code if it occurs first
      else if (codeIdx !== -1) {
        if (codeIdx > 0) {
          processNormalText(codeIdx);
        }
        // Skip '`'
        currentText = currentText.substring(1);
        const nextCodeIdx = currentText.indexOf('`');
        if (nextCodeIdx !== -1) {
          parts.push(
            <code key={key++} className="px-1.5 py-0.5 font-mono text-[13px] bg-stone-100 border border-stone-200 rounded text-amber-700">
              {currentText.substring(0, nextCodeIdx)}
            </code>
          );
          currentText = currentText.substring(nextCodeIdx + 1);
        } else {
          parts.push('`' + currentText);
          break;
        }
      }
    }

    return parts;
  };

  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  const renderedElements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        inCodeBlock = false;
        const codeLang = trimmed.slice(3) || 'javascript';
        renderedElements.push(
          <pre key={`code-${index}`} className="my-5 p-4 bg-stone-900 border border-stone-800 rounded-lg overflow-x-auto text-[13px] font-mono text-stone-100 shadow-sm">
            <code className={`language-${codeLang}`}>
              {codeBlockLines.join('\n')}
            </code>
          </pre>
        );
        codeBlockLines = [];
      } else {
        // Start code block
        inCodeBlock = true;
      }
    } else {
      if (inCodeBlock) {
        codeBlockLines.push(line);
      } else {
        const el = renderLine(line, index);
        if (el) renderedElements.push(el);
      }
    }
  });

  return (
    <div className="max-w-none text-stone-700">
      {renderedElements}
    </div>
  );
}
