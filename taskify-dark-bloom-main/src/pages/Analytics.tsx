
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockUsers, mockTasks } from '@/data/mockData';

const Analytics = () => {
  const { user } = useAuth();

  // Calculate analytics data
  const analytics = mockUsers.map(u => {
    const userTasks = mockTasks.filter(task => task.assignedTo === u.id);
    const completedTasks = userTasks.filter(task => task.status === 'completed' || task.status === 'reviewed');
    const reviewedTasks = mockTasks.filter(task => task.reviewedBy === u.id);
    const tasksWithScores = userTasks.filter(task => task.score !== undefined);
    const averageScore = tasksWithScores.length > 0 
      ? tasksWithScores.reduce((sum, task) => sum + (task.score || 0), 0) / tasksWithScores.length 
      : 0;

    return {
      userId: u.id,
      userName: u.name,
      email: u.email,
      role: u.role,
      totalTasks: userTasks.length,
      tasksCompleted: completedTasks.length,
      tasksReviewed: reviewedTasks.length,
      averageScore: Math.round(averageScore * 100) / 100
    };
  });

  // Chart data
  const taskCompletionData = analytics.map(a => ({
    name: a.userName.split(' ')[0],
    completed: a.tasksCompleted,
    total: a.totalTasks
  }));

  const roleDistribution = [
    { name: 'Admin', value: analytics.filter(a => a.role === 'admin').length, color: '#4ea8de' },
    { name: 'User', value: analytics.filter(a => a.role === 'user').length, color: '#a78bfa' }
  ];

  const getPerformanceBadge = (score: number) => {
    if (score >= 4.5) return <Badge className="bg-green-600 text-white">Excellent</Badge>;
    if (score >= 3.5) return <Badge className="bg-blue-600 text-white">Good</Badge>;
    if (score >= 2.5) return <Badge className="bg-yellow-600 text-white">Average</Badge>;
    if (score > 0) return <Badge className="bg-red-600 text-white">Needs Improvement</Badge>;
    return <Badge variant="outline" className="border-gray-600 text-gray-400">No Score</Badge>;
  };

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400">You don't have permission to view analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track team performance and productivity metrics</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1e1e1e] border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e1e1e] border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e1e1e] border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {mockTasks.filter(t => t.status === 'completed' || t.status === 'reviewed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e1e1e] border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg. Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {Math.round((analytics.reduce((sum, a) => sum + a.averageScore, 0) / analytics.length) * 100) / 100 || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#1e1e1e] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Task Completion by User</CardTitle>
              <CardDescription className="text-gray-400">
                Number of completed vs total tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e1e1e', 
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="completed" fill="#4ea8de" />
                  <Bar dataKey="total" fill="#6b7280" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Role Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Team composition by role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e1e1e', 
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Performance Table */}
        <Card className="bg-[#1e1e1e] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">User Performance</CardTitle>
            <CardDescription className="text-gray-400">
              Detailed performance metrics for each team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400">Total Tasks</TableHead>
                  <TableHead className="text-gray-400">Completed</TableHead>
                  <TableHead className="text-gray-400">Completion Rate</TableHead>
                  <TableHead className="text-gray-400">Reviews Done</TableHead>
                  <TableHead className="text-gray-400">Avg. Score</TableHead>
                  <TableHead className="text-gray-400">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.map((userAnalytics) => (
                  <TableRow key={userAnalytics.userId} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{userAnalytics.userName}</div>
                        <div className="text-sm text-gray-400">{userAnalytics.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={userAnalytics.role === 'admin' ? 'default' : 'secondary'}>
                        {userAnalytics.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{userAnalytics.totalTasks}</TableCell>
                    <TableCell className="text-gray-300">{userAnalytics.tasksCompleted}</TableCell>
                    <TableCell className="text-gray-300">
                      {getCompletionRate(userAnalytics.tasksCompleted, userAnalytics.totalTasks)}%
                    </TableCell>
                    <TableCell className="text-gray-300">{userAnalytics.tasksReviewed}</TableCell>
                    <TableCell className="text-gray-300">
                      {userAnalytics.averageScore > 0 ? userAnalytics.averageScore : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {getPerformanceBadge(userAnalytics.averageScore)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
