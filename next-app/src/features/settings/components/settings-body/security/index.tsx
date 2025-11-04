import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChangePassword } from "./change-password";
import { Sessions } from "./sessions";
import { TwoFactor } from "./two-factor";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const Security = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security and authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <ChangePassword />
          <Separator />
          <TwoFactor />
          <Separator />
          <Sessions />
        </div>
      </CardContent>
    </Card>
  );
};

export default Security;

export const SecuritySkeleton = ({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Card className={cn(className)} {...restProps}>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-60" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-80" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};
