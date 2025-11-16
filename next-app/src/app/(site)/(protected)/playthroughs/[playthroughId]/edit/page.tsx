import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getLaws } from "@/features/laws/data/get-laws";
import EditPlaythroughForm from "@/features/playtroughs/components/form/edit";
import { getPlaythrough } from "@/features/playtroughs/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).playthroughId;

  const playthrough = await getPlaythrough(id);

  return {
    title: `Edit ${playthrough?.name}`,
  };
}

const EditLawPage = async ({ params }: Props) => {
  const id = (await params).playthroughId;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(id);

  if (!playthrough)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={`/${playthroughTitle.href}`}
          session={session}
        />
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

  const laws = await getLaws();

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: playthroughTitle.href,
            label: capitalizeFirstLetter(
              playthroughTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${id}`,
            label: `Edit "${playthrough.name}"`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${playthrough.name}"`}
        backBtnHref={`${playthroughTitle.href}/${id}`}
        session={session}
      />

      <EditPlaythroughForm playthrough={playthrough} laws={laws?.data} />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditLawPage;
