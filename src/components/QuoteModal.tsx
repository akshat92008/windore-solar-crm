import React, { useState } from 'react';
import { X, User, Phone, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLeads } from '../context/LeadsContext';

export default function QuoteModal() {
    const { isModalOpen, closeModal, addLead } = useLeads();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [bill, setBill] = useState(150);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;
        addLead({ name: name.trim(), phone: phone.trim(), monthlyBill: bill });
        setSubmitted(true);
        setTimeout(() => {
            closeModal();
            setSubmitted(false);
            setName('');
            setPhone('');
            setBill(150);
        }, 2000);
    };

    const savings20yr = Math.round(bill * 12 * 20 * 0.9);
    const pct = ((bill - 50) / (800 - 50)) * 100;

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Top color bar */}
                        <div className="h-2 bg-gradient-to-r from-solar-400 to-solar-600" />

                        <div className="p-8">
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 text-earth-400 hover:text-earth-700 transition-colors p-1 rounded-full hover:bg-earth-100"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <h2 className="text-2xl font-display font-bold text-earth-900 mb-1">
                                            Get Your Free Quote
                                        </h2>
                                        <p className="text-earth-500 text-sm mb-6">
                                            We'll design a custom solar system for your home in under 24 hours.
                                        </p>

                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-earth-700 mb-1.5">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                                                    <input
                                                        type="text"
                                                        required
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                        placeholder="Your full name"
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-earth-200 focus:border-solar-500 focus:outline-none transition-colors text-earth-900 placeholder-earth-400 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="block text-sm font-medium text-earth-700 mb-1.5">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={phone}
                                                        onChange={e => setPhone(e.target.value)}
                                                        placeholder="(555) 000-0000"
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-earth-200 focus:border-solar-500 focus:outline-none transition-colors text-earth-900 placeholder-earth-400 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Bill slider */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <label className="block text-sm font-medium text-earth-700">Monthly Electricity Bill</label>
                                                    <span className="text-solar-600 font-bold text-sm">${bill}/mo</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={50}
                                                    max={800}
                                                    step={10}
                                                    value={bill}
                                                    onChange={e => setBill(Number(e.target.value))}
                                                    style={{ '--range-progress': `${pct}%` } as React.CSSProperties}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-earth-400 mt-1">
                                                    <span>$50</span><span>$800</span>
                                                </div>

                                                {/* Savings preview */}
                                                <div className="mt-3 bg-forest-50 border border-forest-100 rounded-xl p-3 flex items-center gap-3">
                                                    <DollarSign className="w-4 h-4 text-forest-600 flex-shrink-0" />
                                                    <p className="text-xs text-forest-700">
                                                        Est. 20-year savings: <span className="font-bold text-forest-800">${savings20yr.toLocaleString()}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full flex items-center justify-center gap-2 bg-solar-500 hover:bg-solar-600 text-white py-3.5 px-6 rounded-xl font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-solar-500/30 active:scale-100"
                                            >
                                                Send My Free Quote Request
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-8 text-center"
                                    >
                                        <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-9 h-9 text-forest-600" />
                                        </div>
                                        <h2 className="text-2xl font-display font-bold text-earth-900 mb-2">You're all set!</h2>
                                        <p className="text-earth-500 text-sm">Your lead has been added to our CRM. We'll be in touch within 24 hours.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
