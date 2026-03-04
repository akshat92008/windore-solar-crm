import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type KanbanColumn = 'New Lead' | 'Contacted' | 'Proposal Sent';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  monthlyBill: number;
  status: KanbanColumn;
  date: string;
  score: 'High' | 'Medium' | 'Low';
}

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'score' | 'status'>) => void;
  moveLead: (id: string, newStatus: KanbanColumn) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const LeadsContext = createContext<LeadsContextType | null>(null);

const STORAGE_KEY = 'windore_leads';

function scoreFromBill(bill: number): Lead['score'] {
  if (bill >= 200) return 'High';
  if (bill >= 100) return 'Medium';
  return 'Low';
}

const defaultLeads: Lead[] = [
  {
    id: 'L-1042',
    name: 'Sarah Jenkins',
    phone: '(555) 201-4455',
    monthlyBill: 280,
    score: 'High',
    status: 'New Lead',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  },
  {
    id: 'L-1041',
    name: 'Michael Chang',
    phone: '(555) 334-7788',
    monthlyBill: 150,
    score: 'Medium',
    status: 'Contacted',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  },
  {
    id: 'L-1040',
    name: 'The Martinez Family',
    phone: '(555) 892-1234',
    monthlyBill: 320,
    score: 'High',
    status: 'Proposal Sent',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  },
];

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultLeads;
    } catch {
      return defaultLeads;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const addLead = useCallback((data: Omit<Lead, 'id' | 'date' | 'score' | 'status'>) => {
    const newLead: Lead = {
      id: `L-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      monthlyBill: data.monthlyBill,
      score: scoreFromBill(data.monthlyBill),
      status: 'New Lead',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };
    setLeads(prev => [newLead, ...prev]);
  }, []);

  const moveLead = useCallback((id: string, newStatus: KanbanColumn) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <LeadsContext.Provider value={{ leads, addLead, moveLead, isModalOpen, openModal, closeModal }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}
