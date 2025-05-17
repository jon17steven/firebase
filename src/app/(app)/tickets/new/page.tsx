'use client';

import { TicketForm } from '@/components/ticket-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function NewTicketPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/tickets'); // Redirect to tickets list after creation
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">Crear Nuevo Ticket</h1>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Detalles del Ticket</CardTitle>
          <CardDescription>Completa la información para crear un nuevo ticket.</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketForm onSubmitSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </>
  );
}
