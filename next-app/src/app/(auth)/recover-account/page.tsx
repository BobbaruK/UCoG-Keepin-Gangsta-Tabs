import { PageStructure } from "@/components/page-structure";
import { COOKIE_PREFIX } from "@/constants/misc";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { AuthCard } from "@/core/auth/components/auth-card";
import { RecoverAccountForm } from "@/core/auth/components/forms/recover-account";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Recover account",
};

const RecoverAccountPage = async () => {
  const cookieStore = await cookies();
  const twoFactorCookie = cookieStore.get(`${COOKIE_PREFIX}.two_factor`);
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect(DEFAULT_LOGIN_REDIRECT);

  if (!twoFactorCookie) redirect("/login");
  return (
    <PageStructure>
      <AuthCard title={"Recover account"} description={"Enter your code"}>
        <RecoverAccountForm />
      </AuthCard>
    </PageStructure>
  );
};

export default RecoverAccountPage;
