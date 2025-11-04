"use client";

import { type Account } from "@/types/account";
import { UserProfile } from "@/types/user-profile";
import SettingsProvider from "../providers/settings";
import { SettingsBody } from "./settings-body";
import { SettingsHeader } from "./settings-header";

interface Props {
  user: UserProfile;
  accounts: Account[];
}

const SettingsContent = ({ user, accounts }: Props) => {
  return (
    <SettingsProvider user={user} accounts={accounts}>
      <SettingsHeader />
      <SettingsBody />
    </SettingsProvider>
  );
};

export default SettingsContent;
