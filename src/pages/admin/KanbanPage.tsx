import React, { useState, useRef, useCallback } from 'react';
import { KanbanColumn, Lead, useLeads } from '../../context/LeadsContext';
import { DollarSign, Phone, Sparkles, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

const COLUMNS: KanbanColumn[] = ['New Lead', 'Contacted', 'Proposal Sent'];

const colStyles: Record<KanbanColumn, { header: string; badge: string; dot: string }> = {
    'New Lead': { header: 'bg-blue-50 border-blue-200 text-blue-800', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    'Contacted': { header: 'bg-solar-50 border-solar-200 text-solar-800', badge: 'bg-solar-100 text-solar-700', dot: 'bg-solar-500' },
    'Proposal Sent': { header: 'bg-forest-50 border-forest-200 text-forest-800', badge: 'bg-forest-100 text-forest-700', dot: 'bg-forest-500' },
};

const scoreStyles: Record<Lead['score'], string> = {
    High: 'bg-forest-50 text-forest-700 border border-forest-200',
    Medium: 'bg-solar-50 text-solar-700 border border-solar-200',
    Low: 'bg-earth-100 text-earth-600 border border-earth-200',
};

function LeadCard({
    lead,
    onDragStart,
}: {
    key?: React.Key;
    lead: Lead;
    onDragStart: (e: React.DragEvent, id: string) => void;
}) {
    return (
        <div
            draggable
            onDragStart={e => onDragStart(e, lead.id)}
            className="bg-white rounded-2xl border border-earth-200 p-4 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-earth-300 transition-all group select-none"
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="font-semibold text-earth-900 text-sm leading-tight">{lead.name}</div>
                <GripVertical className="w-4 h-4 text-earth-300 group-hover:text-earth-400 flex-shrink-0 mt-0.5 transition-colors" />
            </div>

            <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-earth-500">
                    <Phone className="w-3 h-3" />
                    <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-earth-500">
                    <DollarSign className="w-3 h-3" />
                    <span>${lead.monthlyBill}/mo bill</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-solar-500" />
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', scoreStyles[lead.score])}>
                        {lead.score}
                    </span>
                </div>
                <span className="text-xs text-earth-400">{lead.date}</span>
            </div>
        </div>
    );
}

function KanbanCol({
    column,
    leads,
    onDragStart,
    onDrop,
}: {
    key?: React.Key;
    column: KanbanColumn;
    leads: Lead[];
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDrop: (column: KanbanColumn) => void;
}) {
    const [isOver, setIsOver] = useState(false);
    const styles = colStyles[column];

    return (
        <div
            className="flex flex-col min-w-[280px] w-full"
            onDragOver={e => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={() => { setIsOver(false); onDrop(column); }}
        >
            {/* Column header */}
            <div className={cn('flex items-center justify-between px-4 py-3 rounded-2xl border mb-3', styles.header)}>
                <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', styles.dot)} />
                    <span className="font-semibold text-sm">{column}</span>
                </div>
                <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', styles.badge)}>
                    {leads.length}
                </span>
            </div>

            {/* Drop zone */}
            <div
                className={cn(
                    'flex-1 space-y-3 min-h-[120px] p-2 rounded-2xl transition-all duration-200',
                    isOver ? 'bg-solar-50 border-2 border-dashed border-solar-300' : 'bg-transparent border-2 border-transparent'
                )}
            >
                {leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 text-earth-400 text-sm">
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-earth-300 flex items-center justify-center mb-2">
                            <span className="text-lg leading-none">+</span>
                        </div>
                        Drop card here
                    </div>
                ) : (
                    leads.map(lead => (
                        <LeadCard key={lead.id} lead={lead} onDragStart={onDragStart} />
                    ))
                )}
            </div>
        </div>
    );
}

export default function KanbanBoard() {
    const { leads, moveLead } = useLeads();
    const draggingId = useRef<string | null>(null);

    const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
        draggingId.current = id;
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDrop = useCallback((column: KanbanColumn) => {
        if (draggingId.current) {
            moveLead(draggingId.current, column);
            draggingId.current = null;
        }
    }, [moveLead]);

    const leadsByCol = COLUMNS.reduce<Record<KanbanColumn, Lead[]>>((acc, col) => {
        acc[col] = leads.filter(l => l.status === col);
        return acc;
    }, { 'New Lead': [], 'Contacted': [], 'Proposal Sent': [] });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-display font-bold text-earth-900">Kanban Board</h1>
                <p className="text-earth-500 mt-1">Drag cards to move leads through the pipeline.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {COLUMNS.map(col => (
                    <KanbanCol
                        key={col}
                        column={col}
                        leads={leadsByCol[col]}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
}
