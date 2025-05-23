import type { User as FirebaseUser } from 'firebase/auth'; // Will be used when Firebase is fully integrated

export interface User extends Partial<FirebaseUser> { // Allow extending FirebaseUser
  id?: string; // Or uid from FirebaseUser
  // email?: string | null;
  // displayName?: string | null;
  // photoURL?: string | null;
  isAdmin?: boolean;
}

export type Priority = 'BAJA' | 'MEDIA' | 'ALTA';
export type Status = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: Date; // Or Timestamp for Firebase
  createdAt: Date; // Or Timestamp
  updatedAt: Date; // Or Timestamp
  userId: string;
}

// For form data
export interface TicketFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
}
