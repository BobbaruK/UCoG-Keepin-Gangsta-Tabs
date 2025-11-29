import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getAutoRoute } from "@/features/auto-routes/data/get";
import { getLaws } from "@/features/laws/data/get-laws";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPresentation from "@/features/playthroughs/components/playthrough-presentation";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
    autoRouteId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { autoRouteId, playthroughId } = await params;

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) {
    return {
      title: `${capitalizeFirstLetter(
        playthroughTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };
  }

  const autoRoute = await getAutoRoute(autoRouteId);

  if (!autoRoute) {
    return {
      title: `${capitalizeFirstLetter(
        autoRoutesTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };
  }

  return {
    title: `${capitalizeFirstLetter(
      autoRoutesTitle.label.singular.toLowerCase(),
    )}: "${autoRoute.name}"`,
  };
}

const AutoRoutePage = async ({ params }: Props) => {
  const { playthroughId, autoRouteId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  const autoRoute = await getAutoRoute(autoRouteId);

  if (!autoRoute)
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
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={`${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`}
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
            href: `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`,
            label: capitalizeFirstLetter(
              autoRoutesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}/${autoRoute.id}`,
            label: autoRoute.name,
          },
        ])}
      />
      <PageTitle
        label={autoRoute.name}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`}
        editBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}/${autoRoute.id}/edit`
            : undefined
        }
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPresentation
        session={session}
        type="default"
        playthrough={playthrough}
        laws={laws?.data}
      />

      <div>
        <pre>{JSON.stringify(autoRoute, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default AutoRoutePage;
