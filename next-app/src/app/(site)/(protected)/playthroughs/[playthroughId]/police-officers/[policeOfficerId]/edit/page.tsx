import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { redirectNonOwnerUsers } from "@/core/admin/lib/redirect-non-owner-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { redirectPlaythroughFinished } from "@/core/cog/playthrough/utils/redirect-playthrough-finished";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import FormCardWrapper from "@/features/police-officers/components/form-card-wrapper";
import { getPoliceOfficer } from "@/features/police-officers/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
      title: `Edit ${policeOfficersTitle.label.singular.toLowerCase()}: "Unknown"`,
    };
  }

  return {
    title: `Edit ${policeOfficersTitle.label.singular.toLowerCase()}: "${policeOfficer.name}"`,
  };
}

const EditCrewMemberPage = async ({ params }: Props) => {
  const { policeOfficerId, playthroughId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  redirectNonOwnerUsers({
    isOwner: session?.user.id === playthrough.auth_userId,
    to: `${playthroughTitle.href}/${playthrough.id + policeOfficersTitle.href}/${policeOfficerId}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + policeOfficersTitle.href}/${policeOfficerId}`,
  });

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
          {
            href: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}/${policeOfficer.id}/edit`,
            label: `Edit ${policeOfficersTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${policeOfficer.name}"`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}/${policeOfficer.id}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <FormCardWrapper
        data={{
          type: "edit",
          policeOfficer,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify(crewMember, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditCrewMemberPage;
