import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserIcon } from "./icons/user";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  image?: string | null;
  fit?: "cover" | "contain";
  icon?: React.ReactNode;
  position?:
    | "top"
    | "left-top"
    | "right-top"
    | "right"
    | "right-bottom"
    | "bottom"
    | "left-bottom"
    | "left"
    | "left-top";
}

export const CustomAvatar = ({
  image,
  fit,
  icon,
  position,
  ...restProps
}: Props) => {
  const objectPosition = () => {
    switch (position) {
      case "top":
        return "object-top";

      case "right-top":
        return "object-right-top";

      case "left-top":
        return "object-left-top";

      case "right":
        return "object-right";

      case "right-bottom":
        return "object-right-bottom";

      case "bottom":
        return "object-bottom";

      case "left-bottom":
        return "object-left-bottom";

      case "left":
        return "object-left";

      default:
        return "";
    }
  };

  return (
    <Avatar
      {...restProps}
      className={cn("border-primary max-w-full border", restProps.className)}
    >
      <AvatarImage
        src={image || undefined}
        className={cn(
          objectPosition(),
          fit === "cover" || !fit ? "object-cover" : "object-contain",
        )}
      />
      <AvatarFallback className="rounded-none">
        {icon || <UserIcon className="h-[55%] w-[55%]" />}
      </AvatarFallback>
    </Avatar>
  );
};
