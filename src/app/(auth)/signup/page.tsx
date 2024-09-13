import SignUpForm from "@/components/auth/sign-up-form";
import H1 from "@/components/h1";
import Logo from "@/components/logo";
import Link from "next/link";
import React from "react";

export default function SignUpPage() {
  return (
    <main>
      <div>
        <Logo className="text-center mb-8" />
      </div>
      <H1 className="text-center mb-5">Sign Up</H1>
      <SignUpForm />
      <p className="mt-6 text-sm text-zinc-500 text-center">
        Already have an account?{" "}
        <Link href="/login" className="font-bold">
          Log in
        </Link>
      </p>
    </main>
  );
}
