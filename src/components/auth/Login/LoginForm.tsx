import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/forms/form';
import { Input } from '@/components/ui/forms/input';
import { loginSchema, LoginSchema } from '@/lib/validation/validation';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/forms/passwordInput';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button/button';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginForm = () => {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  // TODO: Kig på reset password + husk disabled if is loading + create route and hook (useAuth)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section>
          <h1>Login</h1>
          <p>Log in to your account</p>
        </section>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} disabled={isLoading} />
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
              <FormLabel>Adgangskode</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="current-password" {...field} disabled={isLoading} />
              </FormControl>
              <div className="relative">
                <FormMessage />
                {/* <ResetPassword /> */}
              </div>
            </FormItem>
          )}
        />

        <div className="pt-4 flex flex-col gap-4">
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
