'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ListChecks, Activity } from "lucide-react";
// Placeholder for actual data
// import { useEffect, useState } from "react";
// import type { Ticket, User } from "@/types";

export default function AdminDashboardPage() {
  // const [totalTickets, setTotalTickets] = useState(0);
  // const [totalUsers, setTotalUsers] = useState(0);
  // const [activeTickets, setActiveTickets] = useState(0);

  // useEffect(() => {
    // Fetch admin dashboard data here
    // e.g., setTotalTickets(125); setTotalUsers(30); setActiveTickets(80);
  // }, []);

  const stats = {
    totalTickets: 125, // Placeholder
    totalUsers: 30,    // Placeholder
    activeTickets: 80, // Placeholder
  };


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">Panel de Administrador</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets Registrados</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">Tickets en todo el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTickets}</div>
            <p className="text-xs text-muted-foreground">Tickets pendientes o en progreso</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente del Sistema</CardTitle>
            <CardDescription>Próximamente: Gráficos y logs de actividad.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 border border-dashed rounded-md">
                <p className="text-muted-foreground">Gráficos de actividad aquí.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
