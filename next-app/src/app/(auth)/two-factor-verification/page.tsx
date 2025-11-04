import { PageStructure } from "@/components/page-structure";
import { loadSearchParams } from "@/components/search-params";
import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/constants/messages";
import { COOKIE_PREFIX } from "@/constants/misc";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { AuthCard } from "@/core/auth/components/auth-card";
import OTPVerificationForm from "@/core/auth/components/forms/otp-verification";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Two factor verification",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const TwoFactorVerificationPage = async ({ searchParams }: Props) => {
  const { twoFactor, twoFactorFirstTime } =
    await loadSearchParams(searchParams);
  const cookieStore = await cookies();
  const twoFactorCookie = cookieStore.get(`${COOKIE_PREFIX}.two_factor`);
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && !twoFactorFirstTime) redirect(DEFAULT_LOGIN_REDIRECT);

  if (!twoFactorCookie && !twoFactorFirstTime) redirect("/login");

  return (
    <PageStructure>
      <AuthCard
        title={"2FA Verification"}
        description={twoFactorFirstTime ? MESSAGES.QR_SCAN : MESSAGES.ENTER_OTP}
      >
        <OTPVerificationForm
          otpLink={twoFactor || ""}
          isFirstTime={twoFactorFirstTime}
        />

        <div className="flex flex-wrap items-center gap-1">
          <p className="text-muted-foreground text-sm">
            You can recover your account
          </p>
          <Button
            size={"sm"}
            variant={"link"}
            asChild
            className="text-foreground px-0 font-normal"
          >
            <Link href={"/recover-account"}>here</Link>
          </Button>
        </div>
      </AuthCard>
    </PageStructure>
  );
};

export default TwoFactorVerificationPage;
