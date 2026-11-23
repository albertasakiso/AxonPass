/* ===================================================================
   AXONPASS — Reusable Editorial Markdown Surface
   Used by AI Coach Drawer, rationales, and study notes so Markdown
   always renders with crisp headings, visible lists, tables & code.
   =================================================================== */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { normalizeEditorialMarkdown } from '../../lib/contentNormalizer';

interface EditorialMarkdownProps {
  content: string;
  compact?: boolean;
  className?: string;
}

function CodeBlockWithCopy({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const langMatch = /language-([\w-]+)/.exec(className || '');
  const lang = langMatch ? langMatch[1] : 'code';
  const rawCode = String(children ?? '').replace(/\n$/, '');

  if (!className && !rawCode.includes('\n')) {
    return <code>{children}</code>;
  }

  return (
    <div className="editorial-code-block">
      <div className="editorial-code-header">
        <span>{lang.toUpperCase()}</span>
        <button
          type="button"
          className="btn btn-xs btn-ghost"
          style={{ color: '#CBD5E1', padding: '2px 8px', minHeight: '22px' }}
          onClick={() => {
            navigator.clipboard?.writeText(rawCode).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{rawCode}</code>
      </pre>
    </div>
  );
}

export function EditorialMarkdown({ content, compact = false, className = '' }: EditorialMarkdownProps) {
  const normalized = normalizeEditorialMarkdown(content);

  return (
    <div
      className={`ereader-prose ${compact ? 'editorial-markdown-compact' : ''} ${className}`.trim()}
      style={compact ? { fontSize: 'var(--text-sm)', lineHeight: 1.6 } : undefined}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          table: ({ children }) => (
            <div className="editorial-table-wrap">
              <table>{children}</table>
            </div>
          ),
          code: ({ className: codeClass, children }) => (
            <CodeBlockWithCopy className={codeClass}>{children}</CodeBlockWithCopy>
          ),
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}

export default EditorialMarkdown;
