import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { Session } from "@/types/session";
import { capitalizeFirstLetter } from "better-auth";

interface Props {
  session: Session | null; // TODO: remove session from all instances
}

const PlaythroughError = ({ session }: Props) => {
  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: playthroughTitle.href,
            label: capitalizeFirstLetter(
              playthroughTitle.label.plural.toLowerCase(),
            ),
          },
          {
            label: "Unknown",
          },
        ])}
      />

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
};

export default PlaythroughError;
