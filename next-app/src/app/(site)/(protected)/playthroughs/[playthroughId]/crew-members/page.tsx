import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { MESSAGES } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getCaptainRoles } from "@/features/captain-roles/data/get";
import { DataTableTransitionWrapper } from "@/features/crew-members/components/tables/data-table-transition-wrapper";
import { getCrewMembers } from "@/features/crew-members/data/get";
import { getCrewLevels } from "@/features/crew-members/data/get-levels";
import { getLaws } from "@/features/laws/data/get-laws";
import { getNationalities } from "@/features/nationalities/data/get-nationalities";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPresentation from "@/features/playthroughs/components/playthrough-presentation";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { getTraits } from "@/features/traits/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{
    playthroughId: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(crewMembersTitle.label.plural.toLowerCase()),
};

const CrewMembersPage = async ({ params, searchParams }: Props) => {
  const id = (await params).playthroughId;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    // pagination
    pageIndex,
    pageSize,
    // sorting
    sortBy,
    sort,
    // filtering
    search,
    // Select
    selected,
  } = await loadSearchParams(searchParams);

  const playthrough = await getPlaythrough(id);
  const crewMembers = await getCrewMembers({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: { [sortBy]: sort },
    where: {
      cog_playthroughId: id,
      full_name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedCrewMembers = await getCrewMembers({
    where: {
      id: {
        in: selected || [],
      },
    },
    perPage: -1,
  });

  const roles = await getCaptainRoles();
  const nationalities = await getNationalities();
  const traits = await getTraits();
  const levels = await getCrewLevels();
  const laws = await getLaws();

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

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: playthroughTitle.href,
            label: capitalizeFirstLetter(playthroughTitle.label.plural),
          },
          {
            href: `${playthroughTitle.href}/${id}`,
            label: playthrough.name,
          },
          {
            href: `${playthroughTitle.href}/${id + crewMembersTitle.href}`,
            label: capitalizeFirstLetter(
              crewMembersTitle.label.plural.toLowerCase(),
            ),
          },
        ])}
      />
      <PageTitle
        label={capitalizeFirstLetter(
          crewMembersTitle.label.plural.toLowerCase(),
        )}
        backBtnHref={`${playthroughTitle.href}/${playthrough.id}`}
        addBtnHref={`${playthroughTitle.href}/${playthrough.id + crewMembersTitle.href}/add`}
        forceAddButton
        session={session}
      />

      {/* <PlaythroughPresentation playthrough={playthrough} /> */}
      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPresentation
        type="default"
        playthrough={playthrough}
        laws={laws?.data}
      />

      <DataTableTransitionWrapper
        data={crewMembers?.data || []}
        dataCount={crewMembers?.count || 0}
        dataSelected={selectedCrewMembers?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ crewMembers }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default CrewMembersPage;
