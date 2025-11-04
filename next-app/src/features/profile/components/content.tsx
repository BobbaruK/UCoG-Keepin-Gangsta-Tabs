import { CustomAlert } from "@/components/custom-alert";
import { AccountIcon } from "@/components/icons/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/types/session";
import { UserProfile } from "@/types/user-profile";

interface Props {
  user: UserProfile;
  session: Session | null;
}

const ProfileContent = ({ user, session }: Props) => {
  const isSameUser = session?.user.id === user.id ? true : false;

  return (
    <>
      {!user.isAccountVisible && (
        <CustomAlert
          title={"Private account!"}
          description={"This user account visibility is set tot private."}
          variant="warning"
          icon={<AccountIcon />}
        />
      )}
      {(isSameUser || user.isAccountVisible) && (
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-start gap-2">
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {user.bio ? (
              user.bio
            ) : (
              <p className="italic">This user does not have a bio yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ProfileContent;
