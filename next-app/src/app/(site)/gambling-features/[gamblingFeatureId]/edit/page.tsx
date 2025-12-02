import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/gambling-features/components/form-card-wrapper";
import { getGamblingFeature } from "@/features/gambling-features/data/get-gambling-features";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    gamblingFeatureId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gamblingFeatureId } = await params;

  const gamblingFeature = await getGamblingFeature(gamblingFeatureId);

  if (!gamblingFeature)
    return {
      title: `Edit ${gamblingFeatureTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${gamblingFeatureTitle.label.singular.toLowerCase()}: "${gamblingFeature.name}"`,
  };
}

const EditLawPage = async ({ params }: Props) => {
  const { gamblingFeatureId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({
    to: `${gamblingFeatureTitle.href}/${gamblingFeatureId}`,
    session,
  });

  const gamblingFeature = await getGamblingFeature(gamblingFeatureId);

  if (!gamblingFeature)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: gamblingFeatureTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  gamblingFeatureTitle.label.plural.toLowerCase(),
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
          backBtnHref={gamblingFeatureTitle.href}
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
            href: gamblingFeatureTitle.href,
            label: capitalizeFirstLetter(
              gamblingFeatureTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${gamblingFeatureTitle.href}/${gamblingFeatureId}`,
            label: gamblingFeature.name,
          },
          {
            label: `Edit ${gamblingFeatureTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${gamblingFeature.name}"`}
        backBtnHref={`${gamblingFeatureTitle.href}/${gamblingFeatureId}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          gamblingFeature: gamblingFeature,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditLawPage;
