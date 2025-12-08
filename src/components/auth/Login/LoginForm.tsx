import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { loginSchema, LoginSchema } from "@/lib/validation/validation";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/ui/forms/passwordInput";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button/button";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = () => {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  // TODO: Kig på reset password + husk disabled if is loading + create route and hook (useAuth)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-muted-foreground text-sm">
            Log in to your account
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  {...field}
                  disabled={isLoading}
                />
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
                  disabled={isLoading}
                />
              </FormControl>
              <div className="relative">
                <FormMessage />
                {/* <ResetPassword /> */}
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          Login
        </Button>

        <div className="flex justify-center gap-2 text-center text-sm">
          <p>Dont have an account?</p>
          <a href="/signup" className="underline underline-offset-4">
            Signup
          </a>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
