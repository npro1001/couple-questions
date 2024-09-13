import LogInForm from "@/components/auth/log-in-form";
import H1 from "@/components/h1";
import Logo from "@/components/logo";
import Link from "next/link";

export default function LogInPage() {
  return (
    <main>
      <div>
        <Logo className="text-center mb-8" />
      </div>
      <H1 className="text-center mb-5">Log In</H1>
      <LogInForm />
      <p className="mt-6 text-sm text-zinc-500 text-center">
        Already have an account?{" "}
        <Link href="/signup" className="font-bold">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
