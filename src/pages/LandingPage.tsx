import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import ROICalculator from '../components/ROICalculator';
import { ShieldCheck, Battery, Zap, ArrowRight, TrendingDown, PiggyBank, FileText } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useLeads } from '../context/LeadsContext';

// Use a URL object so Vite correctly resolves the video asset without needing type declarations
const droneVideo = new URL('../../Drone_Shot_Of_Solar_Panel_Roof.mp4', import.meta.url).href;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScrollRevealGroup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { openModal } = useLeads();

  return (
    <div className="min-h-screen bg-earth-950 font-sans selection:bg-solar-500/30 selection:text-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[680px] flex items-center overflow-hidden">
        {/* Background video */}
        <video
          src={droneVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        {/* Bottom fade — matches the dark earth-900 section below */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-earth-900 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — headline + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-solar-500/20 text-solar-300 font-medium text-sm mb-6 border border-solar-500/30 backdrop-blur-sm">
                <SunIcon className="w-4 h-4" />
                <span>#1 Rated Residential Solar in California</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-6 tracking-tight">
                Power your home. <br />
                <span className="text-solar-400">Empower your wallet.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-xl">
                Switch to clean, renewable energy with zero down. Lock in your energy rates and protect your family from rising utility costs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <button
                  onClick={openModal}
                  className="group bg-solar-500 hover:bg-solar-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-solar-500/40 hover:shadow-solar-500/60 hover:scale-105 flex items-center gap-2"
                >
                  Get Your Free Design
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <div className="flex -space-x-2">
                    {[11, 12, 13, 14].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="Customer" className="w-9 h-9 rounded-full border-2 border-white/50" referrerPolicy="no-referrer" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="text-solar-300">{'★★★★★'}</div>
                    <span className="text-white/80 font-medium">500+ Happy Homes</span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  { icon: ShieldCheck, label: '25-Year Warranty' },
                  { icon: Zap, label: 'Licensed & Insured' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-white/70 text-sm">
                    <Icon className="w-4 h-4 text-solar-400" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — ROI Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:ml-auto w-full max-w-md"
            >
              <ROICalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINANCING ─────────────────────────────────────── */}
      <section id="financing" className="py-24 bg-earth-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Make the switch with zero friction
            </h2>
            <p className="text-lg text-earth-400">
              We've removed the financial barriers to clean energy. Own your power without the upfront costs.
            </p>
          </ScrollReveal>

          <ScrollRevealGroup className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: PiggyBank,
                color: 'text-solar-400',
                bg: 'bg-solar-500/10',
                border: 'hover:border-solar-500/50',
                title: '$0 Down Financing',
                desc: 'Start saving from day one. Our flexible financing options mean you pay nothing out of pocket to get your system installed.',
              },
              {
                icon: FileText,
                color: 'text-forest-400',
                bg: 'bg-forest-500/10',
                border: 'hover:border-forest-500/50',
                title: '30% Federal Tax Credit',
                desc: 'Take advantage of the ITC. We handle the paperwork to ensure you get the maximum government incentives available.',
              },
              {
                icon: TrendingDown,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'hover:border-blue-500/50',
                title: 'Fixed Energy Rates',
                desc: 'Utility rates rise an average of 4% every year. Lock in your energy costs now and protect yourself from future hikes.',
              },
            ].map(({ icon: Icon, color, bg, border, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 ${border} transition-all hover:shadow-2xl hover:bg-white/10 group`}
              >
                <div className={`w-14 h-14 ${bg} rounded-2xl shadow-inner flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform border border-white/5`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-earth-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ── SMART ECOSYSTEM ───────────────────────────────── */}
      <section id="ecosystem" className="py-24 bg-earth-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                A fully integrated Home Energy System
              </h2>
              <p className="text-earth-300 text-lg mb-10 leading-relaxed">
                Don't just generate power—store it, manage it, and drive with it. Our smart ecosystem works seamlessly together for maximum efficiency.
              </p>

              <ScrollRevealGroup className="space-y-8">
                {[
                  { icon: SunIcon, color: 'text-solar-400', title: 'Premium Solar Panels', desc: 'High-efficiency, sleek black-on-black panels that look beautiful on your roof while generating maximum power.' },
                  { icon: Battery, color: 'text-forest-400', title: 'Smart Battery Storage', desc: 'Keep the lights on during outages and use stored solar power at night or during peak rate hours.' },
                  { icon: Zap, color: 'text-blue-400', title: 'EV Charging Integration', desc: 'Charge your electric vehicle directly from the sun. Fast, efficient, and completely clean.' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <motion.div key={title} variants={fadeUp} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-12 h-12 rounded-full bg-earth-800 flex items-center justify-center ${color} border border-earth-700`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{title}</h4>
                      <p className="text-earth-400">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </ScrollRevealGroup>
            </ScrollReveal>

            <ScrollReveal className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-solar-500/20 to-forest-500/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2058&auto=format&fit=crop"
                alt="Solar battery installation"
                className="relative rounded-3xl shadow-2xl border border-earth-700 object-cover h-[600px] w-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 bg-earth-800/90 backdrop-blur-md p-6 rounded-2xl border border-earth-700 shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-forest-400 animate-pulse" />
                  <span className="text-sm font-medium text-earth-300 uppercase tracking-wider">System Status</span>
                </div>
                <div className="text-2xl font-display font-bold text-white mb-1">Self-Powered</div>
                <div className="text-earth-400 text-sm">Home is running on solar & battery</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ──────────────────────────────────── */}
      <section id="proof" className="py-24 bg-earth-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Real homes. Real savings.
            </h2>
            <p className="text-lg text-earth-400">
              See how Windore is transforming energy bills across your neighborhood.
            </p>
          </ScrollReveal>

          <ScrollRevealGroup className="grid md:grid-cols-2 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop',
                label: 'The Martinez Family',
                system: '5kW System',
                prev: '$245 / mo',
                now: '$15 / mo',
                kwh: '650 kWh',
              },
              {
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
                label: 'The Chen Residence',
                system: '8.2kW + Battery',
                prev: '$380 / mo',
                now: '-$25 / mo',
                kwh: '1,120 kWh',
              },
            ].map(({ img, label, system, prev, now, kwh }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col sm:flex-row hover:bg-white/10 transition-all hover:border-white/20 group"
              >
                <div className="w-full sm:w-2/5 overflow-hidden">
                  <img src={img} alt="House" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8 sm:w-3/5 flex flex-col justify-center">
                  <div className="text-sm font-medium text-solar-400 mb-2">{label}</div>
                  <h3 className="text-2xl font-bold text-white mb-6 font-display">{system}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-earth-400">Previous Bill</span>
                      <span className="font-medium text-earth-500 line-through opacity-60">{prev}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-white font-medium">New Bill</span>
                      <span className="font-bold text-forest-400 text-2xl">{now}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-earth-500 text-sm">Generated Last Month</span>
                      <span className="font-medium text-white bg-white/10 px-3 py-1 rounded-full text-sm border border-white/5">{kwh}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────── */}
      <section className="py-24 bg-solar-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to own your power?</h2>
            <p className="text-xl text-solar-100 mb-10 max-w-2xl mx-auto">
              Get a custom solar design and savings estimate for your home in less than 24 hours. No commitment required.
            </p>
            <button
              onClick={openModal}
              className="bg-earth-900 hover:bg-earth-800 text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              Get Your Free Quote
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-earth-900 text-earth-400 py-12 border-t border-earth-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <SunIcon className="w-6 h-6 text-solar-500" />
            <span className="font-display font-bold text-xl tracking-tight">Windore</span>
          </div>
          <div className="text-sm">© {new Date().getFullYear()} Windore Solar. All rights reserved.</div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
