import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { traitsTitle } from "@/constants/page-title/traits";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
import FormCardWrapper from "@/features/traits/components/form-card-wrapper";
import { getTrait } from "@/features/traits/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
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

  if (!trait)
    return {
      title: `Edit ${traitsTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${traitsTitle.label.singular.toLowerCase()}: "${trait.name}"`,
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
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: traitsTitle.href,
              label: capitalizeFirstLetter(
                traitsTitle.label.plural.toLowerCase(),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={traitsTitle.href}
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
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: traitsTitle.href,
            label: capitalizeFirstLetter(
              traitsTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${traitsTitle.href}/${id}`,
            label: trait.name,
          },
          {
            label: `Edit ${traitsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${trait.name}"`}
        backBtnHref={`${traitsTitle.href}/${id}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          sideEffects: sideEffects?.data,
          trait,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default TraitEditPage;
