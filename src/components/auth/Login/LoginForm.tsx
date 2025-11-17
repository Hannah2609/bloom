import { Form } from '@/components/ui/forms/form';
import { useForm } from 'react-hook-form';

const LoginForm = () => {
    const form = useForm<LoginSchema>({
      defaultValues: {
        email: '',
        password: '',
      }, 
    });
  return (
    <Form>
      <form action=""></form>
    </Form>
  );
};

export default LoginForm;
