import { CustomAlert } from "@/components/custom-alert";
import { EnvelopeIcon } from "@/components/icons/envelope";
import { PageStructure } from "@/components/page-structure";
import { MESSAGES } from "@/constants/messages";
import { getUser } from "@/core/user/data/get-user";
import SettingsContent from "@/features/settings/components/settings-content";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Settings",
};

const SettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return (
      /**
       * It'll never hit this.
       * Is good for ts
       */
      <PageStructure>
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.SESSION_EXPIRED}
          variant="danger"
        />
      </PageStructure>
    );

  const user = await getUser({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return (
      <PageStructure>
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.USER_NOT_EXIST}
          variant="danger"
        />
      </PageStructure>
    );

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  return (
    <PageStructure>
      {!user.emailVerified && (
        <CustomAlert
          title={"Warning!"}
          icon={<EnvelopeIcon />}
          description={"Please confirm your new email address."}
          variant="warning"
        />
      )}

      <SettingsContent user={user} accounts={accounts} />
    </PageStructure>
  );
};

export default SettingsPage;
