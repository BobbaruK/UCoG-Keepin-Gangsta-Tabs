import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Accounts from "./accounts";

const AccountLinkingTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linking accounts</CardTitle>
        <CardDescription>
          Here you can link your 3rd party accounts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accounts />
      </CardContent>
    </Card>
  );
};

export default AccountLinkingTab;

export const AccountLinkingSkeleton = ({
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
      <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
        <Skeleton className="h-[216px] w-full" />
        <Skeleton className="h-[216px] w-full" />
        <Skeleton className="h-[216px] w-full" />
        <Skeleton className="h-[216px] w-full" />
      </CardContent>
    </Card>
  );
};
