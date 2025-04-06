
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/hooks/use-jobs";
import { useApplications } from "@/hooks/use-applications";

export const CompanyDashboardInsights = () => {
  const { profile } = useAuth();
  const { jobs } = useJobs(profile?.company_id);
  const { applications } = useApplications();
  const [applicationsByMonth, setApplicationsByMonth] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    conversionRate: 0,
    changeFromLastMonth: {
      jobs: 0,
      applications: 0,
      conversion: 0
    }
  });

  useEffect(() => {
    // Calculate total jobs and applications
    const totalJobs = jobs.length;
    const totalApplications = applications.length;
    
    // Calculate conversion rate (assuming each job has views data)
    // For now, we'll use a placeholder calculation
    const views = totalJobs * 10; // Assuming each job gets about 10 views on average
    const conversionRate = views > 0 ? Number(((totalApplications / views) * 100).toFixed(1)) : 0;
    
    // Set the stats
    setStats({
      totalJobs,
      totalApplications,
      conversionRate,
      changeFromLastMonth: {
        jobs: 2, // Placeholder for now
        applications: totalApplications > 10 ? 10 : 2, // Placeholder
        conversion: 1.2 // Placeholder
      }
    });

    // Generate application data by month
    const currentDate = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - 5 + i);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        month: date.getMonth(),
        year: date.getFullYear(),
        applications: 0
      };
    });

    // Count applications per month
    applications.forEach(app => {
      const appDate = new Date(app.appliedDate);
      const appMonth = appDate.getMonth();
      const appYear = appDate.getFullYear();

      const monthIndex = last6Months.findIndex(
        m => m.month === appMonth && m.year === appYear
      );

      if (monthIndex !== -1) {
        last6Months[monthIndex].applications++;
      }
    });

    setApplicationsByMonth(last6Months);

    // Set source data based on actual applications
    // For now, we'll use a distribution based on the total applications
    if (totalApplications > 0) {
      const direct = Math.floor(totalApplications * 0.4);
      const referral = Math.floor(totalApplications * 0.25);
      const social = Math.floor(totalApplications * 0.2);
      const email = totalApplications - direct - referral - social;

      setSourceData([
        { name: 'Direct', value: direct },
        { name: 'Referral', value: referral },
        { name: 'Social Media', value: social },
        { name: 'Email', value: email },
      ]);
    } else {
      setSourceData([
        { name: 'Direct', value: 0 },
        { name: 'Referral', value: 0 },
        { name: 'Social Media', value: 0 },
        { name: 'Email', value: 0 },
      ]);
    }
  }, [jobs, applications]);

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
            <div className="text-3xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +{stats.changeFromLastMonth.jobs} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Applications</CardTitle>
            <CardDescription>Across all job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +{stats.changeFromLastMonth.applications} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="h-full sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
            <CardDescription>Views to applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +{stats.changeFromLastMonth.conversion}% from last month
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
                <BarChart data={applicationsByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
