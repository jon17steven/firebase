'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ListChecks, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { Ticket, Priority, Status } from "@/types"; // Assuming types are defined
import { useEffect, useState, useMemo } from "react"; // Import useMemo
import { PRIORITIES, STATUSES } from "@/lib/constants";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import Image from 'next/image';

// Import Firebase Firestore functions and onSnapshot
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// Import useAuth hook
import { useAuth } from '@/hooks/use-auth-listener';
import { useToast } from '@/hooks/use-toast';

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
  const [loadingTickets, setLoadingTickets] = useState(true);

  const { user, loading: loadingUser } = useAuth(); // Use the auth hook
  const { toast } = useToast();

  // Listen for tickets in real-time for the logged-in user
  useEffect(() => {
    let unsubscribe: () => void;

    if (!user) {
      setTickets([]); // Clear tickets if no user is logged in
      setLoadingTickets(false);
      return () => {}; // Return empty cleanup function
    }

    setLoadingTickets(true);
    try {
      const ticketsCollectionRef = collection(db, "tickets");
      // Create a query to get tickets for the logged-in user
      const q = query(ticketsCollectionRef,
                      where("userId", "==", user.id)
                      // No orderBy here by default, add if needed
                     );

      // Set up real-time listener
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedTickets: Ticket[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamp to JavaScript Date, handling potential undefined
          const ticket: Ticket = {
            id: doc.id,
            title: data.title,
            description: data.description || '', // Ensure description is string
            priority: data.priority,
            status: data.status,
            // Convert Firestore Timestamp to JavaScript Date
            dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate), 
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt), 
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt), 
            userId: data.userId,
          };
          fetchedTickets.push(ticket);
        });
        setTickets(fetchedTickets);
        setLoadingTickets(false);
      }, (error) => {
        console.error('Error fetching tickets in real-time:', error);
        toast({
          title: 'Error al cargar tickets',
          description: 'No se pudieron cargar tus tickets en tiempo real.',
          variant: 'destructive',
        });
        setLoadingTickets(false);
      });

    } catch (error) {
      console.error('Error setting up ticket listener:', error);
       toast({
            title: 'Error',
            description: 'Hubo un problema al configurar la escucha de tickets.',
            variant: 'destructive',
        });
      setLoadingTickets(false);
      return () => {}; // Return empty cleanup function if setup fails
    }

    // Cleanup function: Unsubscribe from the listener when the component unmounts or user changes
    return () => { 
      if (unsubscribe) unsubscribe();
    };

  }, [user, toast]); // Rerun effect when user object or toast changes

  const totalTickets = tickets.length;
  
  // Memoize chart data calculations
  const ticketsByStatus = useMemo(() => STATUSES.map(s => ({
    name: s.label,
    value: tickets.filter(t => t.status === s.value).length,
    fill: statusColors[s.value],
  })), [tickets]);

  const ticketsByPriority = useMemo(() => PRIORITIES.map(p => ({
    name: p.label,
    value: tickets.filter(t => t.priority === p.value).length,
    fill: priorityColors[p.value],
  })), [tickets]);

  const chartConfigStatus: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    ticketsByStatus.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [ticketsByStatus]);

  const chartConfigPriority: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    ticketsByPriority.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [ticketsByPriority]);

  // Show loading spinner or skeleton while fetching tickets or user
   if (loadingUser || loadingTickets) {
      return <div className="flex flex-1 items-center justify-center">Cargando panel de control...</div>; // Simple loading indicator
  }

   if (!user) {
       return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="https://placehold.co/300x200.png" alt="Login required" width={300} height={200} data-ai-hint="login required" className="rounded-md" />
          <h3 className="text-2xl font-bold tracking-tight">
            Inicia sesión para ver tu panel de control
          </h3>
          <p className="text-sm text-muted-foreground">
            Necesitas iniciar sesión para acceder a esta página.
          </p>
          <Button asChild className="mt-4">
            <Link href="/login">
               Iniciar Sesión
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (tickets.length === 0 && !loadingTickets) { // Ensure it's not just loading
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
            <p className="text-xs text-muted-foreground">Tickets activos y completados</p> {/* This description might need adjustment based on filters if applied */}
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
            <p className="text-xs text-muted-foreground">Tickets completados</p> {/* Adjusted description */}
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

         {/* You can add a chart for dates here if needed, e.g., tickets created per week/month */}

      </div>
    </>
  );
}
