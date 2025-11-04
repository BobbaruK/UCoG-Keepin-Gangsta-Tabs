import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { AuthFooter } from "./auth-footer";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
  showFooter?: boolean;
}

export const AuthCard = ({
  title,
  description,
  children,
  showFooter = true,
}: Props) => {
  return (
    <div className="mx-auto flex max-w-96 flex-col items-center gap-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-balance">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>

      {showFooter && <AuthFooter />}
    </div>
  );
};
