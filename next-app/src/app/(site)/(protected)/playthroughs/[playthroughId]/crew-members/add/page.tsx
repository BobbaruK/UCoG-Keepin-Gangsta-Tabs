import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getCaptainRoles } from "@/features/captain-roles/data/get";
import AddMemberMultiStep from "@/features/crew-members/components/add-member-multistep";
import { getCrewLevels } from "@/features/crew-members/data/get-levels";
import { getNationalities } from "@/features/nationalities/data/get-nationalities";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { getTraits } from "@/features/traits/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
  }>;
}

export const metadata: Metadata = {
  title: `Add ${crewMembersTitle.label.singular}`,
};

const AddPoliceOfficerPage = async ({ params }: Props) => {
  const playthroughId = (await params).playthroughId;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);
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
            label: playthrough?.name || "",
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`,
            label: capitalizeFirstLetter(
              crewMembersTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`,
            label: `Add ${crewMembersTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${crewMembersTitle.label.singular.toLowerCase()}`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthroughId} />

      <AddMemberMultiStep
        playthroughId={playthroughId}
        roles={roles?.data}
        nationalities={nationalities?.data}
        traits={traits?.data}
        levels={levels?.data}
      />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddPoliceOfficerPage;
