
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthContext } from '@/components/providers/auth-provider';
import { AppLogo } from '@/components/app-logo';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un email válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSignupRedirect, setShowSignupRedirect] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setApiError(null);
    setShowSignupRedirect(false);
    try {
      await login(data.email, data.password);
      // La redirección a /admin/dashboard o /dashboard es manejada por src/app/page.tsx
      // o (app)/layout.tsx una vez que el AuthContext se actualiza.
      // Aquí, solo nos aseguramos de que el usuario vaya a una ruta post-login.
      router.push('/dashboard');
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        setApiError('Este correo no está registrado.');
        setShowSignupRedirect(true);
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        // Nota: auth/invalid-credential puede ser devuelto para ambos casos en versiones recientes de Firebase SDK
        // para prevenir la enumeración de usuarios. Si es así, un mensaje genérico como "Credenciales incorrectas" podría ser mejor.
        setApiError('Contraseña incorrecta.');
      } else {
        setApiError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
        // El AuthProvider ya muestra un toast con el error de Firebase si está disponible.
        console.error("Login error:", error.message, "Code:", error.code);
      }
    }
    // No es necesario setIsLoading(false) aquí después de un router.push exitoso,
    // ya que el componente se desmontará. Ya se maneja en el bloque catch.
  }

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4">
          <AppLogo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Trackit Dashboard</CardTitle>
        <CardDescription>Ingresa a tu cuenta para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {apiError && (
              <p className="text-sm font-medium text-destructive text-center">{apiError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
            {showSignupRedirect && (
              <Button variant="outline" className="w-full" onClick={() => router.push('/signup')} disabled={isLoading}>
                Ir a Registrarse
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
