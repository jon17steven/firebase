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
import type { Ticket } from "@/types"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

// Import Firebase Firestore functions
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

interface TicketTableActionsProps {
  ticket: Ticket
  onEdit: (ticket: Ticket) => void
  onDelete: (ticketId: string) => void
  onView?: (ticket: Ticket) => void // Optional view action
}

export function TicketTableActions({ ticket, onEdit, onDelete, onView }: TicketTableActionsProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete the ticket from Firestore
      const ticketRef = doc(db, "tickets", ticket.id);
      await deleteDoc(ticketRef);

      // Notify the parent component and show success toast
      onDelete(ticket.id);
      toast({
        title: "Ticket Eliminado",
        description: `El ticket "${ticket.title}" ha sido eliminado.`,
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Error al eliminar ticket",
        description: "Hubo un problema al eliminar el ticket.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {onView && (
            <DropdownMenuItem onClick={() => onView(ticket)}>
              <Eye className="mr-2 h-4 w-4" /> Ver Detalles
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onEdit(ticket)}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el ticket <span className="font-semibold">"{ticket.title}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
