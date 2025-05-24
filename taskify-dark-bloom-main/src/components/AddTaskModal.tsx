
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/data/mockData';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectMembers: any[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, projectId, projectMembers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const { toast } = useToast();

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !deadline || !assignedTo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally send the data to your backend
    console.log('Creating task:', {
      title,
      description,
      deadline,
      assignedTo,
      skills,
      projectId,
      status: 'assigned'
    });

    toast({
      title: "Success",
      description: "Task created successfully",
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDeadline('');
    setAssignedTo('');
    setSkills([]);
    setCurrentSkill('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1e1e] border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new task for this project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#121212] border-gray-700 text-white"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#121212] border-gray-700 text-white"
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="assignedTo" className="text-white">Assign To *</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="bg-[#121212] border-gray-700 text-white">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e1e] border-gray-700">
                {projectMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id} className="text-white hover:bg-gray-800">
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="deadline" className="text-white">Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-[#121212] border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="skills" className="text-white">Skills</Label>
            <div className="flex space-x-2">
              <Input
                id="skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                className="bg-[#121212] border-gray-700 text-white flex-1"
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <Button type="button" onClick={handleAddSkill} className="bg-[#4ea8de] hover:bg-[#3a8bc4]">
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-gray-600 text-gray-300">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" onClick={onClose} className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
