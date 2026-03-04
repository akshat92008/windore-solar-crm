import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export interface DocumentMeta {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
    date: string;
    project: string; // The display name or projectId it belongs to
    createdAt?: any;
}

interface DocumentsContextType {
    documents: DocumentMeta[];
    loading: boolean;
    error: string | null;
    uploadProgress: number | null;
    uploadDocument: (file: File, project: string) => Promise<void>;
    deleteDocument: (id: string, fileName: string) => Promise<void>;
}

const DocumentsContext = createContext<DocumentsContextType | null>(null);

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
    const [documents, setDocuments] = useState<DocumentMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docData: DocumentMeta[] = [];
            snapshot.forEach((docSnap) => {
                docData.push({ id: docSnap.id, ...docSnap.data() } as DocumentMeta);
            });
            setDocuments(docData);
            setLoading(false);
        }, (err) => {
            console.error("Firebase documents fetch error:", err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const uploadDocument = useCallback(async (file: File, project: string) => {
        if (!file) return;

        // Use a unique filename
        const uniqueFileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `documents/${uniqueFileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploadProgress(0);

        return new Promise<void>((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    setError("Failed to upload document");
                    setUploadProgress(null);
                    reject(error);
                },
                async () => {
                    // Success
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    let docType = 'other';
                    if (file.type.includes('pdf')) docType = 'pdf';
                    else if (file.type.includes('image')) docType = 'image';
                    else if (file.type.includes('zip') || file.type.includes('compressed')) docType = 'zip';

                    const newDocMeta = {
                        name: file.name,
                        storageName: uniqueFileName,
                        type: docType,
                        size: formatBytes(file.size),
                        url: downloadURL,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        project,
                        createdAt: serverTimestamp()
                    };

                    await addDoc(collection(db, 'documents'), newDocMeta);
                    setUploadProgress(null);
                    resolve();
                }
            );
        });
    }, []);

    const deleteDocument = useCallback(async (id: string, storageName: string) => {
        try {
            const storageRef = ref(storage, `documents/${storageName}`);
            await deleteObject(storageRef);
            await deleteDoc(doc(db, 'documents', id));
        } catch (err) {
            console.error("Error deleting document:", err);
            setError("Failed to delete document");
        }
    }, []);

    return (
        <DocumentsContext.Provider value={{ documents, loading, error, uploadProgress, uploadDocument, deleteDocument }}>
            {children}
        </DocumentsContext.Provider>
    );
}

export function useDocuments() {
    const ctx = useContext(DocumentsContext);
    if (!ctx) throw new Error('useDocuments must be used within DocumentsProvider');
    return ctx;
}
