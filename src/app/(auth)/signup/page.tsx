import SignupForm from "@/components/auth/signup/SignupForm";
import Image from "next/image";

const page = () => {
  return (
    <section className="grid min-h-svh px-8 lg:grid-cols-2 lg:p-3">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[350px]">
          <SignupForm />
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          width={800}
          height={600}
          src="/placeholder.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full rounded-4xl object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </section>
  );
};

export default page;
