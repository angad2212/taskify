import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CreateProjectModal from '@/components/CreateProjectModal';
import { mockProjects, mockTasks } from '@/data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const [showCreateProject, setShowCreateProject] = useState(false);

  const getProjectProgress = (projectId: string) => {
    const projectTasks = mockTasks.filter(task => task.projectId === projectId);
    const reviewedTasks = projectTasks.filter(task => task.status === 'reviewed');
    return projectTasks.length > 0 ? (reviewedTasks.length / projectTasks.length) * 100 : 0;
  };

  const getUserProjectTasks = (projectId: string) => {
    return mockTasks.filter(task => task.projectId === projectId && task.assignedTo === user?.id).length;
  };

  const filteredProjects = user?.role === 'admin' 
    ? mockProjects 
    : mockProjects.filter(project => 
        project.members.some(member => member.id === user?.id)
      );

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              {user?.role === 'admin' ? 'Manage all projects' : 'Your assigned projects'}
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <Button 
              onClick={() => setShowCreateProject(true)}
              className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-[#1e1e1e] border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <CardTitle className="text-white">{project.name}</CardTitle>
                <CardDescription 
                  className="text-gray-400"
                  style={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.role === 'admin' ? (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-gray-400">{Math.round(getProjectProgress(project.id))}%</span>
                        </div>
                        <Progress value={getProjectProgress(project.id)} className="bg-gray-700" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          {project.members.length} members
                        </span>
                        <Button asChild size="sm" className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white">
                          <Link to={`/project/${project.id}`}>Open Project</Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center py-4">
                        <span className="text-2xl font-bold text-[#4ea8de]">
                          {getUserProjectTasks(project.id)}
                        </span>
                        <p className="text-gray-400 text-sm">Tasks assigned</p>
                      </div>
                      <Button asChild className="w-full bg-[#4ea8de] hover:bg-[#3a8bc4] text-white">
                        <Link to={`/project/${project.id}`}>View Tasks</Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {user?.role === 'admin' 
                ? 'No projects yet. Create your first project to get started.' 
                : 'You are not assigned to any projects yet.'}
            </p>
          </div>
        )}
      </div>

      <CreateProjectModal 
        open={showCreateProject} 
        onOpenChange={setShowCreateProject} 
      />
    </div>
  );
};

export default Dashboard;
