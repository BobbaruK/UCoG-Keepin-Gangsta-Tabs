import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getCrewMember } from "@/features/crew-members/data/get";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playthroughs/data/get";
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
    title: setFullName({
      firstName: crewMember.first_name,
      lastName: crewMember.last_name,
      alias: crewMember.alias,
    }).outputFE,
  };
}

const CrewMemberPage = async ({ params }: Props) => {
  const playthroughId = (await params).playthroughId;
  const crewMemberId = (await params).crewMemberId;

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
            href: `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}/${crewMember.id}`,
            label: setFullName({
              firstName: crewMember.first_name,
              lastName: crewMember.last_name,
              alias: crewMember.alias,
            }).outputFE,
          },
        ])}
      />
      <PageTitle
        label={
          setFullName({
            firstName: crewMember.first_name,
            lastName: crewMember.last_name,
            alias: crewMember.alias,
          }).outputFE
        }
        backBtnHref={`${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`}
        editBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}/${crewMember.id}/edit`
            : undefined
        }
        forceEditButton={!playthrough.is_finished}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <div>
        <pre>{JSON.stringify(crewMember, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default CrewMemberPage;
