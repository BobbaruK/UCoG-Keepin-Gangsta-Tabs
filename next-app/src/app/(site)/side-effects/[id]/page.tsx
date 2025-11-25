import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import SideEffectPresentation from "@/features/side-effects/components/side-effect-presentation";
import { getSideEffect } from "@/features/side-effects/data/get-side-effects";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const sideEffect = await getSideEffect(id);

  if (!sideEffect)
    return {
      title: `${capitalizeFirstLetter(
        sideEffectsTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      sideEffectsTitle.label.singular.toLowerCase(),
    )}: "${sideEffect.name}"`,
  };
}

const SideEffectPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sideEffect = await getSideEffect(id);

  if (!sideEffect)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: sideEffectsTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  sideEffectsTitle.label.plural.toLowerCase(),
                ),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={sideEffectsTitle.href}
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
            href: sideEffectsTitle.href,
            label: capitalizeFirstLetter(sideEffectsTitle.label.plural),
          },
          {
            href: `${sideEffectsTitle.href}/${id}`,
            label: sideEffect.name,
          },
        ])}
      />
      <PageTitle
        label={sideEffect.name}
        backBtnHref={sideEffectsTitle.href}
        editBtnHref={`${sideEffectsTitle.href}/${id}/edit`}
        session={session}
      />

      <SideEffectPresentation sideEffect={sideEffect} />

      <div>TODO: tables here - trait, law, captain</div>

      {/* <div>
        <pre>{JSON.stringify({ sideEffect }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default SideEffectPage;
