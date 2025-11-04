"use client";

import { CustomAlert } from "@/components/custom-alert";
import { CustomButton } from "@/components/custom-button";
import { PageStructure } from "@/components/page-structure";
import { Card, CardContent } from "@/components/ui/card";
import { admin } from "@/core/admin/actions/admin";
import { RoleGate } from "@/core/admin/components/role-gate";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

const AdminPage = () => {
  const { data: session } = useSession();
  const role = session?.user.role as UserRole;

  const onApiRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allow API Route!");
      } else {
        toast.error("Forbidden API Route!");
      }
    });
  };

  const onServerActionClick = () => {
    admin(role).then((data) => {
      if (data.success) toast.success(data.success);
      if (data.error) toast.error(data.error);
    });
  };

  return (
    <PageStructure>
      <h1 className="text-3xl font-bold">Admin</h1>

      <Card>
        <CardContent className="space-y-4">
          <RoleGate allowedRole={[UserRole.ADMIN, UserRole.OWNER]}>
            <CustomAlert
              variant={"info"}
              title="Allowed"
              description="You are allowed to see this content!"
            />
          </RoleGate>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only API Route</p>
            <CustomButton
              buttonLabel="Click to test"
              variant={"link"}
              onClick={onApiRouteClick}
              skeletonClassName="w-[106px]"
            />
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only Server Action</p>
            <CustomButton
              buttonLabel="Click to test"
              variant={"link"}
              onClick={onServerActionClick}
              skeletonClassName="w-[106px]"
            />
          </div>
        </CardContent>
      </Card>
    </PageStructure>
  );
};

export default AdminPage;
