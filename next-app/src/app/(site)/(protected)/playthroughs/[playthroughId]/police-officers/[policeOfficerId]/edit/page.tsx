import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getCaptainRoles } from "@/features/captain-roles/data/get";
import { getCrewLevels } from "@/features/crew-levels/data/get";
import EditMemberMultiStep from "@/features/crew-members/components/edit-member-multistep";
import { getCrewMember } from "@/features/crew-members/data/get";
import { getNationalities } from "@/features/nationalities/data/get-nationalities";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import EditPoliceOfficerForm from "@/features/police-officers/components/form/edit";
import { getPoliceOfficer } from "@/features/police-officers/data/get";
import { getTraits } from "@/features/traits/data/get";
import { auth } from "@/lib/auth";
import { setFullName } from "@/lib/utils/full-name";
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
      title: "Error",
    };
  }

  const policeOfficer = await getPoliceOfficer(policeOfficerId);

  if (!policeOfficer) {
    return {
      title: "Error",
    };
  }

  return {
    title: policeOfficer.name,
  };
}

const EditCrewMemberPage = async ({ params }: Props) => {
  const { policeOfficerId, playthroughId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (playthrough?.is_finished)
    redirect(
      `${playthroughTitle.href}/${playthrough.id + policeOfficersTitle.href}/${policeOfficerId}`,
    );

  if (!playthrough)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={playthroughTitle.href}
          session={session}
        />
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

  const policeOfficer = await getPoliceOfficer(policeOfficerId);

  if (!policeOfficer)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={policeOfficersTitle.href}
          session={session}
        />
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

  const roles = await getCaptainRoles();
  const nationalities = await getNationalities();
  const traits = await getTraits();
  const levels = await getCrewLevels();

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
            href: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}/${policeOfficer.id}/edit`,
            label: `Edit "${policeOfficer.name}"`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${policeOfficer.name}"`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}/${policeOfficer.id}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <Card>
        <CardContent>
          <EditPoliceOfficerForm policeOfficer={policeOfficer} />
        </CardContent>
      </Card>

      {/* <EditMemberMultiStep
        crewMember={policeOfficer}
        playthroughId={playthrough.id}
        roles={roles?.data}
        nationalities={nationalities?.data}
        traits={traits?.data}
        levels={levels?.data}
      /> */}

      {/* <div>
        <pre>{JSON.stringify(crewMember, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditCrewMemberPage;
