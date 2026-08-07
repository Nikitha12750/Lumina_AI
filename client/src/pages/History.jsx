import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import {
    Clock, ArrowRight, Copy, Check, FileText,
    Calendar, ArrowUpRight, Search, ChevronRight, CornerDownLeft
} from 'lucide-react';

const History = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [copied, setCopied] = useState(false);

    const historyItems = user?.history || [];

    // Group items chronologically
    const groupHistory = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterday = today - 86400000;
        const lastWeek = today - 86400000 * 7;

        const groups = {
            Today: [],
            Yesterday: [],
            'Last Week': [],
            Older: [],
        };

        historyItems.forEach((item) => {
            if (search && !item.prompt.toLowerCase().includes(search.toLowerCase()) &&
                !item.response.toLowerCase().includes(search.toLowerCase())) {
                return;
            }

            const itemDate = new Date(item.createdAt).getTime();
            if (itemDate >= today) {
                groups.Today.push(item);
            } else if (itemDate >= yesterday) {
                groups.Yesterday.push(item);
            } else if (itemDate >= lastWeek) {
                groups['Last Week'].push(item);
            } else {
                groups.Older.push(item);
            }
        });

        return groups;
    };

    const grouped = groupHistory();
    const hasAnyItems = historyItems.length > 0;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenInStudio = (item) => {
        navigate('/', {
            state: {
                prompt: item.prompt,
                type: item.contentType,
                tone: item.tone
            }
        });
    };

    if (!hasAnyItems) {
        return (
            <div className="max-w-xl mx-auto py-24 text-center space-y-4 animate-in fade-in duration-150">
                <div className="w-10 h-10 rounded-[6px] bg-[#171A21] border border-white/[0.08] flex items-center justify-center mx-auto text-[#64748B]">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-[#F8FAFC]">No drafts saved yet</h3>
                    <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
                        Generations from the Writing Studio will automatically be indexed here chronologically.
                    </p>
                </div>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Open Writing Studio
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">
                        Generation Archive
                    </h1>
                    <p className="text-xs text-[#94A3B8] mt-1">
                        Review, reuse, and export your previous drafts.
                    </p>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search history..."
                        className="pl-8 text-xs bg-[#171A21] border-white/[0.08]"
                    />
                </div>
            </div>

            {/* Main Content Layout: List on Left, Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Chronological List (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                    {Object.entries(grouped).map(([label, items]) => {
                        if (items.length === 0) return null;
                        return (
                            <div key={label} className="space-y-1.5">
                                <p className="text-[10px] font-mono font-medium text-[#64748B] uppercase tracking-wider px-1">
                                    {label}
                                </p>
                                <div className="space-y-1">
                                    {items.map((item, idx) => {
                                        const isSelected = selectedItem === item;
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedItem(item)}
                                                className={`p-3 rounded-[6px] border text-left cursor-pointer transition-colors duration-100 ${
                                                    isSelected
                                                        ? 'bg-[#1D212A] border-[#4F8EF7]/40'
                                                        : 'bg-[#171A21] border-white/[0.06] hover:bg-[#1D212A] hover:border-white/[0.12]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-xs font-medium text-[#F8FAFC] truncate">
                                                        {item.prompt}
                                                    </span>
                                                    <Badge variant="outline" className="text-[9px] shrink-0">
                                                        {item.contentType}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                                                    <span>{item.tone}</span>
                                                    <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Item Full Preview (7 cols) */}
                <div className="lg:col-span-7 bg-[#171A21] border border-white/[0.08] rounded-[8px] p-5 shadow-subtle min-h-[420px]">
                    {selectedItem ? (
                        <div className="space-y-4">
                            {/* Actions Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="accent">{selectedItem.contentType}</Badge>
                                        <span className="text-[11px] text-[#64748B]">{selectedItem.tone}</span>
                                    </div>
                                    <p className="text-xs text-[#94A3B8] line-clamp-1 font-medium mt-1">
                                        {selectedItem.prompt}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleCopy(selectedItem.response)}
                                        className="gap-1.5"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                    </Button>

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleOpenInStudio(selectedItem)}
                                        className="gap-1.5"
                                    >
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                        <span>Open in Studio</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Markdown Preview */}
                            <div className="overflow-y-auto max-h-[480px] pr-2">
                                <MarkdownRenderer content={selectedItem.response} />
                            </div>
                        </div>
                    ) : (
                        <div className="h-[380px] flex flex-col items-center justify-center text-center text-[#64748B]">
                            <FileText className="w-8 h-8 mb-2 stroke-[1.5]" />
                            <p className="text-xs">Select any draft on the left to read and inspect.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
