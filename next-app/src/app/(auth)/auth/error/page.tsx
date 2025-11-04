import { CustomButton } from "@/components/custom-button";
import { ErrorIcon } from "@/components/icons/error";
import { PageStructure } from "@/components/page-structure";
import { AuthCard } from "@/core/auth/components/auth-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication error",
};

interface Props {
  searchParams: Promise<{
    error: string;
    error_description: string;
  }>;
}

const AuthErrorPage = async ({ searchParams }: Props) => {
  const error = (await searchParams).error;
  const error_description = (await searchParams).error_description;

  let message = "";

  switch (error) {
    case "unable_to_create_user":
      message = "We couldn't create your account.";
      break;
    case "please_restart_the_process":
      message = "The login process has expired. Please try again.";
      break;
    case "banned":
      message =
        "You have been banned from this application. Please contact support if you believe this is an error.";
      break;
    case "email_doesn't_match":
      message = "You cannot link accounts with different emails.";
      break;
    default:
      message = "An authentication error occurred.";
  }

  return (
    <PageStructure>
      <AuthCard
        title={"Something went wrong!"}
        description={`Error: ${error}`}
        showFooter={false}
      >
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <ErrorIcon size={40} className="text-destructive" />
          <p className="text-center text-balance">
            {error_description || message}
          </p>
        </div>
        <CustomButton
          buttonLabel="Back to Home"
          linkHref="/"
          className="w-full"
          variant={"outline"}
          skeletonClassName="w-full"
        />
      </AuthCard>
    </PageStructure>
  );
};

export default AuthErrorPage;
