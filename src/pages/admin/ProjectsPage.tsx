import React, { useState } from 'react';
import { Check, Clock, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { useProjects } from '../../context/ProjectsContext';

const stages = [
  { id: 1, name: 'Site Survey' },
  { id: 2, name: 'Permit Pending' },
  { id: 3, name: 'Installation' },
  { id: 4, name: 'Inspection' },
];

export default function ProjectsPage() {
  const { projects, loading, error, addProject, updateProjectStage } = useProjects();
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await addProject({
      name: newProjectName.trim(),
      stage: 1,
      status: 'on-track'
    });
    setNewProjectName('');
    setShowAddPrompt(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-500">
        <Loader2 className="w-8 h-8 animate-spin text-solar-500 mb-4" />
        <p className="text-earth-500 font-medium">Loading live projects...</p>
      </div>
    );
  }

  // Handle stage advances (just a simple button on the UI for demo)
  const advanceStage = (id: string, currentStage: number) => {
    if (currentStage < stages.length) {
      updateProjectStage(id, currentStage + 1);
    } else {
      updateProjectStage(id, currentStage, 'completed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-earth-900">Project Tracker</h1>
          <p className="text-earth-500 mt-1">Visual pipeline of active installations.</p>
        </div>
        <button
          onClick={() => setShowAddPrompt(true)}
          className="flex items-center gap-2 px-4 py-2 bg-earth-900 text-white rounded-xl text-sm font-medium hover:bg-earth-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {showAddPrompt && (
        <div className="bg-white p-6 rounded-2xl border border-earth-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-earth-900 mb-4">Create New Project</h3>
          <form onSubmit={handleAddProject} className="flex gap-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="e.g. The Martinez Family Installation"
              className="flex-1 px-4 py-2 bg-earth-50 border border-earth-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-solar-500"
              required
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddPrompt(false)}
                className="px-4 py-2 text-earth-600 hover:bg-earth-100 rounded-xl font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-solar-500 text-white rounded-xl font-medium text-sm hover:bg-solar-600 transition-colors shadow-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-earth-200 border-dashed">
            <p className="text-earth-500 font-medium">No projects exist yet. Create one above.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-2xl border border-earth-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-earth-900">{project.name}</h3>
                  <p className="text-sm text-earth-500">{project.projectId}</p>
                </div>
                <div className="flex items-center gap-2">
                  {project.status === 'on-track' && <span className="flex items-center text-xs font-medium text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full"><Check className="w-3.5 h-3.5 mr-1" /> On Track</span>}
                  {project.status === 'delayed' && <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Delayed</span>}
                  {project.status === 'completed' && <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"><Check className="w-3.5 h-3.5 mr-1" /> Completed</span>}

                  {project.status !== 'completed' && (
                    <button
                      onClick={() => advanceStage(project.id, project.stage)}
                      className="ml-4 text-sm font-medium px-3 py-1.5 bg-earth-100 text-earth-700 hover:bg-earth-200 rounded-lg transition-colors"
                    >
                      Advance Stage
                    </button>
                  )}
                  <button className="text-sm font-medium text-earth-600 hover:text-earth-900 ml-2 border border-earth-200 px-3 py-1.5 rounded-lg hover:bg-earth-50 transition-colors">Details</button>
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
                    const isCompleted = index + 1 < project.stage || project.status === 'completed';
                    const isCurrent = index + 1 === project.stage && project.status !== 'completed';

                    return (
                      <div key={stage.id} className="flex flex-col items-center select-none">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors bg-white ${isCompleted ? 'border-none text-white' :
                            isCurrent ? 'border-solar-500 text-solar-500' :
                              'border-earth-200 text-earth-300'
                          }`}>
                          {/* Inner circle mask to make completed ones solid */}
                          {isCompleted ? (
                            <div className="w-full h-full bg-solar-500 rounded-full flex items-center justify-center border-2 border-white">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            isCurrent ? <Clock className="w-4 h-4" /> : <span className="text-xs font-bold">{stage.id}</span>
                          )}
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
          ))
        )}
      </div>
    </div>
  );
}
