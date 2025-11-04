import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PersonalForm } from "./personal-form";

const PersonalInformation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PersonalForm />
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;

export const PersonalInformationSkeleton = ({
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-[19.25px] w-56" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-[19.25px] w-56" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-[19.25px] w-56" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-[19.25px] w-56" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-[19.25px] w-56" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex flex-col justify-end gap-3">
          <Skeleton className="ms-auto h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};
