import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { scoreLeadWithAI, LeadAIResult } from '../lib/ai';

export type KanbanColumn = 'New Lead' | 'Contacted' | 'Proposal Sent';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  monthlyBill: number;
  status: KanbanColumn;
  date: string;
  score: 'High' | 'Medium' | 'Low';
  aiScore?: number;
  aiTier?: 'Hot' | 'Warm' | 'Cold';
  aiReasoning?: string;
  aiRecommendedAction?: string;
  createdAt?: any;
}

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;       // Firestore data errors only
  aiError: string | null;     // AI scoring errors — shown as non-blocking toasts
  clearAiError: () => void;
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'score' | 'status' | 'createdAt'>) => Promise<void>;
  moveLead: (id: string, newStatus: KanbanColumn) => Promise<void>;
  scoreLead: (id: string) => Promise<void>;
  scoringLeadId: string | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const LeadsContext = createContext<LeadsContextType | null>(null);

function scoreFromBill(bill: number): Lead['score'] {
  if (bill >= 200) return 'High';
  if (bill >= 100) return 'Medium';
  return 'Low';
}

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoringLeadId, setScoringLeadId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData: Lead[] = [];
      snapshot.forEach((docSnap) => {
        leadsData.push({ id: docSnap.id, ...docSnap.data() } as Lead);
      });
      setLeads(leadsData);
      setLoading(false);
    }, (err) => {
      console.error("Firebase fetch error:", err);
      setError("Failed to load leads from database.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addLead = useCallback(async (data: Omit<Lead, 'id' | 'date' | 'score' | 'status' | 'createdAt'>) => {
    try {
      const newLead = {
        name: data.name,
        phone: data.phone,
        monthlyBill: data.monthlyBill,
        score: scoreFromBill(data.monthlyBill),
        status: 'New Lead',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'leads'), newLead);
    } catch (err) {
      console.error("Error adding lead:", err);
      setError("Failed to add lead");
    }
  }, []);

  const moveLead = useCallback(async (id: string, newStatus: KanbanColumn) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status: newStatus });
    } catch (err) {
      console.error("Error moving lead:", err);
      setError("Failed to update lead status");
    }
  }, []);

  const scoreLead = useCallback(async (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead || scoringLeadId) return;

    setScoringLeadId(id);
    setAiError(null); // clear any previous AI error
    try {
      const result: LeadAIResult = await scoreLeadWithAI(lead.name, lead.monthlyBill, lead.status);
      await updateDoc(doc(db, 'leads', id), {
        aiScore: result.score,
        aiTier: result.tier,
        aiReasoning: result.reasoning,
        aiRecommendedAction: result.recommendedAction,
      });
    } catch (err) {
      console.error("Error scoring lead with AI:", err);
      // Use aiError (separate state) so it never blocks the leads table
      setAiError("AI scoring failed. Check your API key or try again.");
    } finally {
      setScoringLeadId(null);
    }
  }, [leads, scoringLeadId]);

  const clearAiError = useCallback(() => setAiError(null), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <LeadsContext.Provider value={{
      leads, loading, error, aiError, clearAiError,
      addLead, moveLead, scoreLead, scoringLeadId,
      isModalOpen, openModal, closeModal
    }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}
