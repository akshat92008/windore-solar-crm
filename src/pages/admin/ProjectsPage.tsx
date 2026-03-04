import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

const projects = [
  { id: 'PRJ-802', name: 'The Martinez Family', stage: 2, status: 'on-track' },
  { id: 'PRJ-801', name: 'Sarah Jenkins', stage: 1, status: 'delayed' },
  { id: 'PRJ-799', name: 'David Smith', stage: 3, status: 'on-track' },
  { id: 'PRJ-795', name: 'Emma Wilson', stage: 4, status: 'completed' },
];

const stages = [
  { id: 1, name: 'Site Survey' },
  { id: 2, name: 'Permit Pending' },
  { id: 3, name: 'Installation' },
  { id: 4, name: 'Inspection' },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-display font-bold text-earth-900">Project Tracker</h1>
        <p className="text-earth-500 mt-1">Visual pipeline of active installations.</p>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-2xl border border-earth-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-earth-900">{project.name}</h3>
                <p className="text-sm text-earth-500">{project.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {project.status === 'on-track' && <span className="flex items-center text-xs font-medium text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full"><Check className="w-3.5 h-3.5 mr-1" /> On Track</span>}
                {project.status === 'delayed' && <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Delayed</span>}
                {project.status === 'completed' && <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"><Check className="w-3.5 h-3.5 mr-1" /> Completed</span>}
                <button className="ml-4 text-sm font-medium text-earth-600 hover:text-earth-900">View Details</button>
              </div>
            </div>

            {/* Pipeline Visual */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-earth-100 -translate-y-1/2 rounded-full z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-solar-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                style={{ width: `${((project.stage - 1) / (stages.length - 1)) * 100}%` }}
              ></div>
              
              <div className="relative z-10 flex justify-between">
                {stages.map((stage, index) => {
                  const isCompleted = index + 1 < project.stage;
                  const isCurrent = index + 1 === project.stage;
                  
                  return (
                    <div key={stage.id} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${
                        isCompleted ? 'bg-solar-500 border-solar-500 text-white' :
                        isCurrent ? 'bg-white border-solar-500 text-solar-500' :
                        'bg-white border-earth-200 text-earth-300'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : 
                         isCurrent ? <Clock className="w-4 h-4" /> : 
                         <span className="text-xs font-bold">{stage.id}</span>}
                      </div>
                      <span className={`text-xs font-medium ${isCurrent ? 'text-earth-900' : 'text-earth-500'}`}>
                        {stage.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
