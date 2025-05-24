import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import AddTaskModal from '@/components/AddTaskModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Calendar, User } from 'lucide-react';
import { mockProjects, mockTasks, mockUsers } from '@/data/mockData';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [reviewingTaskId, setReviewingTaskId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const { toast } = useToast();

  const project = mockProjects.find(p => p.id === id);
  const projectTasks = mockTasks.filter(task => task.projectId === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
            <p className="text-gray-400">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const getProgress = () => {
    const reviewedTasks = projectTasks.filter(task => task.status === 'reviewed');
    return projectTasks.length > 0 ? (reviewedTasks.length / projectTasks.length) * 100 : 0;
  };

  const getTasksByStatus = (status: string) => {
    return projectTasks.filter(task => task.status === status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-gray-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'reviewed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const canUserManageTasks = user?.role === 'admin' || project.createdBy === user?.id;

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    console.log(`Updating task ${taskId} to status: ${newStatus}`);
    toast({
      title: "Status Updated",
      description: `Task moved to ${newStatus.replace('-', ' ')}`,
    });
  };

  const getNextStatus = (currentStatus: string, userRole: string) => {
    if (userRole === 'admin') {
      switch (currentStatus) {
        case 'assigned': return 'in-progress';
        case 'in-progress': return 'completed';
        case 'completed': return 'reviewed';
        default: return currentStatus;
      }
    } else {
      switch (currentStatus) {
        case 'assigned': return 'in-progress';
        case 'in-progress': return 'completed';
        default: return currentStatus;
      }
    }
  };

  const canUpdateStatus = (task: any) => {
    if (user?.role === 'admin') return true;
    if (task.assignedTo === user?.id && task.status !== 'reviewed') return true;
    return false;
  };

  const handleSubmitReview = () => {
    console.log(`Submitted rating ${rating} for task ${reviewingTaskId}`);
    toast({
      title: "Review Submitted",
      description: `Rating: ${rating}/10`,
    });
    setReviewingTaskId(null);
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-gray-400 mb-4">{project.description}</p>

              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-400 text-sm">Team:</span>
                <div className="flex -space-x-2">
                  {project.members.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-[#121212]">
                      <AvatarFallback className="bg-[#4ea8de] text-white text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#121212] flex items-center justify-center">
                      <span className="text-xs text-white">+{project.members.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {canUserManageTasks && (
              <Button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>

          <div className="bg-[#1e1e1e] rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Project Progress</span>
              <span className="text-gray-400">{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="bg-gray-700" />
          </div>
        </div>

        {/* Review Card */}
        {reviewingTaskId && (
          <Card className="bg-[#1e1e1e] border border-purple-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-xl">Review Task</CardTitle>
              <CardDescription className="text-gray-400">
                Rate the performance of this task from 1 to 10.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[rating]}
                  max={10}
                  step={1}
                  onValueChange={(val) => setRating(val[0])}
                />
                <p className="text-white">Rating: {rating}/10</p>
                <div className="flex space-x-2">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleSubmitReview}
                  >
                    Submit Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReviewingTaskId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['assigned', 'in-progress', 'completed', 'reviewed'].map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white capitalize">
                  {status.replace('-', ' ')}
                </h3>
                <Badge className={`${getStatusColor(status)} text-white`}>
                  {getTasksByStatus(status).length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[200px] bg-[#0f0f0f] rounded-lg p-3">
                {getTasksByStatus(status).map((task) => {
                  const assignedUser = mockUsers.find(u => u.id === task.assignedTo);
                  const nextStatus = getNextStatus(task.status, user?.role || 'user');

                  return (
                    <Card key={task.id} className="bg-[#1e1e1e] border-gray-800 hover:border-gray-700 transition-colors">
                      <CardContent className="p-4">
                        <h4 className="text-white font-medium mb-2">{task.title}</h4>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{assignedUser?.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {skill}
                            </Badge>
                          ))}
                          {task.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                              +{task.skills.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          {user?.role === 'admin' && status === 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => setReviewingTaskId(task.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                            >
                              Review & Score
                            </Button>
                          )}
                          {canUpdateStatus(task) && nextStatus !== task.status && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(task.id, nextStatus)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                            >
                              Move to {nextStatus.replace('-', ' ')}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {projectTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No tasks in this project yet.</p>
            {canUserManageTasks && (
              <p className="text-gray-500 text-sm mt-2">Create your first task to get started.</p>
            )}
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        projectId={id || ''}
        projectMembers={project.members}
      />
    </div>
  );
};

export default Project;
