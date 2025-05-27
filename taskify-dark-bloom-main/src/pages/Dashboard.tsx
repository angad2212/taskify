// Dashboard.tsx

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CreateProjectModal from '@/components/CreateProjectModal';
import { mockProjects, mockTasks } from '@/data/mockData';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
  const { user } = useAuth();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getProjectProgress = (projectId: string) => {
    const projectTasks = mockTasks.filter(task => task.projectId === projectId);
    const reviewedTasks = projectTasks.filter(task => task.status === 'reviewed');
    return projectTasks.length > 0 ? (reviewedTasks.length / projectTasks.length) * 100 : 0;
  };

  const getUserProjectTasks = (projectId: string) => {
    return mockTasks.filter(task => task.projectId === projectId && task.assignedTo === user?.id).length;
  };

  const filteredProjects = (user?.role === 'admin' 
    ? mockProjects 
    : mockProjects.filter(project => 
        project.members.some(member => member.id === user?.id)
      )
  ).filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAdminNames = (members: { name: string }[]) => {
    const names = members.slice(0, 3).map(m => m.name).join(', ');
    return members.length > 3 ? `${names}...` : names;
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Top Row: Dashboard Title + Wide, Short Cards */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          {/* Dashboard Title */}
          <div className="min-w-[220px] flex-shrink-0">
            <Link to="/dashboard" className="text-3xl font-bold text-white hover:text-[#4ea8de]">
              Dashboard
            </Link>
            <p className="text-gray-400 mt-1">
              {user?.role === 'admin' ? 'Manage all projects' : 'Your assigned projects'}
            </p>
          </div>

          {/* Cards container next to title */}
          <div className="flex flex-1 gap-4 max-w-[calc(100%-240px)]">
            {/* Top Contributor of the Month */}
            <Card className="flex-1 bg-[#1e1e1e] border border-gray-700 text-white text-sm max-h-[140px]">
              <CardHeader className="pb-1">
                <CardTitle className="text-base mb-0">Top Contributor of the Month</CardTitle>
                <CardDescription className="text-xs text-gray-400 mb-1">
                  Awarded a performance bonus 🎉
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-1">Name: <span className="font-medium text-[#4ea8de]">Jane Doe</span></p>
                <p>Role: <span className="text-gray-400">Developer</span></p>
              </CardContent>
            </Card>

            {/* Team Productivity This Month */}
            <Card className="flex-1 bg-[#1e1e1e] border border-gray-700 text-white text-sm max-h-[140px] relative cursor-pointer group">
              <CardHeader className="pb-1">
                <CardTitle className="text-base mb-0">Team Productivity This Month</CardTitle>
                <CardDescription className="text-xs text-gray-400 mb-1">
                  High completion rate on backend tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="relative h-20 flex items-center justify-center p-2">
                {/* Default View */}
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                  <p className="text-2xl font-semibold m-0">72.4%</p>
                </div>
                {/* Hover View */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-center px-2 text-sm m-0">
                    42 out of 58 tasks completed this month
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Top Priority Tasks */}
            <Card className="flex-1 bg-[#1e1e1e] border border-gray-700 text-white text-sm max-h-[140px]">
              <CardHeader className="pb-1">
                <CardTitle className="text-base mb-0">Top Priority Tasks</CardTitle>
                <CardDescription className="text-xs text-gray-400 mb-1">
                  Most urgent tasks led by admins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-0">
                <div>
                  <p className="font-medium text-[#4ea8de] mb-0">Fix API Auth Bug</p>
                  <p className="text-gray-400 text-xs m-0">Led by: John Admin</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1e1e1e] text-white border border-gray-700 focus:border-[#4ea8de] rounded-md w-full"
            />
          </div>

          {user?.role === 'admin' && (
            <Button 
              onClick={() => setShowCreateProject(true)}
              className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white rounded-md px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="bg-[#1e1e1e] border border-gray-800 hover:border-[#4ea8de]/60 transition-colors"
            >
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

              <CardContent className="space-y-4">
                {user?.role === 'admin' ? (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">{Math.round(getProjectProgress(project.id))}%</span>
                      </div>
                      <Progress value={getProjectProgress(project.id)} className="bg-gray-700" />
                    </div>

                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{project.members.length} Members</span>
                      <span className="truncate max-w-[150px] text-right">{renderAdminNames(project.members)}</span>
                    </div>

                    <div className="flex justify-end">
                      <Button asChild size="sm" className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white">
                        <Link to={`/project/${project.id}`}>Open</Link>
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
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
