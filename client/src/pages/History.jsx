import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Copy, Calendar, ArrowUpRight, History as HistoryIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const History = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const runAgain = (item) => {
        navigate('/', {
            state: {
                prompt: item.prompt,
                type: item.contentType,
                tone: item.tone
            }
        });
    };

    if (!user?.history || user.history.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <HistoryIcon className="w-10 h-10 text-slate-500" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white">No history yet</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        Once you start generating content, your history will appear here.
                    </p>
                </div>
                <Button onClick={() => navigate('/')}>
                    Start Creating
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold text-white">History</h2>
                <p className="text-slate-400">View and manage your past generations.</p>
            </div>

            <div className="space-y-4">
                {user.history.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Card className="hover:border-white/20 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="default" className="uppercase tracking-wider text-[10px]">
                                            {item.contentType}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-white line-clamp-1">{item.prompt}</h3>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button size="sm" variant="secondary" onClick={() => copyToClipboard(item.response)}>
                                        <Copy className="w-3 h-3 mr-2" />
                                        Copy
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => runAgain(item)}>
                                        <ArrowUpRight className="w-3 h-3 mr-2" />
                                        Reuse
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-black/20 border border-white/5 font-mono text-sm text-slate-300 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                                {item.response}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default History;
