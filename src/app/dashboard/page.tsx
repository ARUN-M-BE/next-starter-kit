import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Send, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
};

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  status: string;
}

export default function DashboardPage() {
  // Mock data for KPI metrics
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      description: "+12% from last month",
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      title: "Active Sessions",
      value: "84",
      description: "Currently online",
      icon: <Shield className="h-5 w-5 text-emerald-500" />,
    },
    {
      title: "Emails Sent",
      value: "452",
      description: "99.8% delivery rate",
      icon: <Send className="h-5 w-5 text-indigo-500" />,
    },
    {
      title: "SMS Triggers",
      value: "112",
      description: "Twilio sandbox API logs",
      icon: <MessageSquare className="h-5 w-5 text-amber-500" />,
    },
  ];

  // Mock table columns schema
  const columns = [
    { header: "User ID", accessorKey: "id" },
    { header: "User Name", accessorKey: "user" },
    { header: "Action", accessorKey: "action" },
    { header: "Time Stamp", accessorKey: "time" },
    { header: "Status", accessorKey: "status" },
  ];

  // Mock table row content
  const mockActivities: ActivityItem[] = [
    { id: "usr_1", user: "John Doe", action: "Signed In", time: "2 minutes ago", status: "Success" },
    { id: "usr_2", user: "Jane Smith", action: "Sent Email Request", time: "15 minutes ago", status: "Success" },
    { id: "usr_3", user: "Alice Johnson", action: "Updated Profile details", time: "1 hour ago", status: "Success" },
    { id: "usr_4", user: "Bob Brown", action: "Triggered OTP SMS", time: "3 hours ago", status: "Success" },
    { id: "usr_5", user: "Charlie Wilson", action: "API Authentication", time: "5 hours ago", status: "Warning" },
    { id: "usr_6", user: "David Miller", action: "Leaflet Map Load", time: "1 day ago", status: "Success" },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Monitor system metrics, access direct module integration controls, and review sandbox logs."
        breadcrumbs={[{ label: "Dashboard" }]}
        action={
          <Link href="/maps">
            <Button className="rounded-xl font-semibold shadow-sm flex items-center">
              View Map Interface
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <Card key={index} className="border-border/60 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                {item.title}
              </CardTitle>
              <div className="h-9 w-9 bg-muted rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Data Table */}
      <div className="space-y-4">
        <div className="flex flex-col text-left space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Recent Activity Log</h2>
          <p className="text-sm text-muted-foreground">
            A real-time overview of sandbox mock actions and client-side page transitions.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={mockActivities}
          searchKey="user"
          searchPlaceholder="Search by user name..."
          pageSize={5}
        />
      </div>
    </div>
  );
}
