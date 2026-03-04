import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Project {
    id: string; // The Firestore document ID
    projectId: string; // A readable ID like PRJ-802
    name: string;
    stage: number;
    status: 'on-track' | 'delayed' | 'completed';
    leadId?: string;
    createdAt?: any;
}

interface ProjectsContextType {
    projects: Project[];
    loading: boolean;
    error: string | null;
    addProject: (projectData: Omit<Project, 'id' | 'projectId' | 'createdAt'>) => Promise<void>;
    updateProjectStage: (id: string, stage: number, status?: Project['status']) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projData: Project[] = [];
            snapshot.forEach((docSnap) => {
                projData.push({ id: docSnap.id, ...docSnap.data() } as Project);
            });
            setProjects(projData);
            setLoading(false);
        }, (err) => {
            console.error("Firebase project fetch error:", err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const addProject = useCallback(async (data: Omit<Project, 'id' | 'projectId' | 'createdAt'>) => {
        try {
            const generatedReadableId = `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;
            const newProject = {
                ...data,
                projectId: generatedReadableId,
                createdAt: serverTimestamp(),
            };
            await addDoc(collection(db, 'projects'), newProject);
        } catch (err) {
            console.error("Error adding project:", err);
            setError("Failed to add project");
        }
    }, []);

    const updateProjectStage = useCallback(async (id: string, stage: number, status?: Project['status']) => {
        try {
            const updates: Partial<Project> = { stage };
            if (status) updates.status = status;
            await updateDoc(doc(db, 'projects', id), updates);
        } catch (err) {
            console.error("Error updating project:", err);
            setError("Failed to update project data");
        }
    }, []);

    return (
        <ProjectsContext.Provider value={{ projects, loading, error, addProject, updateProjectStage }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const ctx = useContext(ProjectsContext);
    if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
    return ctx;
}
