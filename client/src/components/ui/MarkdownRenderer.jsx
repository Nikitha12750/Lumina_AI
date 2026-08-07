import React from 'react';

/**
 * A lightweight, dependency-free, Notion/Claude-style Markdown Renderer
 */
export const MarkdownRenderer = ({ content, className = '' }) => {
    if (!content) return null;

    // Parse markdown lines
    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let codeLanguage = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code block toggle
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <pre key={`code-${i}`} className="bg-[#171A21] border border-white/10 rounded-md p-3.5 my-3 overflow-x-auto text-xs font-mono text-[#E2E8F0] leading-relaxed">
                        <code>{codeBuffer.join('\n')}</code>
                    </pre>
                );
                codeBuffer = [];
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
                codeLanguage = line.trim().slice(3);
            }
            continue;
        }

        if (inCodeBlock) {
            codeBuffer.push(line);
            continue;
        }

        // Horizontal Rule
        if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
            elements.push(<hr key={`hr-${i}`} className="border-white/10 my-4" />);
            continue;
        }

        // H1 Heading
        if (line.startsWith('# ')) {
            elements.push(
                <h1 key={`h1-${i}`} className="text-xl font-semibold text-white tracking-tight mt-5 mb-2.5">
                    {parseInline(line.substring(2))}
                </h1>
            );
            continue;
        }

        // H2 Heading
        if (line.startsWith('## ')) {
            elements.push(
                <h2 key={`h2-${i}`} className="text-base font-semibold text-white tracking-tight mt-4 mb-2">
                    {parseInline(line.substring(3))}
                </h2>
            );
            continue;
        }

        // H3 Heading
        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={`h3-${i}`} className="text-sm font-semibold text-[#E2E8F0] mt-3.5 mb-1.5">
                    {parseInline(line.substring(4))}
                </h3>
            );
            continue;
        }

        // Blockquote
        if (line.startsWith('> ')) {
            elements.push(
                <blockquote key={`bq-${i}`} className="border-l-2 border-[#4F8EF7] pl-3 py-1 my-2 bg-[#4F8EF7]/5 rounded-r text-sm text-[#94A3B8] italic leading-relaxed">
                    {parseInline(line.substring(2))}
                </blockquote>
            );
            continue;
        }

        // Unordered List Bullet
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const trimmed = line.trim();
            elements.push(
                <div key={`li-${i}`} className="flex items-start gap-2.5 my-1 text-sm text-[#CBD5E1] leading-relaxed pl-1">
                    <span className="text-[#4F8EF7] mt-1 text-xs select-none">•</span>
                    <span>{parseInline(trimmed.substring(2))}</span>
                </div>
            );
            continue;
        }

        // Numbered List
        const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
            elements.push(
                <div key={`num-${i}`} className="flex items-start gap-2.5 my-1 text-sm text-[#CBD5E1] leading-relaxed pl-1">
                    <span className="text-[#64748B] font-mono text-xs mt-0.5 select-none w-4 text-right">{numMatch[1]}.</span>
                    <span>{parseInline(numMatch[2])}</span>
                </div>
            );
            continue;
        }

        // Empty line spacer
        if (line.trim() === '') {
            elements.push(<div key={`space-${i}`} className="h-2" />);
            continue;
        }

        // Regular Paragraph
        elements.push(
            <p key={`p-${i}`} className="text-sm text-[#CBD5E1] leading-relaxed my-1.5">
                {parseInline(line)}
            </p>
        );
    }

    return (
        <div className={`prose-editor select-text ${className}`}>
            {elements}
        </div>
    );
};

/**
 * Parses bold (**text**), italic (*text*), inline code (`code`)
 */
function parseInline(text) {
    if (!text) return '';

    // Split by inline markdown tokens
    const parts = [];
    let current = text;
    let keyIdx = 0;

    while (current.length > 0) {
        // Inline code: `code`
        const codeMatch = current.match(/`([^`]+)`/);
        // Bold: **text**
        const boldMatch = current.match(/\*\*([^*]+)\*\*/);
        // Italic: *text*
        const italicMatch = current.match(/(?<!\*)\*([^*]+)\*(?!\*)/);

        // Find earliest match
        const matches = [
            codeMatch ? { type: 'code', index: codeMatch.index, raw: codeMatch[0], content: codeMatch[1] } : null,
            boldMatch ? { type: 'bold', index: boldMatch.index, raw: boldMatch[0], content: boldMatch[1] } : null,
            italicMatch ? { type: 'italic', index: italicMatch.index, raw: italicMatch[0], content: italicMatch[1] } : null,
        ].filter(Boolean).sort((a, b) => a.index - b.index);

        if (matches.length === 0) {
            parts.push(current);
            break;
        }

        const match = matches[0];
        if (match.index > 0) {
            parts.push(current.substring(0, match.index));
        }

        if (match.type === 'code') {
            parts.push(
                <code key={`code-${keyIdx++}`} className="bg-[#1D212A] text-[#E2E8F0] px-1.5 py-0.5 rounded text-xs font-mono border border-white/10">
                    {match.content}
                </code>
            );
        } else if (match.type === 'bold') {
            parts.push(
                <strong key={`bold-${keyIdx++}`} className="font-semibold text-white">
                    {match.content}
                </strong>
            );
        } else if (match.type === 'italic') {
            parts.push(
                <em key={`italic-${keyIdx++}`} className="italic text-[#E2E8F0]">
                    {match.content}
                </em>
            );
        }

        current = current.substring(match.index + match.raw.length);
    }

    return parts;
}
