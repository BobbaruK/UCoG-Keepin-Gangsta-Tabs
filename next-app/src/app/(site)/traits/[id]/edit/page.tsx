import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { traitsTitle } from "@/constants/page-title/traits";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
import EditTraitForm from "@/features/traits/components/forms/edit-trait";
import { getTrait } from "@/features/traits/data/get-traits";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const trait = await getTrait(id);

  return {
    title: `Edit ${trait?.name}`,
  };
}

const TraitEditPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${traitsTitle.href}/${id}`, session });

  const trait = await getTrait(id);

  const sideEffects = await getSideEffects({});

  if (!trait)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={`/${traitsTitle.href}`}
          session={session}
        />
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

  return (
    <PageStructure>
      <PageTitle
        label={`Edit "${trait.name}"`}
        backBtnHref={`${traitsTitle.href}/${id}`}
        session={session}
      />

      <EditTraitForm trait={trait} sideEffects={sideEffects?.data} />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default TraitEditPage;
