import React, { useMemo } from 'react';
import { ArrowUpRight, Users, Zap, CheckCircle, Clock, Loader2, TrendingUp, DollarSign, Target, Brain, Flame } from 'lucide-react';
import { useLeads } from '../../context/LeadsContext';
import { useProjects } from '../../context/ProjectsContext';

const AVG_DEAL_VALUE = 18000;

export default function AdminDashboard() {
  const { leads, loading, error, openModal } = useLeads();
  const { projects } = useProjects();

  const stats = useMemo(() => {
    const total = leads.length;
    const proposals = leads.filter(l => l.status === 'Proposal Sent').length;
    const contracts = Math.floor(proposals * 0.4);

    return [
      { label: 'Total Leads (All Time)', value: total.toString(), change: '+12%', icon: Users, color: 'bg-blue-500' },
      { label: 'Proposals Sent', value: proposals.toString(), change: '+8%', icon: Zap, color: 'bg-solar-500' },
      { label: 'Contracts Signed (Est)', value: contracts.toString(), change: '+24%', icon: CheckCircle, color: 'bg-forest-500' },
      { label: 'Avg. Time to Close', value: '14 Days', change: '-2 Days', icon: Clock, color: 'bg-purple-500' },
    ];
  }, [leads]);

  const analytics = useMemo(() => {
    const hotLeads = leads.filter(l => l.aiTier === 'Hot');
    const warmLeads = leads.filter(l => l.aiTier === 'Warm');
    const scoredLeads = leads.filter(l => l.aiScore !== undefined);
    const avgAiScore = scoredLeads.length > 0
      ? Math.round(scoredLeads.reduce((sum, l) => sum + (l.aiScore ?? 0), 0) / scoredLeads.length)
      : 0;

    const proposals = leads.filter(l => l.status === 'Proposal Sent').length;
    const estimatedContracts = Math.floor(proposals * 0.4);
    const pipelineValue = proposals * AVG_DEAL_VALUE;
    const projectedRevenue = estimatedContracts * AVG_DEAL_VALUE;

    const activeProjects = projects.filter(p => p.status !== 'completed').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalProjectRevenue = completedProjects * AVG_DEAL_VALUE;

    return { hotLeads, warmLeads, avgAiScore, pipelineValue, projectedRevenue, activeProjects, completedProjects, totalProjectRevenue, scoredLeads };
  }, [leads, projects]);

  const recentActivity = useMemo(() => {
    return leads.slice(0, 4).map(l => ({
      title: `${l.status}: ${l.name} (${l.score} Score)`,
      time: l.date,
      type: l.status === 'Proposal Sent' ? 'warning' : l.status === 'Contacted' ? 'info' : 'success'
    }));
  }, [leads]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-500">
        <Loader2 className="w-8 h-8 animate-spin text-solar-500 mb-4" />
        <p className="text-earth-500 font-medium">Loading live dashboard stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-red-500 font-medium">Error loading stats: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-earth-900">Dashboard Overview</h1>
        <p className="text-earth-500 mt-1">Live AI-scored leads, revenue analytics & pipeline metrics.</p>
      </div>

      {/* Original Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-earth-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl text-white ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center text-forest-600 text-sm font-medium bg-forest-50 px-2.5 py-1 rounded-full">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-earth-900 mb-1">{stat.value}</div>
            <div className="text-sm text-earth-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 💰 Financial Analytics — in the same clean white card style */}
      <div className="bg-white rounded-2xl border border-earth-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-solar-500 text-white">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-earth-900">Financial Analytics</h2>
          <span className="ml-auto text-xs bg-forest-50 text-forest-700 border border-forest-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-pulse inline-block" />
            Live
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pipeline Value */}
          <div className="p-5 rounded-xl border border-earth-100 bg-earth-50/50">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-solar-500/10 text-solar-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-center text-solar-600 text-xs font-medium bg-solar-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Active
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-earth-900">${analytics.pipelineValue.toLocaleString()}</div>
            <div className="text-xs text-earth-500 mt-1">Pipeline Value</div>
            <div className="text-xs text-earth-400 mt-0.5">Proposals × avg. deal</div>
          </div>

          {/* Projected Revenue */}
          <div className="p-5 rounded-xl border border-earth-100 bg-earth-50/50">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-forest-500/10 text-forest-600">
                <Target className="w-4 h-4" />
              </div>
              <div className="flex items-center text-forest-600 text-xs font-medium bg-forest-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Est.
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-earth-900">${analytics.projectedRevenue.toLocaleString()}</div>
            <div className="text-xs text-earth-500 mt-1">Projected Revenue</div>
            <div className="text-xs text-earth-400 mt-0.5">Est. contracts × avg. deal</div>
          </div>

          {/* Closed Revenue */}
          <div className="p-5 rounded-xl border border-earth-100 bg-earth-50/50">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex items-center text-purple-600 text-xs font-medium bg-purple-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Closed
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-earth-900">${analytics.totalProjectRevenue.toLocaleString()}</div>
            <div className="text-xs text-earth-500 mt-1">Closed Revenue</div>
            <div className="text-xs text-earth-400 mt-0.5">{analytics.completedProjects} completed projects</div>
          </div>

          {/* Avg AI Score */}
          <div className="p-5 rounded-xl border border-earth-100 bg-earth-50/50">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                <Brain className="w-4 h-4" />
              </div>
              <div className="flex items-center text-indigo-600 text-xs font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                AI
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-earth-900">
              {analytics.avgAiScore > 0 ? analytics.avgAiScore : '—'}
            </div>
            <div className="text-xs text-earth-500 mt-1">Avg. AI Score</div>
            <div className="text-xs text-earth-400 mt-0.5">
              {analytics.scoredLeads.length > 0 ? `${analytics.scoredLeads.length} leads scored` : 'No leads scored yet'}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 AI Lead Pipeline — also white card style */}
      <div className="bg-white rounded-2xl border border-earth-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-earth-900 text-solar-400">
            <Brain className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-earth-900">AI Lead Pipeline</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hot */}
          <div className="flex items-start gap-4 p-4 rounded-xl border border-red-100 bg-red-50/50">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-500 flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-earth-900">Hot Leads</span>
                <span className="text-2xl font-display font-bold text-red-600">{analytics.hotLeads.length}</span>
              </div>
              <p className="text-xs text-earth-500 mt-0.5">Score 70+ · High priority</p>
              <p className="text-sm font-semibold text-red-700 mt-1">${(analytics.hotLeads.length * AVG_DEAL_VALUE).toLocaleString()} potential</p>
            </div>
          </div>

          {/* Warm */}
          <div className="flex items-start gap-4 p-4 rounded-xl border border-solar-100 bg-solar-50/50">
            <div className="p-2.5 rounded-xl bg-solar-100 text-solar-600 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-earth-900">Warm Leads</span>
                <span className="text-2xl font-display font-bold text-solar-600">{analytics.warmLeads.length}</span>
              </div>
              <p className="text-xs text-earth-500 mt-0.5">Score 40-69 · Nurture</p>
              <p className="text-sm font-semibold text-solar-700 mt-1">${(analytics.warmLeads.length * AVG_DEAL_VALUE).toLocaleString()} potential</p>
            </div>
          </div>

          {/* Unscored */}
          <div className="flex items-start gap-4 p-4 rounded-xl border border-earth-200 bg-earth-50/50">
            <div className="p-2.5 rounded-xl bg-earth-200 text-earth-500 flex-shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-earth-900">Unscored</span>
                <span className="text-2xl font-display font-bold text-earth-600">{leads.filter(l => l.aiScore === undefined).length}</span>
              </div>
              <p className="text-xs text-earth-500 mt-0.5">Go to Leads → Score with AI</p>
              <p className="text-sm font-medium text-earth-500 mt-1">Potential unlocked with scoring</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-earth-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-earth-900">Recent Activity</h2>
            <button className="text-sm text-solar-600 font-medium hover:text-solar-700">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-earth-500">No recent activity found in database.</p>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${activity.type === 'success' ? 'bg-forest-500' :
                      activity.type === 'warning' ? 'bg-solar-500' : 'bg-blue-500'
                    }`} />
                  <div>
                    <p className="text-sm font-medium text-earth-900">{activity.title}</p>
                    <p className="text-xs text-earth-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-earth-900 rounded-2xl shadow-sm p-6 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={openModal} className="w-full bg-earth-800 hover:bg-earth-700 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-earth-700 flex justify-between items-center">
                Add New Lead <ArrowUpRight className="w-4 h-4 text-earth-400" />
              </button>
              <button className="w-full bg-earth-800 hover:bg-earth-700 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-earth-700 flex justify-between items-center">
                Create Proposal <ArrowUpRight className="w-4 h-4 text-earth-400" />
              </button>
              <button className="w-full bg-earth-800 hover:bg-earth-700 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-earth-700 flex justify-between items-center">
                Upload Document <ArrowUpRight className="w-4 h-4 text-earth-400" />
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-solar-500 rounded-xl">
            <div className="text-sm font-bold mb-1">Monthly Goal</div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-display font-bold">{analytics.activeProjects}/50</span>
              <span className="text-xs text-solar-100 mb-1">Active Installs</span>
            </div>
            <div className="w-full bg-solar-600 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((analytics.activeProjects / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
