'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ListChecks, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { Ticket, Priority, Status } from "@/types"; // Assuming types are defined
import { useEffect, useState } from "react";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import Image from 'next/image';

// Mock data - replace with actual data fetching
const mockTickets: Ticket[] = [
  { id: '1', title: 'Configurar entorno de desarrollo', description: 'Instalar Node, VSCode, etc.', priority: 'ALTA', status: 'COMPLETADA', dueDate: new Date(2024, 6, 15), createdAt: new Date(2024, 6, 1), updatedAt: new Date(2024, 6, 2), userId: 'user1' },
  { id: '2', title: 'Diseñar UI para dashboard', description: 'Crear mockups en Figma.', priority: 'MEDIA', status: 'EN_PROGRESO', dueDate: new Date(2024, 6, 20), createdAt: new Date(2024, 6, 5), updatedAt: new Date(2024, 6, 10), userId: 'user1' },
  { id: '3', title: 'Implementar autenticación', description: 'Usar Firebase Auth.', priority: 'ALTA', status: 'PENDIENTE', dueDate: new Date(2024, 6, 25), createdAt: new Date(2024, 6, 10), updatedAt: new Date(2024, 6, 10), userId: 'user1' },
  { id: '4', title: 'Desarrollar CRUD de tickets', description: 'Funcionalidad completa para tickets.', priority: 'MEDIA', status: 'PENDIENTE', dueDate: new Date(2024, 7, 1), createdAt: new Date(2024, 6, 12), updatedAt: new Date(2024, 6, 12), userId: 'user1' },
  { id: '5', title: 'Revisar textos de la app', description: 'Corregir gramática y ortografía.', priority: 'BAJA', status: 'EN_PROGRESO', dueDate: new Date(2024, 7, 5), createdAt: new Date(2024, 6, 18), updatedAt: new Date(2024, 6, 19), userId: 'user1' },
];


const statusColors: Record<Status, string> = {
  PENDIENTE: "hsl(var(--chart-4))", // yellow-ish
  EN_PROGRESO: "hsl(var(--chart-1))", // blue (primary)
  COMPLETADA: "hsl(var(--chart-2))", // green-ish
};

const priorityColors: Record<Priority, string> = {
  BAJA: "hsl(var(--chart-2))", // green-ish
  MEDIA: "hsl(var(--chart-4))", // yellow-ish
  ALTA: "hsl(var(--chart-5))", // red-ish
};


export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // In a real app, fetch user's tickets here
    // For now, use mock data
    setTickets(mockTickets);
  }, []);

  const totalTickets = tickets.length;
  const ticketsByStatus = STATUSES.map(s => ({
    name: s.label,
    value: tickets.filter(t => t.status === s.value).length,
    fill: statusColors[s.value],
  }));

  const ticketsByPriority = PRIORITIES.map(p => ({
    name: p.label,
    value: tickets.filter(t => t.priority === p.value).length,
    fill: priorityColors[p.value],
  }));

  const chartConfigStatus: ChartConfig = {};
  ticketsByStatus.forEach(item => {
    chartConfigStatus[item.name] = { label: item.name, color: item.fill };
  });

  const chartConfigPriority: ChartConfig = {};
  ticketsByPriority.forEach(item => {
    chartConfigPriority[item.name] = { label: item.name, color: item.fill };
  });

  if (tickets.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="https://placehold.co/300x200.png" alt="No tickets" width={300} height={200} data-ai-hint="empty state task" className="rounded-md" />
          <h3 className="text-2xl font-bold tracking-tight">
            Aún no tienes tickets
          </h3>
          <p className="text-sm text-muted-foreground">
            Empieza creando tu primer ticket para organizar tus tareas.
          </p>
          <Button asChild className="mt-4">
            <Link href="/tickets/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Ticket
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">Panel de Control</h1>
        <Button asChild>
          <Link href="/tickets/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Ticket
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">Tickets activos y completados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'PENDIENTE').length}</div>
            <p className="text-xs text-muted-foreground">Tickets que necesitan atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'COMPLETADA').length}</div>
            <p className="text-xs text-muted-foreground">Tickets finalizados este mes</p> {/* Placeholder description */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Estado</CardTitle>
            <CardDescription>Distribución de tickets según su estado actual.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigStatus} className="min-h-[250px] w-full">
              <BarChart accessibilityLayer data={ticketsByStatus} layout="vertical" margin={{ right: 20 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.length > 15 ? value.slice(0,15) + "..." : value}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" radius={5}>
                    {ticketsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets por Prioridad</CardTitle>
            <CardDescription>Distribución de tickets según su prioridad.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={chartConfigPriority} className="min-h-[250px] w-full max-w-xs">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={ticketsByPriority} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} strokeWidth={2}>
                    {ticketsByPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
