import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/auto-routes/components/tables/data-table-transition-wrapper";
import { getAutoRoutes } from "@/features/auto-routes/data/get";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPresentation from "@/features/playthroughs/components/playthrough-presentation";
import { getPlaythrough } from "@/features/playthroughs/data/get";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { playthroughId } = await params;

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough)
    return {
      title: `${capitalizeFirstLetter(
        playthroughTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: capitalizeFirstLetter(autoRoutesTitle.label.plural.toLowerCase()),
  };
}

const CrewMembersPage = async ({ params, searchParams }: Props) => {
  const { playthroughId } = await params;

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

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  const autoRoutes = await getAutoRoutes({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: { [sortBy]: sort },
    where: {
      cog_playthroughId: playthroughId,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedAutoRoutes = await getAutoRoutes({
    where: {
      id: {
        in: selected || [],
      },
    },
    perPage: -1,
  });

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
            href: `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`,
            label: capitalizeFirstLetter(
              autoRoutesTitle.label.plural.toLowerCase(),
            ),
          },
        ])}
      />

      <PageTitle
        label={capitalizeFirstLetter(
          autoRoutesTitle.label.plural.toLowerCase(),
        )}
        backBtnHref={`${playthroughTitle.href}/${playthrough.id}`}
        addBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthrough.id + autoRoutesTitle.href}/add`
            : undefined
        }
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPresentation
        session={session}
        type="default"
        playthrough={playthrough}
      />

      <DataTableTransitionWrapper
        data={autoRoutes?.data || []}
        dataCount={autoRoutes?.count || 0}
        dataSelected={selectedAutoRoutes?.data || []}
      />

      <div>
        <pre>{JSON.stringify({ autoRoutes }, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default CrewMembersPage;
