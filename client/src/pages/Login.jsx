import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { ArrowRight, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const res = await login(formData);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1115] text-[#F8FAFC] flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                {/* Brand / Logo Header */}
                <div className="text-center space-y-2">
                    <div className="w-8 h-8 rounded-[6px] bg-[#4F8EF7] flex items-center justify-center text-white text-sm font-semibold mx-auto shadow-sm">
                        L
                    </div>
                    <h1 className="text-xl font-semibold text-[#F8FAFC] tracking-tight">
                        Sign in to Lumina
                    </h1>
                    <p className="text-xs text-[#94A3B8]">
                        The professional writing operating system.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#171A21] border border-white/[0.08] rounded-[8px] p-6 shadow-subtle">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-[6px] mb-4 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <Label className="mb-0">Password</Label>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" className="w-full h-9" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-5 text-center text-xs text-[#64748B]">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#4F8EF7] hover:text-[#5B8DEF] font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
