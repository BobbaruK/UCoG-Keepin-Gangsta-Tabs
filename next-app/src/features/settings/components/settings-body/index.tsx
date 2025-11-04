import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { AccountSkeleton } from "./account";
import { AccountLinkingSkeleton } from "./account-linking";
import { PersonalInformationSkeleton } from "./personal-info";
import { SecuritySkeleton } from "./security";
const PersonalInformation = dynamic(() => import("./personal-info"), {
  ssr: false,
  loading: () => <PersonalInformationSkeleton />,
});
const Account = dynamic(() => import("./account"), {
  loading: () => <AccountSkeleton />,
});
const AccountLinkingTab = dynamic(() => import("./account-linking"), {
  loading: () => <AccountLinkingSkeleton />,
});
const Security = dynamic(() => import("./security"), {
  loading: () => <SecuritySkeleton />,
});

export const SettingsBody = () => {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="flex h-auto w-full flex-wrap md:grid md:grid-cols-4">
        <TabsTrigger value="personal" className="w-full">
          Personal
        </TabsTrigger>
        <TabsTrigger value="account" className="w-full">
          Account
        </TabsTrigger>
        <TabsTrigger value="linking" className="w-full">
          Linking
        </TabsTrigger>
        <TabsTrigger value="security" className="w-full">
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        <PersonalInformation />
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <Account />
      </TabsContent>

      <TabsContent value="linking" className="space-y-6">
        <AccountLinkingTab />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Security />
      </TabsContent>
    </Tabs>
  );
};
