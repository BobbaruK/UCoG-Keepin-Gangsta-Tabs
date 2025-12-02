import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import GamblingFeaturePresentation from "@/features/gambling-features/components/gambling-feature-presentation";
import { getGamblingFeature } from "@/features/gambling-features/data/get-gambling-features";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
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
      title: `${capitalizeFirstLetter(
        gamblingFeatureTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      gamblingFeatureTitle.label.singular.toLowerCase(),
    )}: "${gamblingFeature.name}"`,
  };
}

const GamblingSizePage = async ({ params }: Props) => {
  const { gamblingFeatureId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
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
            label: capitalizeFirstLetter(gamblingFeatureTitle.label.plural),
          },
          {
            href: `${gamblingFeatureTitle.href}/${gamblingFeatureId}`,
            label: gamblingFeature.name,
          },
        ])}
      />

      <PageTitle
        label={gamblingFeature.name}
        backBtnHref={gamblingFeatureTitle.href}
        editBtnHref={`${gamblingFeatureTitle.href}/${gamblingFeatureId}/edit`}
        session={session}
      />

      <GamblingFeaturePresentation gamblingFeature={gamblingFeature} />
    </PageStructure>
  );
};

export default GamblingSizePage;
