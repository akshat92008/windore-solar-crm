import React from 'react';
import { MoreHorizontal, Filter, Download, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const leadsData = [
  { id: 'L-1042', name: 'Sarah Jenkins', address: '1240 Oak St, CA', bill: '$280', score: 'High', status: 'New', date: 'Oct 24, 2023' },
  { id: 'L-1041', name: 'Michael Chang', address: '88 Pine Ave, CA', bill: '$150', score: 'Medium', status: 'Contacted', date: 'Oct 23, 2023' },
  { id: 'L-1040', name: 'The Martinez Family', address: '450 West Blvd, CA', bill: '$320', score: 'High', status: 'Proposal Sent', date: 'Oct 22, 2023' },
  { id: 'L-1039', name: 'David Smith', address: '12 North Rd, CA', bill: '$95', score: 'Low', status: 'New', date: 'Oct 22, 2023' },
  { id: 'L-1038', name: 'Emma Wilson', address: '77 East Dr, CA', bill: '$210', score: 'High', status: 'Meeting Set', date: 'Oct 21, 2023' },
];

export default function LeadsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-earth-900">Lead Management</h1>
          <p className="text-earth-500 mt-1">AI-scored leads based on roof size and sun exposure.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-earth-900 text-white rounded-xl text-sm font-medium hover:bg-earth-800 transition-colors shadow-sm">
            Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-earth-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earth-50 border-b border-earth-200">
                <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Lead Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Est. Bill</th>
                <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-solar-500" />
                    AI Score
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {leadsData.map((lead) => (
                <tr key={lead.id} className="hover:bg-earth-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="font-medium text-earth-900">{lead.name}</div>
                    <div className="text-sm text-earth-500">{lead.address}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-earth-700">{lead.bill}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      lead.score === 'High' ? "bg-forest-50 text-forest-700 border-forest-200" :
                      lead.score === 'Medium' ? "bg-solar-50 text-solar-700 border-solar-200" :
                      "bg-earth-100 text-earth-700 border-earth-200"
                    )}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-earth-500">{lead.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-earth-400 hover:text-earth-900 p-1 rounded-md hover:bg-earth-100 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-earth-200 flex items-center justify-between text-sm text-earth-500">
          <div>Showing 1 to 5 of 248 entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-earth-200 rounded-md hover:bg-earth-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-earth-200 rounded-md hover:bg-earth-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
