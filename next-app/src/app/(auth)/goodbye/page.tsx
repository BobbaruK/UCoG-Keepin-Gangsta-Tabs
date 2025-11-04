import { CustomButton } from "@/components/custom-button";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Goodbye",
};

const GoodByePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(DEFAULT_LOGIN_REDIRECT);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Goodbye 👋</h1>
        <p className="text-muted-foreground text-balance">
          Your account has been successfully deleted. We&apos;re sorry to see
          you go, but we hope to cross paths again in the future.
        </p>
        <p className="text-muted-foreground text-balance">
          If you change your mind, you can always create a new account anytime.
        </p>
        <CustomButton
          buttonLabel="Return to Homepage"
          linkHref="/"
          variant={"outline"}
          skeletonClassName="w-[167px] mx-auto"
        />
      </div>
    </div>
  );
};

export default GoodByePage;
