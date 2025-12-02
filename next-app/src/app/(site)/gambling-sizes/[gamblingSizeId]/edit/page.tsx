import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { gamblingSizeTitle } from "@/constants/page-title/gambling-size";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/gambling-sizes/components/form-card-wrapper";
import { getGamblingSize } from "@/features/gambling-sizes/data/get-gambling-sizes";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    gamblingSizeId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gamblingSizeId } = await params;

  const gamblingSize = await getGamblingSize(gamblingSizeId);

  if (!gamblingSize)
    return {
      title: `Edit ${gamblingSizeTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${gamblingSizeTitle.label.singular.toLowerCase()}: "${gamblingSize.name}"`,
  };
}

const EditLawPage = async ({ params }: Props) => {
  const { gamblingSizeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({
    to: `${gamblingSizeTitle.href}/${gamblingSizeId}`,
    session,
  });

  const gamblingSize = await getGamblingSize(gamblingSizeId);

  if (!gamblingSize)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: gamblingSizeTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  gamblingSizeTitle.label.plural.toLowerCase(),
                ),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"unknown"}
          backBtnHref={gamblingSizeTitle.href}
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
            href: gamblingSizeTitle.href,
            label: capitalizeFirstLetter(
              gamblingSizeTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${gamblingSizeTitle.href}/${gamblingSizeId}`,
            label: gamblingSize.name,
          },
          {
            label: `Edit ${gamblingSizeTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${gamblingSize.name}"`}
        backBtnHref={`${gamblingSizeTitle.href}/${gamblingSizeId}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          gamblingSize,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditLawPage;
