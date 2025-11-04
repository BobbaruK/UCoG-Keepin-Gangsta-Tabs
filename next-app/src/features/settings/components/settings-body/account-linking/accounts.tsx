"use client";

import { CustomButton } from "@/components/custom-button";
import { LinkIcon } from "@/components/icons/link";
import { UnlinkIcon } from "@/components/icons/unlink";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import {
  linkAccount,
  unlinkAccount,
} from "@/core/user/actions/linking-account";
import { useSettingsContext } from "@/features/settings/providers/settings";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/o-auth-providers";
import { cn } from "@/lib/utils";
import React from "react";
import { toast } from "sonner";

const Accounts = () => {
  const { accounts, isLoading, startTransition } = useSettingsContext();

  const nonCredentialAccounts = accounts.filter(
    (account) => account.providerId !== "credential",
  );

  const handleLinkAccount = async (provider: string) => {
    startTransition(() => {
      linkAccount(provider);
    });
  };

  const handleUnlinkAccount = (provider: string) => {
    startTransition(async () => {
      unlinkAccount(provider)
        .then(({ success, error }) => {
          if (success) {
            toast.success(success);
          }
          if (error) {
            toast.error(error);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => (
        <Card
          key={provider}
          className={cn(
            "bg-primary/10",
            nonCredentialAccounts.find((acc) => acc.providerId === provider)
              ? "inset-ring-success inset-ring-4"
              : "",
          )}
        >
          <CardHeader>
            <CardTitle className="text-center">
              {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center">
            <div>
              {React.createElement(
                SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon,
                {
                  size: 60,
                },
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end">
            {nonCredentialAccounts.find(
              (acc) => acc.providerId === provider,
            ) ? (
              <CustomButton
                buttonLabel={`Unlink ${SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name} account`}
                icon={UnlinkIcon}
                iconPlacement="left"
                size={"icon"}
                variant={"outline"}
                onClick={() => handleUnlinkAccount(provider)}
                disabled={isLoading}
              />
            ) : (
              <CustomButton
                buttonLabel={`Link ${SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name} account`}
                icon={LinkIcon}
                iconPlacement="left"
                size={"icon"}
                variant={"outline"}
                onClick={() => handleLinkAccount(provider)}
                disabled={isLoading}
              />
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Accounts;
