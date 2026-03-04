import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Menu, X } from 'lucide-react';
import { useLeads } from '../context/LeadsContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useLeads();

  return (
    <nav className="fixed top-0 z-50 w-full bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-solar-500 p-2 rounded-lg text-white">
              <Sun className="h-6 w-6" />
            </div>
            <span className="font-display font-bold text-2xl text-white tracking-tight">Windore</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#financing" className="text-white/80 hover:text-white font-medium transition-colors">Financing</a>
            <a href="#ecosystem" className="text-white/80 hover:text-white font-medium transition-colors">Ecosystem</a>
            <a href="#proof" className="text-white/80 hover:text-white font-medium transition-colors">Case Studies</a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin" className="text-white/70 hover:text-white font-medium text-sm transition-colors">
              Admin Login
            </Link>
            <button
              onClick={openModal}
              className="bg-solar-500 hover:bg-solar-400 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-solar-500/30 hover:scale-105 hover:shadow-solar-500/50"
            >
              Get Free Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-earth-900/95 backdrop-blur-md border-b border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <a href="#financing" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl">Financing</a>
            <a href="#ecosystem" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl">Ecosystem</a>
            <a href="#proof" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl">Case Studies</a>
            <Link to="/admin" className="block px-3 py-2.5 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl">Admin Login</Link>
            <button
              onClick={() => { setIsMenuOpen(false); openModal(); }}
              className="w-full mt-2 bg-solar-500 text-white px-4 py-3 rounded-xl font-bold text-left"
            >
              Get Free Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
