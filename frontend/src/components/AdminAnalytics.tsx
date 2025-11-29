import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Card from './Card';
import { getUsers } from '../utils/storage';

const AdminAnalytics: React.FC = () => {
    const users = getUsers();

    const userStats = [
        { name: 'Victims', value: users.filter(u => u.role === 'victim').length, color: '#FF8042' },
        { name: 'Counsellors', value: users.filter(u => u.role === 'counsellor').length, color: '#00C49F' },
        { name: 'Legal Advisors', value: users.filter(u => u.role === 'legal').length, color: '#0088FE' },
        { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#FFBB28' },
    ];

    const monthlyData = [
        { name: 'Jan', cases: 4 },
        { name: 'Feb', cases: 7 },
        { name: 'Mar', cases: 5 },
        { name: 'Apr', cases: 10 },
        { name: 'May', cases: 12 },
        { name: 'Jun', cases: 8 },
    ];

    return (
        <div className="analytics-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <Card title="User Distribution">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={userStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {userStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card title="Monthly Cases">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cases" fill="#8884d8" name="New Cases" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default AdminAnalytics;
