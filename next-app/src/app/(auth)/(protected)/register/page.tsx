import { PageStructure } from "@/components/page-structure";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/core/auth/components/auth-card";
import { SignUpForm } from "@/core/auth/components/forms/sign-up";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
};

const RegisterPage = () => {
  return (
    <PageStructure>
      <AuthCard
        title={"Create an account"}
        description={"Create a new account by filling out the form below."}
      >
        <SignUpForm />

        <div className="flex flex-wrap items-center gap-1">
          <p className="text-muted-foreground text-sm">
            Already have an account.
          </p>
          <Button
            size={"sm"}
            variant={"link"}
            asChild
            className="text-foreground px-0 font-normal"
          >
            <Link href={"/login"}>Login</Link>
          </Button>
        </div>
      </AuthCard>
    </PageStructure>
  );
};

export default RegisterPage;
