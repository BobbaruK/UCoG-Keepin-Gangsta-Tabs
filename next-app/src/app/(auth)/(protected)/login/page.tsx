import { PageStructure } from "@/components/page-structure";
import TextSeparator from "@/components/text-separator";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/core/auth/components/auth-card";
import { SignInForm } from "@/core/auth/components/forms/sign-in";
import SignInMagicLink from "@/core/auth/components/sign-in-magic-link";
import SignInProviders from "@/core/auth/components/sign-in-providers";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = async () => {
  return (
    <PageStructure>
      <AuthCard
        title={"Welcome back"}
        description={"Login with your credentials"}
      >
        <SignInForm />

        <div className="flex flex-wrap items-center gap-1">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account.
          </p>
          <Button
            size={"sm"}
            variant={"link"}
            asChild
            className="text-foreground px-0 font-normal"
          >
            <Link href={"/register"}>Register</Link>
          </Button>
        </div>

        <TextSeparator label="Or continue with" />

        <SignInProviders />

        <TextSeparator label="OR" />

        <SignInMagicLink />
      </AuthCard>
    </PageStructure>
  );
};

export default LoginPage;
