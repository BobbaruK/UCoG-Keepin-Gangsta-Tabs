import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import EditSideEffectForm from "@/features/side-effects/components/forms/edit";
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

  return {
    title: `Edit ${sideEffect?.name}`,
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
        <PageTitle
          label={"unknown"}
          backBtnHref={`${sideEffectsTitle.href}/${id}`}
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

      <Card>
        <CardContent>
          <EditSideEffectForm sideEffect={sideEffect} />
        </CardContent>
      </Card>
    </PageStructure>
  );
};

export default SideEffectEditPage;
