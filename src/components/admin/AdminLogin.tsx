import React, { useState } from 'react';
import { Sun, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
    onLogin: () => void;
}

// Simple password-based admin gate — change this password before giving to client
const ADMIN_PASSWORD = 'windore2024';
const SESSION_KEY = 'windore_admin_authed';

export function useAdminAuth() {
    const [authed, setAuthed] = React.useState(() => {
        try {
            return sessionStorage.getItem(SESSION_KEY) === 'true';
        } catch {
            return false;
        }
    });

    const login = React.useCallback(() => {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setAuthed(true);
    }, []);

    const logout = React.useCallback(() => {
        sessionStorage.removeItem(SESSION_KEY);
        setAuthed(false);
    }, []);

    return { authed, login, logout };
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Simulate brief auth delay
        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                onLogin();
            } else {
                setError('Incorrect password. Please try again.');
                setPassword('');
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center p-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-solar-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-solar-500/20 border border-solar-500/30 rounded-2xl flex items-center justify-center mb-4">
                            <Sun className="w-8 h-8 text-solar-400" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Windore CRM</h1>
                        <p className="text-earth-400 text-sm mt-1">Admin Access Only</p>
                    </div>

                    {/* Lock icon */}
                    <div className="flex items-center gap-2 text-earth-400 text-sm mb-6 justify-center">
                        <Lock className="w-4 h-4" />
                        <span>Secure login required</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-earth-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-earth-500 focus:outline-none focus:border-solar-500/60 focus:ring-1 focus:ring-solar-500/30 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-white transition-colors"
                                >
                                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full bg-solar-500 hover:bg-solar-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-solar-500/30 hover:shadow-solar-500/50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? 'Verifying...' : 'Sign In to CRM'}
                        </button>
                    </form>

                    <p className="text-center text-earth-600 text-xs mt-8">
                        © {new Date().getFullYear()} Windore Solar. Authorized users only.
                    </p>
                </div>
            </div>
        </div>
    );
}
