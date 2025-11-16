import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getPlaythrough } from "@/features/playtroughs/data/get";
import AddPoliceOfficerForm from "@/features/police-officers/components/form/add";
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
  title: `Add ${policeOfficersTitle.label.singular}`,
};

const AddPoliceOfficerPage = async ({ params }: Props) => {
  const playthroughId = (await params).playthroughId;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

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

      <AddPoliceOfficerForm playthroughId={playthroughId} />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddPoliceOfficerPage;
