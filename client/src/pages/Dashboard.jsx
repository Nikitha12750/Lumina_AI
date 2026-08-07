import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import {
    PenTool, Copy, Check, RefreshCw, Download, FileText, ArrowRight,
    Sparkles, CornerDownLeft, Maximize2, Edit3, Eye, Clock, Hash,
    Sliders, BookOpen, Layers, ArrowLeft
} from 'lucide-react';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Textarea, Label, Select, Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';

const CONTENT_TYPES = [
    { label: 'Blog Post & Essay', value: 'Blog Post' },
    { label: 'LinkedIn Article', value: 'LinkedIn Post' },
    { label: 'Twitter / X Thread', value: 'Tweet Thread' },
    { label: 'Email Newsletter', value: 'Email' },
    { label: 'Product Launch Copy', value: 'Product Description' },
    { label: 'Technical Deep Dive', value: 'Code Snippet' },
    { label: 'Executive Brief', value: 'Ad Copy' },
];

const TONE_PRESETS = [
    { label: 'Authoritative & Sharp', value: 'Authoritative' },
    { label: 'Clear & Concise', value: 'Concise' },
    { label: 'Thought Leadership', value: 'Professional' },
    { label: 'Engaging Storyteller', value: 'Engaging' },
    { label: 'Provocative & Growth', value: 'Dramatic' },
    { label: 'Casual & Direct', value: 'Casual' },
];

const QUICK_STARTERS = [
    { title: 'SaaS Launch Announcement', prompt: 'Announcing the v2.0 release of our developer productivity platform with 10x faster indexing and team collaboration.', type: 'Blog Post', tone: 'Professional' },
    { title: 'Lessons from 0 to 10k Users', prompt: '5 counterintuitive lessons learned scaling a bootstrapped software business to the first 10,000 active users.', type: 'LinkedIn Post', tone: 'Authoritative' },
    { title: 'Technical Architecture Breakdown', prompt: 'Why we migrated our core pipeline from a monolith to distributed event streams and how we handled zero-downtime.', type: 'Blog Post', tone: 'Concise' },
    { title: 'Weekly Executive Newsletter', prompt: 'Curated breakdown of this week’s top shifts in AI engineering, developer tools, and operational efficiency.', type: 'Email', tone: 'Engaging' },
];

