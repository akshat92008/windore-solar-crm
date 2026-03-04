import React from 'react';
import { FileText, UploadCloud, Search, MoreVertical, FileImage, File } from 'lucide-react';

const documents = [
  { id: 1, name: 'Martinez_Utility_Bill_Oct.pdf', type: 'pdf', size: '2.4 MB', date: 'Oct 24, 2023', project: 'The Martinez Family' },
  { id: 2, name: 'Interconnection_Agreement_Signed.pdf', type: 'pdf', size: '5.1 MB', date: 'Oct 23, 2023', project: 'Sarah Jenkins' },
  { id: 3, name: 'Site_Survey_Photos.zip', type: 'zip', size: '42.8 MB', date: 'Oct 21, 2023', project: 'David Smith' },
  { id: 4, name: 'Roof_Layout_Draft_v2.png', type: 'image', size: '1.2 MB', date: 'Oct 20, 2023', project: 'Emma Wilson' },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-earth-900">Document Vault</h1>
          <p className="text-earth-500 mt-1">Secure storage for utility bills and agreements.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-earth-900 text-white rounded-xl text-sm font-medium hover:bg-earth-800 transition-colors shadow-sm">
          <UploadCloud className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-earth-200 shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search documents by name or project..." 
            className="w-full pl-10 pr-4 py-2 bg-earth-50 border border-earth-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-solar-500 focus:border-transparent"
          />
        </div>
        <select className="bg-earth-50 border border-earth-200 rounded-xl px-4 py-2 text-sm text-earth-700 focus:outline-none focus:ring-2 focus:ring-solar-500">
          <option>All Types</option>
          <option>PDFs</option>
          <option>Images</option>
          <option>Archives</option>
        </select>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-5 rounded-2xl border border-earth-200 shadow-sm hover:border-solar-300 transition-colors group cursor-pointer flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                doc.type === 'pdf' ? 'bg-red-50 text-red-500' :
                doc.type === 'image' ? 'bg-blue-50 text-blue-500' :
                'bg-yellow-50 text-yellow-600'
              }`}>
                {doc.type === 'pdf' ? <FileText className="w-6 h-6" /> :
                 doc.type === 'image' ? <FileImage className="w-6 h-6" /> :
                 <File className="w-6 h-6" />}
              </div>
              <button className="text-earth-400 hover:text-earth-900 p-1 rounded-md hover:bg-earth-100 opacity-0 group-hover:opacity-100 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
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
    </div>
  );
}
