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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Import Dialog components
import { TicketForm } from '@/components/ticket-form'; // Import TicketForm

// Import Firebase Firestore functions and onSnapshot
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// Import useAuth hook
import { useAuth } from '@/hooks/use-auth-listener';
import { useToast } from '@/hooks/use-toast';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]); // Initialize with an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null); // State to hold the ticket being edited

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
      // Create a query to get tickets for the logged-in user, ordered by creation date
      const q = query(ticketsCollectionRef,
                      where("userId", "==", user.id),
                      orderBy("createdAt", "desc") // Optional: Order by creation date descending
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
            description: 'Hubo un problema al configurar la escucha de tickets.', // Display a user-friendly message
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

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  // Function to handle editing a ticket
  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket); // Set the ticket to be edited
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setEditingTicket(null); // Clear the editing ticket state
  };

  // The handleTicketsChange is now less critical for state updates due to real-time listener
  // Keep it if needed for other purposes, otherwise it can be removed.
  const handleTicketsChange = (updatedTickets: Ticket[]) => {
     // setTickets(updatedTickets);
  };

  // Show loading spinner or skeleton while fetching tickets or user
  if (loadingUser || loadingTickets) {
      return <div className="flex flex-1 items-center justify-center">Cargando tickets...</div>; // Simple loading indicator
  }

  if (!user) {
       return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="https://placehold.co/300x200.png" alt="Login required" width={300} height={200} data-ai-hint="login required" className="rounded-md" />
          <h3 className="text-2xl font-bold tracking-tight">
            Inicia sesión para ver tus tickets
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
          <Image src="https://placehold.co/300x200.png" alt="No tickets" width={300} height={200} data-ai-hint="task list empty" className="rounded-md" />
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

      <TicketTable 
        tickets={filteredTickets} 
        onTicketsChange={handleTicketsChange} // Still here, but less critical for state updates
        onEdit={handleEdit} // Pass the handleEdit function to the table
        onDelete={(ticketId) => { /* onDelete will be handled by real-time updates */ }} // onDelete prop is required by TicketTableActions, but its state update is handled by listener
      />

      {/* Edit Ticket Dialog */}
      <Dialog open={!!editingTicket} onOpenChange={(isOpen) => { // Modified onOpenChange
          if (!isOpen) {
            setEditingTicket(null); // Close modal by setting editingTicket to null
          }
        }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Ticket</DialogTitle>
          </DialogHeader>
          {editingTicket && (
            <TicketForm 
              initialData={editingTicket} 
              isEditing={true} 
              onSubmitSuccess={handleCloseEditModal} // Close modal on successful submission
              onCancel={handleCloseEditModal} // Close modal on cancel
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
