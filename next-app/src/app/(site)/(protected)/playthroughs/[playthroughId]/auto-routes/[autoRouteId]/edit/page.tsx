import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { redirectNonOwnerUsers } from "@/core/admin/lib/redirect-non-owner-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { redirectPlaythroughFinished } from "@/core/cog/playthrough/utils/redirect-playthrough-finished";
import { getAutoRouteTypes } from "@/features/auto-route-types/data/get-auto-route-types";
import FormCardWrapper from "@/features/auto-routes/components/form-card-wrapper";
import { getAutoRoute } from "@/features/auto-routes/data/get";
import { getCrewMembers } from "@/features/crew-members/data/get";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { getVehicleTypes } from "@/features/vehicle-types/data/get-vehicle-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
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
      title: `Edit ${autoRoutesTitle.label.singular.toLowerCase()}: "Unknown"`,
    };
  }

  return {
    title: `Edit ${autoRoutesTitle.label.singular.toLowerCase()}: "${autoRoute.name}"`,
  };
}

const EditAutoRoutePage = async ({ params }: Props) => {
  const { autoRouteId, playthroughId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  redirectNonOwnerUsers({
    isOwner: session?.user.id === playthrough.auth_userId,
    to: `${playthroughTitle.href}/${playthrough.id + autoRoutesTitle.href}/${autoRouteId}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + autoRoutesTitle.href}/${autoRouteId}`,
  });

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

  const crewMembers = await getCrewMembers({
    where: {
      cog_playthroughId: {
        equals: playthrough.id,
      },
    },
  });
  const vehicleTypes = await getVehicleTypes();
  const autoRouteTypes = await getAutoRouteTypes();

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
          {
            href: `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}/${autoRoute.id}/edit`,
            label: `Edit ${autoRoutesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${autoRoute.name}"`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}/${autoRoute.id}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <FormCardWrapper
        data={{
          type: "edit",
          autoRoute,
          autoRouteTypes: autoRouteTypes?.data,
          vehicleTypes: vehicleTypes?.data,
          crewMembers: crewMembers?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify(crewMember, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditAutoRoutePage;
