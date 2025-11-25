import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/laws/components/form-card-wrapper";
import EditLawForm from "@/features/laws/components/form/edit";
import { getLaw } from "@/features/laws/data/get-laws";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
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

  const law = await getLaw(id);

  if (!law) return { title: "Unknown" };

  return {
    title: `Edit ${law.name}`,
  };
}

const EditLawPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${lawsTitle.href}/${id}`, session });

  const law = await getLaw(id);

  const sideEffects = await getSideEffects({});

  if (!law)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: lawsTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(lawsTitle.label.plural.toLowerCase()),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"unknown"}
          backBtnHref={lawsTitle.href}
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
            href: lawsTitle.href,
            label: capitalizeFirstLetter(lawsTitle.label.plural.toLowerCase()),
          },
          {
            href: `${lawsTitle.href}/${id}`,
            label: law.name,
          },
          {
            label: `Edit ${lawsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${law.name}"`}
        backBtnHref={`${lawsTitle.href}/${id}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          law,
          sideEffects: sideEffects?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditLawPage;
