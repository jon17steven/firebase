'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
import { TicketTable } from '@/components/ticket-table';
import type { Ticket, Priority, Status } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRIORITIES, STATUSES } from '@/lib/constants';
import Image from 'next/image';

// Mock data - replace with actual data fetching
const mockUserTickets: Ticket[] = [
  { id: '1', title: 'Configurar entorno de desarrollo', description: 'Instalar Node, VSCode, etc.', priority: 'ALTA', status: 'COMPLETADA', dueDate: new Date(2024, 6, 15), createdAt: new Date(2024, 6, 1), updatedAt: new Date(2024, 6, 2), userId: 'user1' },
  { id: '2', title: 'Diseñar UI para dashboard', description: 'Crear mockups en Figma.', priority: 'MEDIA', status: 'EN_PROGRESO', dueDate: new Date(2024, 6, 20), createdAt: new Date(2024, 6, 5), updatedAt: new Date(2024, 6, 10), userId: 'user1' },
  { id: '3', title: 'Implementar autenticación', description: 'Usar Firebase Auth.', priority: 'ALTA', status: 'PENDIENTE', dueDate: new Date(2024, 6, 25), createdAt: new Date(2024, 6, 10), updatedAt: new Date(2024, 6, 10), userId: 'user1' },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockUserTickets); // Initialize with mock data
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');

  // In a real app, fetch tickets for the logged-in user
  useEffect(() => {
    // fetchUserTickets().then(setTickets);
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const handleTicketsChange = (updatedTickets: Ticket[]) => {
    setTickets(updatedTickets);
  };

  if (tickets.length === 0) {
     return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="https://placehold.co/300x200.png" alt="No tickets" width={300} height={200} data-ai-hint="task list" className="rounded-md" />
          <h3 className="text-2xl font-bold tracking-tight">
            No has creado ningún ticket todavía
          </h3>
          <p className="text-sm text-muted-foreground">
            Crea tu primer ticket para empezar a organizar tus tareas.
          </p>
          <Button asChild className="mt-4">
            <Link href="/tickets/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Ticket
            </Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">Mis Tickets</h1>
        <Button asChild>
          <Link href="/tickets/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Ticket
          </Link>
        </Button>
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'ALL')}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los Estados</SelectItem>
              {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | 'ALL')}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las Prioridades</SelectItem>
              {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TicketTable tickets={filteredTickets} onTicketsChange={handleTicketsChange} />
    </>
  );
}
