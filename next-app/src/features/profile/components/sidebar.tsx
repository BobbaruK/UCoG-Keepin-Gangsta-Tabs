import { CustomAvatar } from "@/components/custom-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileActions from "@/core/admin/users/components/profile-actions";
import { RoleIcon } from "@/core/auth/components/role-icon";
import { UserRole } from "@/generated/prisma";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { dateFormatter } from "@/lib/utils/format-date";
import { Session } from "@/types/session";
import { UserProfile } from "@/types/user-profile";

interface Props {
  user: UserProfile;
  session: Session | null;
}

const ProfileSidebar = ({ user, session }: Props) => {
  const isSameUser = session?.user.id === user.id ? true : false;

  return (
    <>
      {session?.user.role !== UserRole.USER && !isSameUser && (
        <ProfileActions user={user} session={session} />
      )}

      <Card>
        <CardHeader className="flex flex-col flex-wrap items-center justify-start gap-2">
          <CustomAvatar image={user.image} className="size-24" />
          <CardTitle className="flex items-center gap-2">
            <span>{user.displayUsername}</span>

            {user.banned && <Badge variant={"danger"}>Banned</Badge>}
          </CardTitle>
          {user.isAccountVisible && (
            <CardDescription>{user.email}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {user.banned && (
            <div className="bg-danger/20 text-danger-foreground border-danger flex flex-col justify-between gap-2 rounded-md border p-1">
              <p className="flex flex-wrap items-center justify-between gap-2">
                <span className="">Banned until:</span>
                <span>
                  {user.banExpires
                    ? dateFormatter({
                        date: user.banExpires,
                        options: {
                          timeZone: "Europe/Bucharest",
                          hourCycle: "h23",
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        },
                      })
                    : "Indefinite"}
                </span>
              </p>
              <p className="flex flex-wrap items-center justify-between gap-2">
                <span className="">Ban reason:</span>
                <span>{user.banReason}</span>
              </p>
            </div>
          )}
          <p className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted-foreground">Member since:</span>
            <span>
              {dateFormatter({
                date: user.createdAt,
                options: {
                  timeZone: "Europe/Bucharest",
                  hourCycle: "h23",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              })}
            </span>
          </p>
          <p className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted-foreground">Last active:</span>
            <span>
              {dateFormatter({
                date: user.lastLoginAt,
                options: {
                  timeZone: "Europe/Bucharest",
                  hourCycle: "h23",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              })}
            </span>
          </p>
          <p className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted-foreground">Role:</span>
            <span className="flex items-center gap-2">
              <RoleIcon role={user.role} size={16} />{" "}
              {capitalizeFirstLetter(user.role)}
            </span>
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileSidebar;
