import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { traitsTitle } from "@/constants/page-title/traits";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import TraitPresentation from "@/features/traits/components/trait-presentation";
import { getTrait } from "@/features/traits/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
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
      title: `${capitalizeFirstLetter(
        traitsTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      traitsTitle.label.singular.toLowerCase(),
    )}: "${trait.name}"`,
  };
}

const TraitPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const trait = await getTrait(id);

  if (!trait)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: traitsTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(traitsTitle.label.plural.toLowerCase()),
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
            label: capitalizeFirstLetter(traitsTitle.label.plural),
          },
          {
            href: `${traitsTitle.href}/${id}`,
            label: trait.name,
          },
        ])}
      />

      <PageTitle
        label={trait.name}
        backBtnHref={traitsTitle.href}
        editBtnHref={`${traitsTitle.href}/${id}/edit`}
        session={session}
      />

      <TraitPresentation trait={trait} />

      <div>TODO: tables here - political_style, crew_member</div>
    </PageStructure>
  );
};

export default TraitPage;
