import React, { useState, useEffect, useRef } from 'react';
import { Calculator, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLeads } from '../context/LeadsContext';

function useAnimatedNumber(target: number, duration = 800) {
  const [displayed, setDisplayed] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const startValRef = useRef<number>(target);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    startValRef.current = displayed;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(startValRef.current + (target - startValRef.current) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}

export default function ROICalculator() {
  const [bill, setBill] = useState(150);
  const { openModal } = useLeads();

  const savings20Years = Math.round(bill * 12 * 20 * 0.9);
  const monthlyPayment = Math.round(bill * 0.25);
  const pct = ((bill - 50) / (800 - 50)) * 100;

  const animatedSavings = useAnimatedNumber(savings20Years);
  const animatedMonthly = useAnimatedNumber(monthlyPayment);

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-earth-100 p-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-solar-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-forest-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-solar-100 p-2.5 rounded-xl text-solar-600">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-sans font-bold text-xl text-earth-900">ROI Calculator</h3>
        </div>
        <p className="text-earth-500 text-sm mb-6">
          Slide to see your estimated savings in real time.
        </p>

        {/* Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-earth-700">Monthly Electricity Bill</label>
            <div className="flex items-center gap-1 bg-solar-50 border border-solar-200 px-3 py-1 rounded-full">
              <DollarSign className="w-3.5 h-3.5 text-solar-600" />
              <span className="text-solar-700 font-bold text-sm">{bill}/mo</span>
            </div>
          </div>

          <input
            type="range"
            min={50}
            max={800}
            step={10}
            value={bill}
            onChange={e => setBill(Number(e.target.value))}
            style={{ '--range-progress': `${pct}%` } as React.CSSProperties}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-xs text-earth-400">
            <span>$50 / mo</span>
            <span>$800 / mo</span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {/* 20-year savings — hero number */}
          <div className="bg-gradient-to-br from-forest-50 to-earth-50 border border-forest-100 rounded-2xl p-5 text-center">
            <p className="text-forest-700 font-medium text-xs uppercase tracking-wider mb-1">Estimated 20-Year Savings</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={animatedSavings}
                className="text-4xl font-sans font-extrabold text-forest-700 leading-none"
              >
                ${animatedSavings.toLocaleString()}
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-forest-500" />
              <p className="text-forest-600 text-xs">Based on 90% bill reduction</p>
            </div>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-earth-50 rounded-2xl p-4 border border-earth-100">
              <p className="text-earth-500 text-xs mb-0.5">Est. Monthly Payment</p>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-solar-500" />
                <span className="text-earth-900 font-bold text-lg">${animatedMonthly}</span>
              </div>
            </div>
            <div className="bg-earth-50 rounded-2xl p-4 border border-earth-100">
              <p className="text-earth-500 text-xs mb-0.5">Payback Period</p>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-solar-500" />
                <span className="text-earth-900 font-bold text-lg">~7 yrs</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-earth-900 hover:bg-earth-800 text-white py-3.5 px-8 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-earth-900/20 active:scale-100"
        >
          Get My Free Exact Quote
        </button>
      </div>
    </div>
  );
}
