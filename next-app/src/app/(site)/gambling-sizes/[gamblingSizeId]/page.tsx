import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { gamblingSizeTitle } from "@/constants/page-title/gambling-size";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import GamblingSizePresentation from "@/features/gambling-sizes/components/gambling-size-presentation";
import { getGamblingSize } from "@/features/gambling-sizes/data/get-gambling-sizes";
import LawPresentation from "@/features/laws/components/law-presentation";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
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
      title: `${capitalizeFirstLetter(
        gamblingSizeTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      gamblingSizeTitle.label.singular.toLowerCase(),
    )}: "${gamblingSize.name}"`,
  };
}

const GamblingSizePage = async ({ params }: Props) => {
  const { gamblingSizeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
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
            label: capitalizeFirstLetter(gamblingSizeTitle.label.plural),
          },
          {
            href: `${gamblingSizeTitle.href}/${gamblingSizeId}`,
            label: gamblingSize.name,
          },
        ])}
      />

      <PageTitle
        label={gamblingSize.name}
        backBtnHref={gamblingSizeTitle.href}
        editBtnHref={`${gamblingSizeTitle.href}/${gamblingSizeId}/edit`}
        session={session}
      />

      <GamblingSizePresentation gamblingSize={gamblingSize} />
    </PageStructure>
  );
};

export default GamblingSizePage;
