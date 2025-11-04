import { CustomButton } from "@/components/custom-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AccountVisibility } from "./account-visibility";
import { ChangeEmail } from "./change-email";
import { DeleteAccount } from "./delete-account";

const Account = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <ChangeEmail />
            <Separator />
            <AccountVisibility />
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-base font-medium">Data Export</p>
                <p className="text-muted-foreground text-sm">
                  Download a copy of your data
                </p>
              </div>
              <CustomButton
                buttonLabel="Export Data"
                variant="outline"
                disabled={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50 shadow-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccount />
        </CardContent>
      </Card>
    </>
  );
};

export default Account;

export const AccountSkeleton = ({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="space-y-6">
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
      <Card
        className={cn("border-destructive/50 shadow-destructive", className)}
        {...restProps}
      >
        <CardHeader>
          <CardTitle>
            <Skeleton className="bg-destructive h-4 w-60" />
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
            <Skeleton className="bg-destructive h-10 w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
