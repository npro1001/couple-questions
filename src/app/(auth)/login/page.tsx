import LogInForm from "@/components/auth/log-in-form";
import H1 from "@/components/h1";
import Logo from "@/components/logo";
import PageWrapper from "@/components/page-wrapper";
import Link from "next/link";

type LogInPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function LogInPage({ searchParams }: LogInPageProps) {
  const invite = searchParams.invite || "";
  const callbackUrl = searchParams.callbackUrl || "";
  const signUpUrl =
    invite !== "" && callbackUrl !== ""
      ? `/signup?invite=${invite}&callbackUrl=${callbackUrl}`
      : "/signup";

  return (
    <main>
      <PageWrapper>
        <div>
          <Logo className="text-center mb-8" />
        </div>
        <H1 className="text-center mb-5">Log In</H1>
        <LogInForm />
        <p className="mt-6 text-sm text-zinc-500 text-center">
          Already have an account?{" "}
          <Link href={signUpUrl} className="font-bold">
            Sign Up
          </Link>
        </p>
      </PageWrapper>
    </main>
  );
}
