import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import {
    Mail, Twitter, Linkedin, Instagram,
    FileText, Code, ShoppingBag, Megaphone
} from 'lucide-react';

const Templates = () => {
    const navigate = useNavigate();

    const templates = [
        {
            title: "Blog Post",
            description: "SEO-optimized articles for your blog.",
            icon: FileText,
            color: "text-blue-400",
            prompt: "Write a comprehensive blog post about...",
            type: "Blog Post",
            tone: "Professional"
        },
        {
            title: "LinkedIn Post",
            description: "Engaging professional updates.",
            icon: Linkedin,
            color: "text-blue-600",
            prompt: "Write a LinkedIn post sharing insights on...",
            type: "Social Media",
            tone: "Professional"
        },
        {
            title: "Tweet Thread",
            description: "Viral-worthy Twitter threads.",
            icon: Twitter,
            color: "text-sky-400",
            prompt: "Create a Twitter thread exlpaining...",
            type: "Tweet",
            tone: "Witty"
        },
        {
            title: "Instagram Caption",
            description: "Catchy captions for your photos.",
            icon: Instagram,
            color: "text-pink-500",
            prompt: "Write an Instagram caption for...",
            type: "Social Media",
            tone: "Casual"
        },
        {
            title: "Cold Email",
            description: "High-converting outreach emails.",
            icon: Mail,
            color: "text-emerald-400",
            prompt: "Write a cold email to potential clients offering...",
            type: "Email",
            tone: "Professional"
        },
        {
            title: "Product Description",
            description: "Compelling copy for e-commerce.",
            icon: ShoppingBag,
            color: "text-orange-400",
            prompt: "Write a product description for...",
            type: "Product Description",
            tone: "Excited"
        },
        {
            title: "Ad Copy",
            description: "Facebook & Google ad variations.",
            icon: Megaphone,
            color: "text-purple-400",
            prompt: "Write 3 ad headlines/copy for...",
            type: "Ad Copy",
            tone: "Dramatic"
        },
        {
            title: "Code Snippet",
            description: "Generate functions or components.",
            icon: Code,
            color: "text-slate-300",
            prompt: "Write a Javascript function to...",
            type: "Code Snippet",
            tone: "Professional"
        }
    ];

    const handleSelect = (template) => {
        navigate('/', {
            state: {
                prompt: template.prompt,
                type: template.type,
                tone: template.tone
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold text-white">Templates</h2>
                <p className="text-slate-400">Jumpstart your creation process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map((t, idx) => (
                    <Card
                        key={idx}
                        hoverEffect={true}
                        className="cursor-pointer group border-white/5 bg-white/5 hover:bg-white/10"
                        onClick={() => handleSelect(t)}
                    >
                        <div className="flex flex-col gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 w-fit ${t.color}`}>
                                <t.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-brand-cyan transition-colors">
                                    {t.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {t.description}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary" className="text-[10px]">{t.type}</Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Templates;
