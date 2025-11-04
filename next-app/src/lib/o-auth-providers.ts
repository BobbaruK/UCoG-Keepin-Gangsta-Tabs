import { GithubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "google"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: React.ElementType }
> = {
  google: { name: "Google", Icon: GoogleIcon },
  github: { name: "GitHub", Icon: GithubIcon },
};
