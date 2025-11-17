import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/forms/form';
import { Input } from '@/components/ui/forms/input';
import { LoginSchema } from '@/lib/validation/validation';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/forms/passwordInput';

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // TODO: Kig på reset password + husk disabled if is loading + create route and hook (useAuth)

  return (
    <Form {...form}>
      <form>
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
                <Input type="email" autoComplete="email" {...field} />
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
                <PasswordInput
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <div className="relative">
                <FormMessage />
                {/* <ResetPassword /> */}
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default LoginForm;
