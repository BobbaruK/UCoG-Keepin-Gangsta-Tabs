import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/side-effects/components/form-card-wrapper";
import { getSideEffect } from "@/features/side-effects/data/get-side-effects";
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

  const sideEffect = await getSideEffect(id);

  if (!sideEffect)
    return {
      title: `Edit ${sideEffectsTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${sideEffectsTitle.label.singular.toLowerCase()}: "${sideEffect.name}"`,
  };
}

const SideEffectEditPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${sideEffectsTitle.href}/${id}`, session });

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
            label: capitalizeFirstLetter(
              sideEffectsTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${sideEffectsTitle.href}/${id}`,
            label: sideEffect.name,
          },
          {
            label: `Edit ${sideEffectsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${sideEffect.name}"`}
        backBtnHref={`${sideEffectsTitle.href}/${id}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          sideEffect,
        }}
      />
    </PageStructure>
  );
};

export default SideEffectEditPage;
