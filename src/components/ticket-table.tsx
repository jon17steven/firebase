'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import type { Ticket, Status } from "@/types" // Import Status here
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { TicketTableActions } from "./ticket-table-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"


// Helper function to get badge variant based on status
const statusBadgeVariant = (status: Status): "outline" | "default" | "secondary" => {
  if (status === 'PENDIENTE') return "outline";
  if (status === 'EN_PROGRESO') return "default"; // default is primary
  return "secondary"; // COMPLETADA (using secondary for a less prominent look than primary)
}


interface TicketTableProps {
  tickets: Ticket[];
  onTicketsChange: (updatedTickets: Ticket[]) => void; // Callback to update tickets state in parent (less critical with real-time listener)
  onEdit: (ticket: Ticket) => void; // Add onEdit prop
  onDelete: (ticketId: string) => void; // Add onDelete prop
  onView?: (ticket: Ticket) => void; // Optional view action
  showUserColumn?: boolean; // For admin view
}

export function TicketTable({ tickets, onTicketsChange, onEdit, onDelete, onView, showUserColumn = false }: TicketTableProps) {
  // The state and modal logic for editing and viewing is now handled in the parent (tickets/page.tsx)
  // so we can remove this state and the modal rendering from here.
  // const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isViewModalOpen, setIsViewModal] = useState(false); // Renamed for clarity

  // const handleEdit = (ticket: Ticket) => {
  //   setSelectedTicket(ticket);
  //   setIsEditModalOpen(true);
  // };

  // const handleView = (ticket: Ticket) => {
  //    setSelectedTicket(ticket);
  //    setIsViewModalOpen(true);
  // };

  // Pass the onEdit and onDelete callbacks down to TicketTableActions


  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Entrega</TableHead>
            {showUserColumn && <TableHead>Usuario</TableHead>}
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.title}</TableCell>
              <TableCell>{ticket.priority}</TableCell>
              <TableCell><Badge variant={statusBadgeVariant(ticket.status)}>{ticket.status}</Badge></TableCell>
              <TableCell>{format(new Date(ticket.dueDate), "dd/MM/yyyy", { locale: es })}</TableCell>
              {showUserColumn && <TableCell>{ticket.userId}</TableCell>}
              <TableCell className="text-right">
                {/* Pass onEdit and onDelete from props to TicketTableActions */}
                <TicketTableActions 
                  ticket={ticket} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                  onView={onView} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

       {/* 
        Removed modal rendering from here. 
        Modals for editing and viewing are now managed in the parent component (tickets/page.tsx).
       */}

    </div>
  )
}
