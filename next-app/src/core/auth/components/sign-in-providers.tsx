"use client";

import { CustomButton } from "@/components/custom-button";
import { GithubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";
import {
  DEFAULT_API_ERROR_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
} from "@/constants/routes";
import { signIn } from "@/lib/auth-client";

const SignInProviders = () => {
  const handleGithubClick = async () => {
    await signIn.social({
      provider: "github",
      errorCallbackURL: DEFAULT_API_ERROR_REDIRECT,
      callbackURL: DEFAULT_LOGIN_REDIRECT,
    });
  };

  const handleGoogleClick = async () => {
    await signIn.social({
      provider: "google",
      errorCallbackURL: DEFAULT_API_ERROR_REDIRECT,
      callbackURL: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <CustomButton
          buttonLabel={`Login with GitHub`}
          variant="outline"
          icon={GithubIcon}
          iconPlacement="left"
          hideLabelOnMobile={false}
          className="w-full"
          onClick={handleGithubClick}
          skeletonClassName="w-full h-9"
        />

        <CustomButton
          buttonLabel={`Login with Google`}
          variant="outline"
          icon={GoogleIcon}
          iconPlacement="left"
          hideLabelOnMobile={false}
          className="w-full"
          onClick={handleGoogleClick}
          skeletonClassName="w-full h-9"
        />
      </div>
    </div>
  );
};

export default SignInProviders;
