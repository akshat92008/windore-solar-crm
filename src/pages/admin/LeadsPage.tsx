import React, { useState } from 'react';
import { MoreHorizontal, Filter, Download, Sparkles, Loader2, Brain, X, TrendingUp, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLeads, Lead } from '../../context/LeadsContext';

function AIScoringPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const tierColors: Record<string, string> = {
    Hot: 'text-red-600 bg-red-50 border-red-200',
    Warm: 'text-solar-700 bg-solar-50 border-solar-200',
    Cold: 'text-blue-700 bg-blue-50 border-blue-200',
  };

  const scoreColor = (score: number) => {
    if (score >= 70) return 'text-forest-600';
    if (score >= 40) return 'text-solar-600';
    return 'text-earth-500';
  };

  const scoreBg = (score: number) => {
    if (score >= 70) return 'bg-forest-500';
    if (score >= 40) return 'bg-solar-400';
    return 'bg-earth-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl border border-earth-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-earth-900 rounded-xl">
              <Brain className="w-5 h-5 text-solar-400" />
            </div>
            <div>
              <h3 className="font-bold text-earth-900 text-lg leading-tight">AI Lead Analysis</h3>
              <p className="text-sm text-earth-500">{lead.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-earth-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-earth-500" />
          </button>
        </div>

        {lead.aiScore !== undefined ? (
          <div className="space-y-4">
            {/* Score Arc */}
            <div className="flex items-center gap-5 p-4 bg-earth-50 rounded-2xl border border-earth-100">
              <div className="relative flex-shrink-0 w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke={lead.aiScore >= 70 ? '#22c55e' : lead.aiScore >= 40 ? '#f97316' : '#94a3b8'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(lead.aiScore / 100) * 201} 201`}
                  />
                </svg>
                <span className={cn("absolute text-xl font-display font-bold", scoreColor(lead.aiScore))}>
                  {lead.aiScore}
                </span>
              </div>
              <div>
                <div className="text-sm text-earth-500 mb-1">Lead Score</div>
                <span className={cn("px-3 py-1 rounded-full text-sm font-bold border", tierColors[lead.aiTier ?? 'Cold'])}>
                  {lead.aiTier} Lead
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div>
              <div className="flex justify-between text-xs text-earth-500 mb-1.5">
                <span>Score</span><span>{lead.aiScore}/100</span>
              </div>
              <div className="w-full bg-earth-100 rounded-full h-2.5">
                <div
                  className={cn("h-2.5 rounded-full transition-all duration-700", scoreBg(lead.aiScore))}
                  style={{ width: `${lead.aiScore}%` }}
                />
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">AI Reasoning</div>
                <p className="text-sm text-blue-900 leading-relaxed">{lead.aiReasoning}</p>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-4 bg-forest-50 rounded-2xl border border-forest-100 flex gap-3">
              <Lightbulb className="w-5 h-5 text-forest-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1">Recommended Action</div>
                <p className="text-sm text-forest-900 leading-relaxed">{lead.aiRecommendedAction}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-earth-400">
            <Brain className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Score not generated yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const { leads, loading, error, aiError, clearAiError, openModal, scoreLead, scoringLeadId } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {selectedLead && (
        <AIScoringPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-earth-900">Lead Management</h1>
          <p className="text-earth-500 mt-1">Live AI-scored leads mapped directly from Firestore.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-earth-900 text-white rounded-xl text-sm font-medium hover:bg-earth-800 transition-colors shadow-sm"
          >
            Add Lead
          </button>
        </div>
      </div>

      {/* AI Error — non-blocking dismissible banner */}
      {aiError && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{aiError}</span>
          <button onClick={clearAiError} className="hover:text-red-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-earth-200 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-solar-500 mb-4" />
            <p className="text-earth-500 font-medium">Loading live leads from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <p className="text-red-500 font-medium">Error loading leads: {error}</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Sparkles className="w-12 h-12 text-earth-200 mb-4" />
            <p className="text-earth-500 font-medium text-lg">No leads yet</p>
            <p className="text-earth-400 text-sm mt-1">Click "Add Lead" or submit a quote from the landing page to see them here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-earth-50 border-b border-earth-200">
                    <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Lead Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Est. Bill</th>
                    <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-solar-500" />
                        Quick Score
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-earth-700" />
                        AI Score
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider text-right">AI Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-100">
                  {leads.map((lead) => {
                    const isScoring = scoringLeadId === lead.id;
                    const tierColors: Record<string, string> = {
                      Hot: 'bg-red-50 text-red-700 border-red-200',
                      Warm: 'bg-solar-50 text-solar-700 border-solar-200',
                      Cold: 'bg-blue-50 text-blue-700 border-blue-200',
                    };
                    return (
                      <tr key={lead.id} className="hover:bg-earth-50/50 transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="font-medium text-earth-900">{lead.name}</div>
                          <div className="text-sm text-earth-500">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-earth-700">${lead.monthlyBill}</td>
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
                          {lead.aiScore !== undefined ? (
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-pointer hover:opacity-80 transition-opacity", tierColors[lead.aiTier ?? 'Cold'])}
                              title="Click to view AI analysis"
                            >
                              <Brain className="w-3 h-3" />
                              {lead.aiScore}/100 · {lead.aiTier}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-earth-400">
                              <MoreHorizontal className="w-3 h-3" />
                              Not scored
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                            lead.status === 'New Lead' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              lead.status === 'Contacted' ? 'bg-solar-50 text-solar-700 border-solar-200' :
                                'bg-forest-50 text-forest-700 border-forest-200'
                          )}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-earth-500">{lead.date}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {lead.aiScore !== undefined && (
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="flex items-center gap-1.5 text-xs font-medium text-earth-600 hover:text-earth-900 px-2.5 py-1.5 rounded-lg hover:bg-earth-100 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                                View
                              </button>
                            )}
                            <button
                              onClick={() => scoreLead(lead.id)}
                              disabled={isScoring || !!scoringLeadId}
                              className={cn(
                                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
                                lead.aiScore !== undefined
                                  ? "text-earth-600 hover:text-earth-900 bg-earth-100 hover:bg-earth-200"
                                  : "text-white bg-earth-900 hover:bg-earth-700 shadow-sm",
                                (isScoring || !!scoringLeadId) && "opacity-60 cursor-not-allowed"
                              )}
                            >
                              {isScoring
                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Scoring...</>
                                : <><Brain className="w-3.5 h-3.5" />{lead.aiScore !== undefined ? 'Re-Score' : 'Score with AI'}</>
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-earth-200 flex items-center justify-between text-sm text-earth-500">
              <div>Showing 1 to {leads.length} of {leads.length} entries</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-earth-200 rounded-md hover:bg-earth-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-earth-200 rounded-md hover:bg-earth-50 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
