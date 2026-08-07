import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
    FileText, Linkedin, Twitter, Mail,
    ShoppingBag, Megaphone, Code, MessageSquare,
    Search, ArrowRight, Sparkles, Layers
} from 'lucide-react';

const TEMPLATES = [
    {
        id: 'blog-post',
        title: "Longform Blog & Essay",
        category: "Editorial",
        description: "Comprehensive, structured article with introduction, thesis, key subheadings, and actionable takeaways.",
        icon: FileText,
        type: "Blog Post",
        tone: "Professional",
        defaultPrompt: "Write a comprehensive deep dive on [Topic], breaking down why it matters, the core challenges, and 3 actionable solutions."
    },
    {
        id: 'linkedin-leadership',
        title: "LinkedIn Thought Leadership",
        category: "Social",
        description: "High-impact narrative post with a 2-line hook, spaced body paragraphs, and discussion question.",
        icon: Linkedin,
        type: "LinkedIn Post",
        tone: "Authoritative",
        defaultPrompt: "Share a contrarian lesson learned from [Experience / Challenge], emphasizing what most people get wrong and how to fix it."
    },
    {
        id: 'twitter-thread',
        title: "Viral Twitter / X Thread",
        category: "Social",
        description: "Numbered thread format starting with a high-conversion hook, followed by 5 punchy actionable tweet cards.",
        icon: Twitter,
        type: "Tweet Thread",
        tone: "Dramatic",
        defaultPrompt: "Create a 6-part thread dissecting [Concept / Tool / Framework]. Make each point standalone and punchy."
    },
    {
        id: 'email-newsletter',
        title: "Email Newsletter & Digest",
        category: "Outreach",
        description: "Engaging weekly briefing featuring an editorial summary, curated insights, and clear call-to-action.",
        icon: Mail,
        type: "Email",
        tone: "Engaging",
        defaultPrompt: "Draft an executive weekly newsletter highlighting the top 3 updates in [Industry], followed by a practical tip."
    },
    {
        id: 'cold-email',
        title: "High-Converting Cold Outreach",
        category: "Sales",
        description: "Concise, personalized email focusing on value proposition, proof point, and frictionless low-friction ask.",
        icon: MessageSquare,
        type: "Email",
        tone: "Concise",
        defaultPrompt: "Write a 4-sentence cold email to [Target Role] introducing [Solution], addressing their main pain point directly."
    },
    {
        id: 'product-launch',
        title: "Product Launch Announcement",
        category: "Marketing",
        description: "Feature spotlight detailing problem solved, key capabilities, changelog highlights, and launch link.",
        icon: ShoppingBag,
        type: "Product Description",
        tone: "Professional",
        defaultPrompt: "Announce the release of [Product / Feature v2], focusing on why we built it and the immediate benefit to customers."
    },
    {
        id: 'weekly-update',
        title: "Team & Executive Update",
        category: "Operations",
        description: "Structured async status update with wins, metrics, blockers, and next milestones.",
        icon: Megaphone,
        type: "Blog Post",
        tone: "Concise",
        defaultPrompt: "Draft a weekly progress summary for [Project / Team], outlining 3 key deliverables shipped and next priorities."
    },
    {
        id: 'technical-breakdown',
        title: "Technical Architecture Guide",
        category: "Engineering",
        description: "In-depth engineering explanation with design trade-offs, code considerations, and performance benchmarks.",
        icon: Code,
        type: "Code Snippet",
        tone: "Authoritative",
        defaultPrompt: "Explain the architecture of [System / Technology], comparing the pros and cons against traditional approaches."
    },
];

const Templates = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Editorial', 'Social', 'Outreach', 'Marketing', 'Engineering'];

    const filtered = TEMPLATES.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                              t.description.toLowerCase().includes(search.toLowerCase());
        const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const handleSelectTemplate = (template) => {
        navigate('/', {
            state: {
                prompt: template.defaultPrompt,
                type: template.type,
                tone: template.tone,
                autoGenerate: false
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">
                    Writing Templates
                </h1>
                <p className="text-xs text-[#94A3B8] mt-1">
                    Select a structured format to jumpstart your draft in the studio.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter templates..."
                        className="pl-8 text-xs bg-[#171A21] border-white/[0.08]"
                    />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors ${
                                selectedCategory === cat
                                    ? 'bg-[#1D212A] text-[#F8FAFC] border border-white/[0.08]'
                                    : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-white/[0.03]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clean Notion-Style Template List */}
            <div className="space-y-2">
                {filtered.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => handleSelectTemplate(t)}
                        className="p-3.5 rounded-[6px] bg-[#171A21] border border-white/[0.06] hover:bg-[#1D212A] hover:border-white/[0.12] transition-colors duration-100 cursor-pointer flex items-center justify-between group"
                    >
                        <div className="flex items-start gap-3.5">
                            <div className="w-7 h-7 rounded-[4px] bg-[#1D212A] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] group-hover:text-[#4F8EF7] transition-colors shrink-0 mt-0.5">
                                <t.icon className="w-3.5 h-3.5" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#4F8EF7] transition-colors">
                                        {t.title}
                                    </h3>
                                    <Badge variant="outline" className="text-[10px]">
                                        {t.category}
                                    </Badge>
                                </div>
                                <p className="text-xs text-[#94A3B8] leading-relaxed">
                                    {t.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pl-3">
                            <span className="text-[11px] text-[#64748B] group-hover:text-[#94A3B8] transition-colors hidden sm:inline">
                                Open
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#4F8EF7] group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="p-8 text-center bg-[#171A21] rounded-[6px] border border-white/[0.06]">
                        <p className="text-xs text-[#64748B]">No templates found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Templates;
