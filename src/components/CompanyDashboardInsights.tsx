
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

  const jobViewsData = [
    { name: 'Senior Frontend Developer', views: 452 },
    { name: 'UX Designer', views: 378 },
    { name: 'Product Manager', views: 289 },
    { name: 'Backend Developer', views: 403 },
    { name: 'Marketing Specialist', views: 315 },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
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
        
        <Card>
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
        
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>
              Number of applications received monthly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  applications: {
                    label: "Applications",
                    color: "#8B5CF6",
                  },
                }}
              >
                <BarChart data={applicationData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="applications"
                    fill="var(--color-applications, #8B5CF6)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
            <CardDescription>
              Where your applications are coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Listing Views</CardTitle>
          <CardDescription>
            Number of views per job listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                views: {
                  label: "Views",
                  color: "#0EA5E9",
                },
              }}
            >
              <BarChart data={jobViewsData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar
                  dataKey="views"
                  fill="var(--color-views, #0EA5E9)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
