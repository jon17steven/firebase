'use client';

import { useState, useEffect, useMemo } from 'react';
import { TicketTable } from '@/components/ticket-table';
import type { Ticket, Priority, Status } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRIORITIES, STATUSES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link'; // Admins might also want to create tickets

// Mock data - replace with actual data fetching for ALL tickets
const mockAllTickets: Ticket[] = [
  { id: '1', title: 'Configurar entorno DEV User A', description: '...', priority: 'ALTA', status: 'COMPLETADA', dueDate: new Date(2024, 6, 15), createdAt: new Date(2024, 6, 1), updatedAt: new Date(2024, 6, 2), userId: 'userA_ID' },
  { id: '2', title: 'Diseñar UI User A', description: '...', priority: 'MEDIA', status: 'EN_PROGRESO', dueDate: new Date(2024, 6, 20), createdAt: new Date(2024, 6, 5), updatedAt: new Date(2024, 6, 10), userId: 'userA_ID' },
  { id: '3', title: 'Bug en login User B', description: '...', priority: 'ALTA', status: 'PENDIENTE', dueDate: new Date(2024, 6, 25), createdAt: new Date(2024, 6, 10), updatedAt: new Date(2024, 6, 10), userId: 'userB_ID' },
  { id: '4', title: 'Feature request User C', description: '...', priority: 'BAJA', status: 'PENDIENTE', dueDate: new Date(2024, 7, 1), createdAt: new Date(2024, 6, 12), updatedAt: new Date(2024, 6, 12), userId: 'userC_ID' },
  { id: '5', title: 'Revisar textos User B', description: '...', priority: 'MEDIA', status: 'EN_PROGRESO', dueDate: new Date(2024, 7, 5), createdAt: new Date(2024, 6, 18), updatedAt: new Date(2024, 6, 19), userId: 'userB_ID' },
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockAllTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [userFilter, setUserFilter] = useState(''); // Filter by user ID or email

  // In a real app, fetch ALL tickets
  useEffect(() => {
    // fetchAllTickets().then(setTickets);
  }, []);

  const uniqueUserIds = useMemo(() => {
    const ids = new Set(tickets.map(t => t.userId));
    return Array.from(ids);
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
      const matchesUser = userFilter === '' || ticket.userId.toLowerCase().includes(userFilter.toLowerCase()); // Simple substring match for user ID
      return matchesSearch && matchesStatus && matchesPriority && matchesUser;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, userFilter]);
  
  const handleTicketsChange = (updatedTickets: Ticket[]) => {
    setTickets(updatedTickets);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">Administrar Todos los Tickets</h1>
         {/* Admins might want ability to create tickets for users, or system tickets */}
        {/* <Button asChild>
          <Link href="/tickets/new"> <PlusCircle className="mr-2 h-4 w-4" /> Crear Ticket </Link>
        </Button> */}
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            placeholder="Filtrar por ID de usuario..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
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

      <TicketTable tickets={filteredTickets} onTicketsChange={handleTicketsChange} showUserColumn={true} />
    </>
  );
}
