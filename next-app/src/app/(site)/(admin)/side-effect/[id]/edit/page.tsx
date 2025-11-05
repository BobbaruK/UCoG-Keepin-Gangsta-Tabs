import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { getSideEffect } from "@/core/admin/side-effects/data/get-side-effects";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const SideEffectEditPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sideEffect = await getSideEffect(id);

  if (!sideEffect)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={`/side-effect`}
          role={session?.user.role as UserRole}
        />
        <CustomAlert
          title={"Error!"}
          description={"MESSAGES.USER_NOT_EXIST"}
          variant="danger"
        />
      </PageStructure>
    );

  return (
    <PageStructure>
      <PageTitle
        label={`Edit "${sideEffect.name}"`}
        backBtnHref={`/side-effect/${id}`}
        role={session?.user.role as UserRole}
      />

      <div>
        <pre>{JSON.stringify({ sideEffect }, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default SideEffectEditPage;
