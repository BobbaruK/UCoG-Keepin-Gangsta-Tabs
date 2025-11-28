import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
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
    title: `Add ${policeOfficersTitle.label.singular.toLowerCase()}`,
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
    to: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + policeOfficersTitle.href}`,
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
            label: playthrough?.name || "",
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
            label: capitalizeFirstLetter(
              policeOfficersTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
            label: `Add ${policeOfficersTitle.label.plural.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${policeOfficersTitle.label.singular.toLowerCase()}`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthroughId} />

      <FormCardWrapper
        data={{
          type: "add",
          playthrough,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddPoliceOfficerPage;
