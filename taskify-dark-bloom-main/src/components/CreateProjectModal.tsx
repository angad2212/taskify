import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [bestCount, setBestCount] = useState(3);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const users = mockUsers.filter(user => user.role === 'user');

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddBest = () => {
    const bestUsers = users.slice(0, bestCount).map(user => user.id);
    setSelectedMembers(bestUsers);
  };

  const handleAddSpecialists = () => {
    // Add your logic here
    console.log('Add Specialists clicked');
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills(prev => [...prev, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating project:', { name, description, members: selectedMembers, skills });
    onOpenChange(false);
    setName('');
    setDescription('');
    setSelectedMembers([]);
    setSkills([]);
    setCurrentSkill('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up a new project and assign team members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-white">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="bg-[#121212] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description" className="text-white">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              className="bg-[#121212] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label className="text-white">Team Members</Label>

            <div className="flex gap-2 mb-3">
              <Input
                type="number"
                value={bestCount}
                onChange={(e) => setBestCount(Number(e.target.value))}
                min="1"
                max={users.length}
                className="bg-[#121212] border-gray-700 text-white w-20"
              />
              <Button
                type="button"
                onClick={handleAddBest}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-700 hover:text-white"
              >
                Add Best
              </Button>

              <Button
                type="button"
                onClick={handleAddSpecialists}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-700 hover:text-white"
              >
                Add Specialists
              </Button>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={user.id}
                    checked={selectedMembers.includes(user.id)}
                    onCheckedChange={() => handleMemberToggle(user.id)}
                    className="border-gray-600"
                  />
                  <Label htmlFor={user.id} className="text-white text-sm">
                    {user.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white"
            >
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
