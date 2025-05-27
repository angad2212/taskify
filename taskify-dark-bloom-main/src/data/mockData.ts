
import { Project, Task, User, Analytics } from '@/types';

export const mockUsers: User[] = [
  { id: '1', email: 'john@example.com', role: 'admin', name: 'John Admin' },
  { id: '2', email: 'jane@example.com', role: 'user', name: 'Jane User' },
  { id: '3', email: 'bob@example.com', role: 'user', name: 'Bob Developer' },
  { id: '4', email: 'alice@example.com', role: 'user', name: 'Alice Designer' },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website',
    description: 'Design an easy-to-use, attractive ecommerce website that reflects our brand. Ensure smooth navigation and reliable performance on all devices for a seamless shopping experience.',
    members: [mockUsers[1], mockUsers[2]],
    tasks: [],
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Mobile App Design',
    description: 'Design an intuitive and attractive mobile app that reflects our brand. Ensure smooth navigation and consistent performance across devices for a great user experience aligned with our product goals.',
    members: [mockUsers[3]],
    tasks: [],
    createdBy: '1',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Marketing Campaign Strategy',
    description: 'Develop a creative and data-driven marketing campaign to increase brand awareness and drive conversions. Align content across platforms and track performance metrics closely.',
    members: [mockUsers[1], mockUsers[2]],
    tasks: [],
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Customer Feedback Analysis',
    description: 'Analyze customer feedback and reviews to identify pain points and opportunities for product improvement. Generate actionable insights and present them to the product team.',
    members: [mockUsers[1], mockUsers[2]],
    tasks: [],
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'Website SEO Optimization',
    description: 'Improve the SEO of our website to increase organic traffic. Conduct keyword research, optimize meta tags, and enhance site performance in search engine rankings.',
    members: [mockUsers[1], mockUsers[2]],
    tasks: [],
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '6',
    name: 'New Feature Development',
    description: 'Design and develop a new feature for the web platform based on customer feedback. Ensure thorough testing, proper documentation, and a smooth deployment process.',
    members: [mockUsers[1], mockUsers[2]],
    tasks: [],
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Setup React Project',
    description: 'Initialize the React project with TypeScript and essential dependencies',
    status: 'completed',
    assignedTo: '2',
    projectId: '1',
    deadline: new Date('2024-02-01'),
    skills: ['React', 'TypeScript'],
    score: 4.5,
    reviewedBy: '1',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for the main pages',
    status: 'in-progress',
    assignedTo: '3',
    projectId: '1',
    deadline: new Date('2024-02-05'),
    skills: ['UI/UX', 'Figma'],
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Implement Authentication',
    description: 'Setup user login and registration functionality',
    status: 'assigned',
    assignedTo: '2',
    projectId: '1',
    deadline: new Date('2024-02-10'),
    skills: ['React', 'Authentication'],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    title: 'Create App Prototype',
    description: 'Build interactive prototype in Figma',
    status: 'reviewed',
    assignedTo: '4',
    projectId: '2',
    deadline: new Date('2024-02-03'),
    skills: ['Figma', 'Prototyping'],
    score: 5.0,
    reviewedBy: '1',
    createdAt: new Date('2024-01-21'),
  },
];

export const mockAnalytics: Analytics[] = [
  {
    userId: '2',
    userName: 'Jane User',
    tasksCompleted: 5,
    tasksReviewed: 0,
    averageScore: 4.2,
  },
  {
    userId: '3',
    userName: 'Bob Developer',
    tasksCompleted: 3,
    tasksReviewed: 0,
    averageScore: 4.7,
  },
  {
    userId: '4',
    userName: 'Alice Designer',
    tasksCompleted: 4,
    tasksReviewed: 0,
    averageScore: 4.9,
  },
];
