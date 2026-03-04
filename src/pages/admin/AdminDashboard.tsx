import React from 'react';
import { ArrowUpRight, Users, Zap, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Leads (This Month)', value: '248', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Proposals Sent', value: '186', change: '+8%', icon: Zap, color: 'bg-solar-500' },
    { label: 'Contracts Signed', value: '42', change: '+24%', icon: CheckCircle, color: 'bg-forest-500' },
    { label: 'Avg. Time to Close', value: '14 Days', change: '-2 Days', icon: Clock, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-earth-900">Dashboard Overview</h1>
        <p className="text-earth-500 mt-1">Welcome back, Alex. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-earth-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-earth-900">Recent Activity</h2>
            <button className="text-sm text-solar-600 font-medium hover:text-solar-700">View All</button>
          </div>
          <div className="space-y-6">
            {[
              { title: 'Contract Signed: The Martinez Family', time: '2 hours ago', type: 'success' },
              { title: 'New Lead: Sarah Jenkins (High Score)', time: '4 hours ago', type: 'info' },
              { title: 'Permit Approved: 1240 Oak St', time: '5 hours ago', type: 'success' },
              { title: 'Proposal Sent: The Chen Residence', time: '1 day ago', type: 'warning' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-forest-500' : 
                  activity.type === 'warning' ? 'bg-solar-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-earth-900">{activity.title}</p>
                  <p className="text-xs text-earth-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-earth-900 rounded-2xl shadow-sm p-6 text-white">
          <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-earth-800 hover:bg-earth-700 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-earth-700 flex justify-between items-center">
              Add New Lead
              <ArrowUpRight className="w-4 h-4 text-earth-400" />
            </button>
            <button className="w-full bg-earth-800 hover:bg-earth-700 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-earth-700 flex justify-between items-center">
              Create Proposal
              <ArrowUpRight className="w-4 h-4 text-earth-400" />
            </button>
            <button className="w-full bg-earth-800 hover:bg-earth-700 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-earth-700 flex justify-between items-center">
              Upload Document
              <ArrowUpRight className="w-4 h-4 text-earth-400" />
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-solar-500 rounded-xl">
            <div className="text-sm font-bold mb-1">Monthly Goal</div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-display font-bold">42/50</span>
              <span className="text-xs text-solar-100 mb-1">Installs</span>
            </div>
            <div className="w-full bg-solar-600 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
