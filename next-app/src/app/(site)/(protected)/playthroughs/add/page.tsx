import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getLaws } from "@/features/laws/data/get-laws";
import AddPlaythroughForm from "@/features/playtroughs/components/form/add";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${playthroughTitle.label.singular}`,
};

const AddPlaythroughPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
            href: `${playthroughTitle.href}/add`,
            label: `Add ${playthroughTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${playthroughTitle.label.singular.toLowerCase()}`}
        backBtnHref={playthroughTitle.href}
        session={session}
      />

      <AddPlaythroughForm laws={laws?.data} />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddPlaythroughPage;
