import SignUpForm from "@/components/auth/sign-up-form";
import H1 from "@/components/h1";
import Logo from "@/components/logo";
import PageWrapper from "@/components/page-wrapper";
import Link from "next/link";
import React from "react";

type SignUpPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  const invite = searchParams.invite || "";
  const callbackUrl = searchParams.callbackUrl || "";
  const logInUrl =
    invite !== "" && callbackUrl !== ""
      ? `/login?invite=${invite}&callbackUrl=${callbackUrl}`
      : "/login";
  return (
    <main>
      <PageWrapper>
        <div>
          <Logo className="text-center mb-8" />
        </div>
        <H1 className="text-center mb-5">Sign Up</H1>
        <SignUpForm />
        <p className="mt-6 text-sm text-zinc-500 text-center">
          Already have an account?{" "}
          <Link href={logInUrl} className="font-bold">
            Log in
          </Link>
        </p>
      </PageWrapper>
    </main>
  );
}
