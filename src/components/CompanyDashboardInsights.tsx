
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const CompanyDashboardInsights = () => {
  // Mock data for visualizations
  const applicationData = [
    { name: 'Jan', applications: 12 },
    { name: 'Feb', applications: 19 },
    { name: 'Mar', applications: 24 },
    { name: 'Apr', applications: 18 },
    { name: 'May', applications: 35 },
    { name: 'Jun', applications: 40 },
  ];

  const sourceData = [
    { name: 'Direct', value: 40 },
    { name: 'Referral', value: 25 },
    { name: 'Social Media', value: 20 },
    { name: 'Email', value: 15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Jobs</CardTitle>
            <CardDescription>Current active job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Applications</CardTitle>
            <CardDescription>Across all job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">148</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +35 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="h-full sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
            <CardDescription>Views to applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.7%</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in w-full">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>
              Number of applications received monthly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 md:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="applications"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in w-full">
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
            <CardDescription>
              Where your applications are coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 md:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
