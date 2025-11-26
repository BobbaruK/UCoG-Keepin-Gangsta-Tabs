import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getLaws } from "@/features/laws/data/get-laws";
import EditPlaythroughFormWrapper from "@/features/playthroughs/components/edit-playthrough-form-wrapper";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import { getPlaythrough } from "@/features/playthroughs/data/get";
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

  if (!playthrough)
    return {
      title: `Edit ${playthroughTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${playthroughTitle.label.singular.toLowerCase()}: "${playthrough.name}"`,
  };
}

const EditPlaythroughPage = async ({ params }: Props) => {
  const id = (await params).playthroughId;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(id);

  if (!playthrough) return <PlaythroughError session={session} />;

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
            label: playthrough.name,
          },
          {
            label: `Edit ${playthroughTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${playthrough.name}"`}
        backBtnHref={`${playthroughTitle.href}/${id}`}
        session={session}
      />

      <EditPlaythroughFormWrapper playthrough={playthrough} laws={laws?.data} />

      {/* <EditPlaythroughForm playthrough={playthrough} laws={laws?.data} /> */}

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditPlaythroughPage;
