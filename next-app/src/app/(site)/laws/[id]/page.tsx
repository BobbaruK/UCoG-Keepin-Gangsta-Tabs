import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import LawPresentation from "@/features/laws/components/law-presentation";
import { getLaw } from "@/features/laws/data/get-laws";
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

  const law = await getLaw(id);

  if (!law)
    return {
      title: `${capitalizeFirstLetter(
        lawsTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      lawsTitle.label.singular.toLowerCase(),
    )}: "${law.name}"`,
  };
}

const LawPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const law = await getLaw(id);

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
            label: capitalizeFirstLetter(lawsTitle.label.plural),
          },
          {
            href: `${lawsTitle.href}/${id}`,
            label: law.name,
          },
        ])}
      />
      <PageTitle
        label={law.name}
        backBtnHref={lawsTitle.href}
        editBtnHref={`${lawsTitle.href}/${id}/edit`}
        session={session}
      />

      <LawPresentation law={law} />

      <div>TODO: tables here - playthrough</div>
    </PageStructure>
  );
};

export default LawPage;
