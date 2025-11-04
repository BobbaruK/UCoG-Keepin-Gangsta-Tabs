import { ReactIconsProps } from "@/types/icons";
import { FaGithub } from "react-icons/fa";

export const GithubIcon = ({ ...props }: ReactIconsProps) => {
  return <FaGithub {...props} strokeWidth={0} />;
};
