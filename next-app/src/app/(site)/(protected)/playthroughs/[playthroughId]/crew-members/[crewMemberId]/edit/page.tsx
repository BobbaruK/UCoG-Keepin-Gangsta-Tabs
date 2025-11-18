import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getCaptainRoles } from "@/features/captain-roles/data/get";
import { getCrewLevels } from "@/features/crew-levels/data/get";
import EditMemberMultiStep from "@/features/crew-members/components/edit-member-multistep";
import { getCrewMember } from "@/features/crew-members/data/get";
import { getNationalities } from "@/features/nationalities/data/get-nationalities";
import PlaythroughMenu from "@/features/playtroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playtroughs/data/get";
import { getTraits } from "@/features/traits/data/get";
import { auth } from "@/lib/auth";
import { setFullName } from "@/lib/utils/full-name";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
    crewMemberId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { crewMemberId, playthroughId } = await params;

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) {
    return {
      title: "Error",
    };
  }

  const crewMember = await getCrewMember(crewMemberId);

  if (!crewMember) {
    return {
      title: "Error",
    };
  }

  return {
    title: `Edit "${
      setFullName({
        firstName: crewMember.first_name,
        lastName: crewMember.last_name,
        alias: crewMember.alias,
      }).outputFE
    }"`,
  };
}

const EditCrewMemberPage = async ({ params }: Props) => {
  const { crewMemberId, playthroughId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

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

  const crewMember = await getCrewMember(crewMemberId);

  if (!crewMember)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={crewMembersTitle.href}
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
            href: `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`,
            label: capitalizeFirstLetter(
              crewMembersTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}/${crewMember.id}/edit`,
            label: `Edit "${
              setFullName({
                firstName: crewMember.first_name,
                lastName: crewMember.last_name,
                alias: crewMember.alias,
              }).outputFE
            }"`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${
          setFullName({
            firstName: crewMember.first_name,
            lastName: crewMember.last_name,
            alias: crewMember.alias,
          }).outputFE
        }"`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}/${crewMember.id}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <EditMemberMultiStep
        crewMember={crewMember}
        playthroughId={playthrough.id}
        roles={roles?.data}
        nationalities={nationalities?.data}
        traits={traits?.data}
        levels={levels?.data}
      />

      {/* <div>
        <pre>{JSON.stringify(crewMember, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditCrewMemberPage;
