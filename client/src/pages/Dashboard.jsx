import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import {
    Sparkles, Copy, Check, Wand2, Zap,
    Type, AlignLeft, RefreshCw
} from 'lucide-react';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Label, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Loader } from '../components/ui/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, checkUserLoggedIn } = useAuth();
    const location = useLocation();

    // State
    const [prompt, setPrompt] = useState('');
    const [contentType, setContentType] = useState('Blog Post');
    const [tone, setTone] = useState('Professional');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [streamedResult, setStreamedResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Prefill from Templates
    useEffect(() => {
        if (location.state) {
            if (location.state.prompt) setPrompt(location.state.prompt);
            if (location.state.type) setContentType(location.state.type);
            if (location.state.tone) setTone(location.state.tone);
        }
    }, [location.state]);

    // Streaming Effect
    useEffect(() => {
        if (!result) {
            setStreamedResult('');
            return;
        }

        let i = 0;
        setStreamedResult('');
        const interval = setInterval(() => {
            setStreamedResult(prev => prev + result.charAt(i));
            i++;
            if (i >= result.length) clearInterval(interval);
        }, 15); // Speed of typing

        return () => clearInterval(interval);
    }, [result]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt) return;
        if (user?.credits <= 0) return;

        setLoading(true);
        setResult('');
        setStreamedResult('');

        try {
            // Removed 'const token = localStorage.getItem('token');' as api instance handles auth
            const res = await api.post('/generate',
                { prompt, contentType, tone }
            );

            setResult(res.data.response);
            await checkUserLoggedIn(); // Refresh credits
        } catch (err) {
            console.error(err);
            setResult('Error generating content. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const contentTypes = ['Blog Post', 'Tweet', 'Email', 'Product Description', 'Ad Copy', 'Story', 'Code Snippet'];
    const tones = ['Professional', 'Casual', 'Excited', 'Witty', 'Empathetic', 'Dramatic', 'Grumpy'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

            {/* Left Panel: Input */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div>
                    <h2 className="text-3xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                        Create Content
                    </h2>
                    <p className="text-slate-400">Ignite your ideas with AI-powered generation.</p>
                </div>

                <Card className="border-brand-violet/20 bg-black/40 shadow-2xl shadow-brand-violet/5">
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <Label>What should Lumina create?</Label>
                            <textarea
                                className="glass-input w-full min-h-[160px] rounded-lg p-4 resize-none text-base bg-black/40 focus:bg-black/60 transition-colors"
                                placeholder="Describe your topic in detail..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Content Type</Label>
                                <Select value={contentType} onChange={(e) => setContentType(e.target.value)}>
                                    {contentTypes.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tone</Label>
                                <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                                    {tones.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full text-lg h-14 group relative overflow-hidden"
                                disabled={loading || user?.credits <= 0}
                                isLoading={loading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-white to-brand-cyan opacity-20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? 'Igniting AI...' : (
                                        <>
                                            <Sparkles className="w-5 h-5 fill-current" />
                                            Ignite AI
                                        </>
                                    )}
                                </span>
                            </Button>
                            {user?.credits <= 0 && (
                                <p className="text-center text-red-400 text-sm mt-3">
                                    Out of credits! Check back later.
                                </p>
                            )}
                        </div>
                    </form>
                </Card>
            </motion.div>

            {/* Right Panel: Output */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative flex flex-col h-full min-h-[500px]"
            >
                <div className="absolute inset-0 bg-brand-cyan/5 blur-3xl -z-10 rounded-full opacity-20" />

                <h2 className="text-2xl font-heading font-semibold text-slate-200 mb-6 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-brand-cyan" />
                    Lumina's Response
                </h2>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex items-center justify-center glass-panel rounded-2xl border-dashed border-white/20"
                        >
                            <Loader />
                        </motion.div>
                    ) : (result || streamedResult) ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col"
                        >
                            <Card className="flex-1 flex flex-col border-brand-cyan/20 bg-black/40 backdrop-blur-xl relative group">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={copyToClipboard} title="Copy">
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => { setResult(''); setStreamedResult(''); }} title="Clear">
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex-1 overflow-auto custom-scrollbar p-2">
                                    <div className="prose prose-invert max-w-none prose-headings:text-brand-cyan prose-p:text-slate-300 prose-strong:text-white">
                                        <div className="whitespace-pre-wrap font-sans leading-relaxed text-lg">
                                            {streamedResult}
                                            <motion.span
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                                className="inline-block w-2.5 h-6 bg-brand-cyan ml-1 align-middle"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-500 font-mono">
                                    <div className="flex gap-4">
                                        <span>TOKENS: {result.length}</span>
                                        <span>TIME: 0.8s</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-brand-cyan">
                                        <Zap className="w-3 h-3" />
                                        GENERATED
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col items-center justify-center glass-panel rounded-2xl border-dashed border-white/20 text-slate-500"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 opacity-20" />
                            </div>
                            <p>Ready to create something amazing?</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Dashboard;
