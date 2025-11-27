import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getLaws } from "@/features/laws/data/get-laws";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPresentation from "@/features/playthroughs/components/playthrough-presentation";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { getPoliceOfficer } from "@/features/police-officers/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
    policeOfficerId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { policeOfficerId, playthroughId } = await params;

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) {
    return {
      title: `${capitalizeFirstLetter(
        playthroughTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };
  }

  const policeOfficer = await getPoliceOfficer(policeOfficerId);

  if (!policeOfficer) {
    return {
      title: `${capitalizeFirstLetter(
        policeOfficersTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };
  }

  return {
    title: `${capitalizeFirstLetter(
      policeOfficersTitle.label.singular.toLowerCase(),
    )}: "${policeOfficer.name}"`,
  };
}

const PoliceOfficerPage = async ({ params }: Props) => {
  const { playthroughId, policeOfficerId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  const policeOfficer = await getPoliceOfficer(policeOfficerId);

  if (!policeOfficer)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: playthroughTitle.href,
              label: capitalizeFirstLetter(playthroughTitle.label.plural),
            },
            {
              href: `${playthroughTitle.href}/${playthroughId}`,
              label: playthrough.name,
            },
            {
              href: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
              label: capitalizeFirstLetter(
                policeOfficersTitle.label.plural.toLowerCase(),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={`${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`}
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
            label: capitalizeFirstLetter(playthroughTitle.label.plural),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId}`,
            label: playthrough.name,
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
            label: capitalizeFirstLetter(
              policeOfficersTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}/${policeOfficer.id}`,
            label: policeOfficer.name,
          },
        ])}
      />
      <PageTitle
        label={policeOfficer.name}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`}
        editBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}/${policeOfficer.id}/edit`
            : undefined
        }
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPresentation
        type="default"
        playthrough={playthrough}
        laws={laws?.data}
      />

      <div>
        <pre>{JSON.stringify(policeOfficer, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default PoliceOfficerPage;
