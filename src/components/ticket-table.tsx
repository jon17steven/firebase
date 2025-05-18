'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Ticket, Priority, Status } from "@/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowDownToLine, Minus, ArrowUpToLine, CircleOff, LoaderCircle, CheckCircle2 } from "lucide-react";
import { TicketTableActions } from "./ticket-table-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TicketForm } from "./ticket-form";
import { useState } from 'react';


const PriorityIcon = ({ priority }: { priority: Priority }) => {
  switch (priority) {
    case 'ALTA': return <ArrowUpToLine className="h-4 w-4 text-red-500" />;
    case 'MEDIA': return <Minus className="h-4 w-4 text-yellow-500" />;
    case 'BAJA': return <ArrowDownToLine className="h-4 w-4 text-green-500" />;
    default: return null;
  }
};

const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case 'PENDIENTE': return <CircleOff className="h-4 w-4 text-gray-500" />;
    case 'EN_PROGRESO': return <LoaderCircle className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'COMPLETADA': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    default: return null;
  }
};

const priorityBadgeVariant = (priority: Priority): "destructive" | "secondary" | "default" => {
  if (priority === 'ALTA') return "destructive";
  if (priority === 'MEDIA') return "secondary";
  return "default"; // BAJA
}

const statusBadgeVariant = (status: Status): "outline" | "default" | "secondary" => {
  if (status === 'PENDIENTE') return "outline";
  if (status === 'EN_PROGRESO') return "default"; // default is primary
  return "secondary"; // COMPLETADA (using secondary for a less prominent look than primary)
}


interface TicketTableProps {
  tickets: Ticket[];
  onTicketsChange: (updatedTickets: Ticket[]) => void; // Callback to update tickets state in parent
  showUserColumn?: boolean; // For admin view
}

export function TicketTable({ tickets, onTicketsChange, showUserColumn = false }: TicketTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);


  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  }

  const handleDelete = (ticketId: string) => {
    // This would typically be a server action
    const updatedTickets = tickets.filter(t => t.id !== ticketId);
    onTicketsChange(updatedTickets);
  };
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
    const newTickets = tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
    onTicketsChange(newTickets);
    setIsEditModalOpen(false);
    setSelectedTicket(null);
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No hay tickets para mostrar.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead> */}
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Estado</TableHead>
              <TableHead className="hidden md:table-cell">Prioridad</TableHead>
              <TableHead className="hidden lg:table-cell">Fecha Entrega</TableHead>
              {showUserColumn && <TableHead className="hidden xl:table-cell">Usuario</TableHead>}
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                {/* <TableCell>
                  <Checkbox />
                </TableCell> */}
                <TableCell>
                  <div className="font-medium">{ticket.title}</div>
                  <div className="text-xs text-muted-foreground md:hidden">
                    {ticket.priority} - {format(new Date(ticket.dueDate), "P", { locale: es })}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={statusBadgeVariant(ticket.status)} className="capitalize gap-1">
                    <StatusIcon status={ticket.status} />
                    {ticket.status.toLowerCase().replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                   <Badge variant={priorityBadgeVariant(ticket.priority)} className="capitalize gap-1">
                    <PriorityIcon priority={ticket.priority} />
                    {ticket.priority.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{format(new Date(ticket.dueDate), "PPP", { locale: es })}</TableCell>
                {showUserColumn && <TableCell className="hidden xl:table-cell">{ticket.userId.substring(0,10)}...</TableCell>}
                <TableCell>
                  <TicketTableActions ticket={ticket} onEdit={handleEdit} onDelete={handleDelete} onView={handleViewDetails} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => { setIsEditModalOpen(isOpen); if(!isOpen) setSelectedTicket(null);}}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ticket</DialogTitle>
            <DialogDescription>Modifica los detalles de tu ticket.</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <TicketForm 
              initialData={selectedTicket} 
              onSubmitSuccess={handleUpdateTicket} 
              isEditing 
              onCancel={() => { setIsEditModalOpen(false); setSelectedTicket(null);}}
            />
          )}
        </DialogContent>
      </Dialog>

       {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={(isOpen) => { setIsViewModalOpen(isOpen); if(!isOpen) setSelectedTicket(null);}}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Descripción</h4>
                <p className="text-sm">{selectedTicket.description || "N/A"}</p>
              </div>
               <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Prioridad</h4>
                <p className="text-sm capitalize">{selectedTicket.priority.toLowerCase()}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                <p className="text-sm capitalize">{selectedTicket.status.toLowerCase().replace('_', ' ')}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Fecha de Entrega</h4>
                <p className="text-sm">{format(new Date(selectedTicket.dueDate), "PPP", { locale: es })}</p>
              </div>
               <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Creado</h4>
                <p className="text-sm">{format(new Date(selectedTicket.createdAt), "PPP p", { locale: es })}</p>
              </div>
               <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Actualizado</h4>
                <p className="text-sm">{format(new Date(selectedTicket.updatedAt), "PPP p", { locale: es })}</p>
              </div>
              {showUserColumn && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Usuario ID</h4>
                  <p className="text-sm">{selectedTicket.userId}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
