import React, { useState, useMemo } from 'react';
import { FileText, Search, FileImage, File, Loader2, Trash2, Download } from 'lucide-react';
import { useDocuments } from '../../context/DocumentsContext';

export default function DocumentsPage() {
  const { documents, loading, error, deleteDocument } = useDocuments();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.project.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === 'All Types') return matchSearch;
      if (filterType === 'PDFs') return matchSearch && doc.type === 'pdf';
      if (filterType === 'Images') return matchSearch && doc.type === 'image';
      if (filterType === 'Archives') return matchSearch && doc.type === 'zip';
      return matchSearch;
    });
  }, [documents, searchTerm, filterType]);

  const handleDelete = async (e: React.MouseEvent, id: string, storageName: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document from Firebase Storage? This cannot be undone.")) {
      await deleteDocument(id, storageName);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-earth-900">Document Vault</h1>
          <p className="text-earth-500 mt-1">Secure storage view of utility bills and agreements.</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-earth-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by name or project tag..."
            className="w-full pl-10 pr-4 py-2 bg-earth-50 border border-earth-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-solar-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-earth-50 border border-earth-200 rounded-xl px-4 py-2 text-sm text-earth-700 focus:outline-none focus:ring-2 focus:ring-solar-500"
        >
          <option>All Types</option>
          <option>PDFs</option>
          <option>Images</option>
          <option>Archives</option>
        </select>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-solar-500 mb-4" />
          <p className="text-earth-500">Loading documents from secure Firebase vault...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-earth-200 border-dashed">
          <p className="text-earth-500 font-medium">No documents found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} onClick={() => window.open(doc.url, "_blank")} className="bg-white p-5 rounded-2xl border border-earth-200 shadow-sm hover:border-solar-300 transition-colors group cursor-pointer flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' :
                    doc.type === 'image' ? 'bg-blue-50 text-blue-500' :
                      'bg-yellow-50 text-yellow-600'
                  }`}>
                  {doc.type === 'pdf' ? <FileText className="w-6 h-6" /> :
                    doc.type === 'image' ? <FileImage className="w-6 h-6" /> :
                      <File className="w-6 h-6" />}
                </div>

                {/* Actions that appear on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <a href={doc.url} download onClick={e => e.stopPropagation()} className="text-earth-400 hover:text-solar-600 p-1 rounded-md hover:bg-earth-100 transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </a>
                  <button onClick={(e) => handleDelete(e, doc.id, (doc as any).storageName)} className="text-earth-400 hover:text-red-600 p-1 rounded-md hover:bg-earth-100 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-earth-900 mb-1 line-clamp-2" title={doc.name}>{doc.name}</h3>
                <p className="text-xs text-earth-500 mb-3">{doc.project}</p>
              </div>

              <div className="flex justify-between items-center text-xs text-earth-400 pt-3 border-t border-earth-100">
                <span>{doc.size}</span>
                <span>{doc.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
