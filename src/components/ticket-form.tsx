'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Ticket, TicketFormData, Priority, Status } from '@/types';
import { PRIORITIES, STATUSES } from '@/lib/constants';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ticketFormSchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }).max(100, { message: 'El título no puede exceder los 100 caracteres.' }),
  description: z.string().max(500, { message: 'La descripción no puede exceder los 500 caracteres.' }).optional(),
  priority: z.enum(PRIORITIES.map(p => p.value) as [Priority, ...Priority[]], { required_error: 'La prioridad es requerida.' }),
  status: z.enum(STATUSES.map(s => s.value) as [Status, ...Status[]], { required_error: 'El estado es requerido.' }),
  dueDate: z.date({ required_error: 'La fecha de entrega es requerida.' }),
});

interface TicketFormProps {
  initialData?: Ticket;
  onSubmitSuccess?: (ticket: Ticket) => void; // Callback on successful submission
  onCancel?: () => void;
  isEditing?: boolean;
}

export function TicketForm({ initialData, onSubmitSuccess, onCancel, isEditing = false }: TicketFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          priority: initialData.priority,
          status: initialData.status,
          dueDate: new Date(initialData.dueDate),
        }
      : {
          title: '',
          description: '',
          priority: 'MEDIA',
          status: 'PENDIENTE',
          dueDate: new Date(),
        },
  });

  async function onSubmit(data: TicketFormData) {
    setIsLoading(true);
    console.log('Ticket data submitted:', data);
    // Here you would typically call a server action or API endpoint
    // For example:
    // if (isEditing && initialData) {
    //   await updateTicketAction({ ...initialData, ...data });
    // } else {
    //   await createTicketAction(data);
    // }

    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    const submittedTicket: Ticket = {
      id: initialData?.id || crypto.randomUUID(),
      userId: initialData?.userId || 'mockUserId', // Replace with actual user ID
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
      ...data,
    };

    toast({
      title: isEditing ? 'Ticket Actualizado' : 'Ticket Creado',
      description: `El ticket "${submittedTicket.title}" ha sido ${isEditing ? 'actualizado' : 'creado'} exitosamente.`,
    });
    
    onSubmitSuccess?.(submittedTicket);
    setIsLoading(false);
    if (!isEditing) form.reset(); // Reset form only if creating new
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Revisar diseño de landing page" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Añade detalles sobre el ticket..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITIES.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Entrega</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()-1)) } // Disable past dates
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
                 <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
            )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Ticket')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