const Dashboard = () => {
    const { user, checkUserLoggedIn } = useAuth();
    const location = useLocation();

    // Input States
    const [prompt, setPrompt] = useState('');
    const [contentType, setContentType] = useState('Blog Post');
    const [tone, setTone] = useState('Professional');
    const [audience, setAudience] = useState('Product Leaders & Developers');

    // Execution States
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editableText, setEditableText] = useState('');
    const [copied, setCopied] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const textareaRef = useRef(null);

    // Prefill from Templates / Navigation
    useEffect(() => {
        if (location.state) {
            if (location.state.prompt) setPrompt(location.state.prompt);
            if (location.state.type) setContentType(location.state.type);
            if (location.state.tone) setTone(location.state.tone);
            if (location.state.autoGenerate) {
                // Focus textarea
                setTimeout(() => textareaRef.current?.focus(), 100);
            }
        }
    }, [location.state]);

    // Calculate document statistics
    const wordCount = (isEditing ? editableText : result) ? (isEditing ? editableText : result).trim().split(/\s+/).filter(Boolean).length : 0;
    const charCount = (isEditing ? editableText : result)?.length || 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Get time-appropriate greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Main Generation Handler
    const handleGenerate = async (overridePrompt, overrideTone) => {
        const activePrompt = overridePrompt || prompt;
        const activeTone = overrideTone || tone;

        if (!activePrompt.trim()) return;
        if (user?.credits <= 0) {
            setErrorMsg('Insufficient credits. Please contact support or upgrade.');
            return;
        }

        setErrorMsg('');
        setLoading(true);

        try {
            const res = await api.post('/api/generate', {
                prompt: activePrompt,
                contentType,
                tone: activeTone
            });

            const generatedContent = res.data.response;
            setResult(generatedContent);
            setEditableText(generatedContent);
            setHasGenerated(true);
            await checkUserLoggedIn(); // Update credit count in state
        } catch (err) {
            console.error('Generation Error:', err);
            setErrorMsg(err.response?.data?.msg || 'Generation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Quick Refinement Action (e.g. "Make punchier", "Expand")
    const handleQuickRefine = (instruction) => {
        const refinementPrompt = `Original Draft:\n"""${result}"""\n\nInstruction: Please refine and rewrite the draft above following this directive: "${instruction}". Keep the core message but optimize accordingly.`;
        handleGenerate(refinementPrompt, tone);
    };

    // Copy to clipboard
    const handleCopy = () => {
        const textToCopy = isEditing ? editableText : result;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Export as Markdown file
    const handleExport = (extension = 'md') => {
        const textToExport = isEditing ? editableText : result;
        const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const cleanTitle = prompt.slice(0, 24).replace(/[^a-zA-Z0-9]/g, '_') || 'lumina_draft';
        link.href = url;
        link.download = `${cleanTitle}.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Reset back to centered input canvas
    const handleNewDraft = () => {
        setHasGenerated(false);
        setResult('');
        setEditableText('');
        setPrompt('');
        setIsEditing(false);
        setTimeout(() => textareaRef.current?.focus(), 50);
    };

    // Keyboard shortcut handler (⌘ + Enter)
    const handleKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleGenerate();
        }
    };

    // =========================================================================
    // VIEW 1: BEFORE GENERATION — Large Centered Focus Workspace
    // =========================================================================
    if (!hasGenerated && !loading) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-150">
                {/* Header Greeting */}
                <div className="mb-8">
                    <p className="text-xs font-mono text-[#64748B] uppercase tracking-wider mb-1.5">
                        {getGreeting()}, {user?.username || 'Writer'}
                    </p>
                    <h1 className="text-2xl font-semibold text-[#F8FAFC] tracking-tight">
                        What would you like to create today?
                    </h1>
                </div>

                {/* Main Writing Console */}
                <div className="bg-[#171A21] border border-white/[0.08] rounded-[8px] p-5 shadow-subtle mb-6">
                    <Label className="text-xs text-[#94A3B8] font-medium flex items-center justify-between mb-2">
                        <span>Campaign Brief & Notes</span>
                        <span className="text-[10px] text-[#64748B] font-mono">
                            {prompt.length} chars
                        </span>
                    </Label>

                    <Textarea
                        ref={textareaRef}
                        rows={6}
                        placeholder="Outline your thesis, paste rough thoughts, meeting notes, or describe the topic you want to draft..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-[#1D212A] border-white/[0.08] text-sm text-[#F8FAFC] leading-relaxed p-3.5 focus:border-[#4F8EF7] mb-4"
                        autoFocus
                    />

                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                        <div>
                            <Label className="text-[11px] text-[#64748B]">Content Type</Label>
                            <Select
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="bg-[#1D212A] border-white/[0.08] text-xs text-[#F8FAFC]"
                            >
                                {CONTENT_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label className="text-[11px] text-[#64748B]">Tone of Voice</Label>
                            <Select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="bg-[#1D212A] border-white/[0.08] text-xs text-[#F8FAFC]"
                            >
                                {TONE_PRESETS.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label className="text-[11px] text-[#64748B]">Target Audience</Label>
                            <Input
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                placeholder="e.g. Founders, Engineers"
                                className="bg-[#1D212A] border-white/[0.08] text-xs text-[#F8FAFC]"
                            />
                        </div>
                    </div>

                    {/* Error Banner if any */}
                    {errorMsg && (
                        <div className="p-3 mb-4 rounded-[6px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            {errorMsg}
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4F8EF7]" />
                            <span>Powered by Gemini 3.6 Flash</span>
                        </div>

                        <Button
                            variant="primary"
                            size="default"
                            onClick={() => handleGenerate()}
                            disabled={!prompt.trim()}
                            className="px-4 gap-2"
                        >
                            <span>Draft Content</span>
                            <CornerDownLeft className="w-3.5 h-3.5 text-white/70" />
                        </Button>
                    </div>
                </div>

                {/* Quick Starter Suggestions */}
                <div className="space-y-2">
                    <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider px-1">
                        Suggested Starters
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {QUICK_STARTERS.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setPrompt(item.prompt);
                                    setContentType(item.type);
                                    setTone(item.tone);
                                }}
                                className="text-left p-3 rounded-[6px] bg-[#171A21] border border-white/[0.06] hover:bg-[#1D212A] hover:border-white/[0.12] transition-colors duration-100 group"
                            >
                                <p className="text-xs font-medium text-[#F8FAFC] group-hover:text-[#4F8EF7] transition-colors mb-1">
                                    {item.title}
                                </p>
                                <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
                                    {item.prompt}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 2: LOADING STATE (Minimalist Linear-style spinner)
    // =========================================================================
    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-24 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#4F8EF7]/20 border-t-[#4F8EF7] animate-spin mb-4" />
                <h3 className="text-sm font-medium text-[#F8FAFC] mb-1">
                    Compiling your draft...
                </h3>
                <p className="text-xs text-[#64748B] max-w-sm">
                    Structuring clear arguments, refining tone, and formatting layout.
                </p>
            </div>
        );
    }

    // =========================================================================
    // VIEW 3: AFTER GENERATION — Professional Two-Column Workstation
    // =========================================================================
    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-150">
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNewDraft}
                        className="text-xs text-[#94A3B8] hover:text-white gap-1.5"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>New Draft</span>
                    </Button>
                    <span className="text-xs text-[#64748B]">|</span>
                    <Badge variant="accent">{contentType}</Badge>
                    <Badge variant="outline">{tone}</Badge>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="gap-1.5"
                    >
                        {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                        <span>{isEditing ? 'Preview' : 'Edit'}</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-1.5"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleExport('md')}
                        className="gap-1.5"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export .md</span>
                    </Button>
                </div>
            </div>

            {/* Two-Column Studio Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Context & Refinement Dock (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Prompt Recap Card */}
                    <div className="bg-[#171A21] border border-white/[0.08] rounded-[8px] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">
                                Active Brief
                            </span>
                            <span className="text-[10px] text-[#64748B] font-mono">
                                {prompt.length} chars
                            </span>
                        </div>

                        <p className="text-xs text-[#CBD5E1] line-clamp-4 leading-relaxed bg-[#1D212A] p-2.5 rounded border border-white/[0.06]">
                            {prompt}
                        </p>

                        {/* Document Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center">
                            <div className="bg-[#1D212A] p-2 rounded">
                                <p className="text-[10px] text-[#64748B]">Words</p>
                                <p className="text-xs font-mono font-semibold text-white">{wordCount}</p>
                            </div>
                            <div className="bg-[#1D212A] p-2 rounded">
                                <p className="text-[10px] text-[#64748B]">Chars</p>
                                <p className="text-xs font-mono font-semibold text-white">{charCount}</p>
                            </div>
                            <div className="bg-[#1D212A] p-2 rounded">
                                <p className="text-[10px] text-[#64748B]">Read</p>
                                <p className="text-xs font-mono font-semibold text-white">{readingTime}m</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Refine Directive Buttons */}
                    <div className="bg-[#171A21] border border-white/[0.08] rounded-[8px] p-4 space-y-2.5">
                        <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider block">
                            Quick Refine
                        </span>

                        <div className="space-y-1.5">
                            <button
                                onClick={() => handleQuickRefine('Make this draft more concise, punchy, and cut filler words.')}
                                className="w-full text-left text-xs text-[#94A3B8] hover:text-[#F8FAFC] p-2 rounded bg-[#1D212A] hover:bg-[#242934] border border-white/[0.06] transition-colors flex items-center justify-between"
                            >
                                <span>Make punchier & concise</span>
                                <ArrowRight className="w-3 h-3 text-[#64748B]" />
                            </button>

                            <button
                                onClick={() => handleQuickRefine('Add a stronger opening hook and clear bulleted takeaways at the end.')}
                                className="w-full text-left text-xs text-[#94A3B8] hover:text-[#F8FAFC] p-2 rounded bg-[#1D212A] hover:bg-[#242934] border border-white/[0.06] transition-colors flex items-center justify-between"
                            >
                                <span>Strengthen hook & takeaways</span>
                                <ArrowRight className="w-3 h-3 text-[#64748B]" />
                            </button>

                            <button
                                onClick={() => handleQuickRefine('Rewrite in a more conversational, direct, and relatable tone.')}
                                className="w-full text-left text-xs text-[#94A3B8] hover:text-[#F8FAFC] p-2 rounded bg-[#1D212A] hover:bg-[#242934] border border-white/[0.06] transition-colors flex items-center justify-between"
                            >
                                <span>Shift to conversational tone</span>
                                <ArrowRight className="w-3 h-3 text-[#64748B]" />
                            </button>

                            <button
                                onClick={() => handleGenerate()}
                                className="w-full text-left text-xs text-[#4F8EF7] hover:text-white p-2 rounded bg-[#4F8EF7]/10 hover:bg-[#4F8EF7]/20 border border-[#4F8EF7]/20 transition-colors flex items-center justify-between"
                            >
                                <span>Regenerate fresh variation</span>
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Notion-style Document Canvas (8 cols) */}
                <div className="lg:col-span-8 bg-[#171A21] border border-white/[0.08] rounded-[8px] p-6 shadow-subtle min-h-[500px]">
                    {isEditing ? (
                        <div>
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                                <span className="text-xs font-mono text-[#64748B]">Raw Markdown Editor</span>
                                <span className="text-xs text-[#4F8EF7]">Changes saved in view</span>
                            </div>
                            <Textarea
                                rows={20}
                                value={editableText}
                                onChange={(e) => setEditableText(e.target.value)}
                                className="w-full font-mono text-xs bg-[#1D212A] border-white/[0.08] text-[#F8FAFC] leading-relaxed p-4 h-[440px]"
                            />
                        </div>
                    ) : (
                        <div className="prose-container">
                            <MarkdownRenderer content={editableText || result} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
