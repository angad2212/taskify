
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
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

  const users = mockUsers.filter(user => user.role === 'user');

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddBest = () => {
    // Mock logic to select best users
    const bestUsers = users.slice(0, bestCount).map(user => user.id);
    setSelectedMembers(bestUsers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock project creation
    console.log('Creating project:', { name, description, members: selectedMembers });
    onOpenChange(false);
    // Reset form
    setName('');
    setDescription('');
    setSelectedMembers([]);
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
                Add Best {bestCount}
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
