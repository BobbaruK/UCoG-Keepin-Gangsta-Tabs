import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { redirectNonOwnerUsers } from "@/core/admin/lib/redirect-non-owner-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { redirectPlaythroughFinished } from "@/core/cog/playthrough/utils/redirect-playthrough-finished";
import { getAutoRouteTypes } from "@/features/auto-route-types/data/get-auto-route-types";
import FormCardWrapper from "@/features/auto-routes/components/form-card-wrapper";
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
  }>;
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
    title: `Add ${autoRoutesTitle.label.singular.toLowerCase()}`,
  };
}

const AddPoliceOfficerPage = async ({ params }: Props) => {
  const playthroughId = (await params).playthroughId;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  redirectNonOwnerUsers({
    isOwner: session?.user.id === playthrough.auth_userId,
    to: `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + autoRoutesTitle.href}`,
  });

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
            label: playthrough?.name || "",
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`,
            label: capitalizeFirstLetter(
              autoRoutesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`,
            label: `Add ${autoRoutesTitle.label.plural.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${autoRoutesTitle.label.singular.toLowerCase()}`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + autoRoutesTitle.href}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthroughId} />

      <FormCardWrapper
        data={{
          type: "add",
          playthrough,
          crewMembers: crewMembers?.data,
          vehicleTypes: vehicleTypes?.data,
          autoRouteTypes: autoRouteTypes?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ autoRouteTypes }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddPoliceOfficerPage;
