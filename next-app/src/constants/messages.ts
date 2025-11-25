import { Header } from "@/types/responsive-dialog";

export const MESSAGES_FN = ({
  resource,
  resourceName,
}: {
  resource?: string;
  resourceName?: string;
} = {}) => {
  return {
    ACCOUNT_LINK_SUCCESSFUL: "Account linked successfully.",
    ACCOUNT_UNLINK_SUCCESSFUL: "Account unlinked successfully.",
    BACKUPCODE_SUCCESS: "Backup code verified successfully.",
    EMAIL_CHANGED: "Email updated. Please verify your new address.",
    EMAIL_OLD_NOT_MATCH: "Provided email does not match your current address.",
    ENTER_OTP: "Enter the one-time password (OTP).",
    INVALID_EMAIL_DOMAIN: "Invalid domain. Please use a valid email.",
    INVALID_FIELDS: "Invalid fields detected. Review and correct them.",
    LOGIN_SUCCESS: "Login successful.",
    LOGOUT_SUCCESS: "Logout successful.",
    MAGIC_LINK_SEND: "Verification link sent to your email.",
    PASSWORD_NEW: "Password reset. Log in with your new credentials.",
    PASSWORD_RESET: "Password reset email sent successfully.",
    PASSWORD_SET: "Password set successfully. You can now log in.",
    PASSWORDS_NOT_MATCH: "Passwords do not match.",
    PROFILE_UPDATED: "Profile updated successfully.",
    QR_GENERATED: "QR code generated. Scan with your phone.",
    QR_SCAN: "Scan the QR code and enter the OTP to continue.",
    QR_VALIDATED: "QR code verified successfully.",
    REGISTRATION_SUCCESS: "Registration complete. Verify your email.",
    SESSION_EXPIRED: "Session expired. Log in again.",
    SESSION_REVOKED_ALL: "All sessions revoked successfully.",
    SESSION_ADMIN_REVOKED_ALL:
      "All sessions for this user revoked successfully.",
    SESSION_REVOKED_OTHERS: "All other sessions revoked successfully.",
    SESSION_REVOKED: "Session revoked.",
    SOMETHING_WRONG: "An unexpected error occurred. Try again later.",
    TOKEN_INVALID: "Invalid token.",
    TOKEN_MISSING: "Token missing.",
    TWO_FACTOR_DISABLED: "Two-factor authentication disabled.",
    USER_ADMIN_BAN: "User(s) banned successfully.",
    USER_ADMIN_IMPERSONATE: "User impersonation started.",
    USER_ADMIN_OWNER: "Cannot ban, delete, or impersonate an OWNER.",
    USER_ADMIN_REMOVE: "User removed successfully.",
    USER_ADMIN_STOP_IMPERSONATE: "Stopped impersonating any user.",
    USER_ADMIN_UNBAN: "User unbanned successfully.",
    USER_ADMIN_CHANGE_ROLE: "User role successfully updated.",
    USER_AVATAR_REMOVE: "Avatar removed successfully.",
    USER_AVATAR_UPDATE: "Avatar updated successfully.",
    USER_ALREADY_BANNED: "User is already banned.",
    USER_ALREADY_UNBANNED: "User is not banned.",
    USER_NOT_EXIST: "User does not exist.",
    USERNAME_NOT_AVAILABLE: "Username not available.",

    // COG
    RESOURCE_CREATE_SUCCESS: resource
      ? `You have successfully created ${resource}${resourceName ? `: ${resourceName}.` : "."}`
      : `You have successfully created this resource`,
    RESOURCE_CREATE_UNAUTHORIZED: resource
      ? `You are not authorized to create ${resource}.`
      : `You are not authorized to create this resource.`,
    RESOURCE_EDIT_SUCCESS: resource
      ? `You have successfully updated ${resource}${resourceName ? `: ${resourceName}.` : "."}`
      : `You have successfully updated this resource`,
    RESOURCE_EDIT_UNAUTHORIZED: resource
      ? `You are not authorized to update ${resource}.`
      : `You are not authorized to update this resource.`,
    RESOURCE_EDIT_UNAUTHORIZED_OTHER: resource
      ? `You are not authorized to update other users ${resource}.`
      : `You are not authorized to update other users resources.`,
    RESOURCE_DELETE_SUCCESS: resource
      ? `You have successfully deleted ${resource}${resourceName ? `: ${resourceName}.` : "."}`
      : `You have successfully deleted this resource`,
    RESOURCE_DELETE_UNAUTHORIZED: resource
      ? `You are not authorized to delete ${resource}.`
      : `You are not authorized to delete this resource.`,
    RESOURCE_DELETE_UNAUTHORIZED_OTHER: resource
      ? `You are not authorized to delete other users ${resource}.`
      : `You are not authorized to delete other users resources.`,
    RESOURCE_NOT_EXISTS: `Resource does not exists.`,

    TRAITS_TOO_MANY: "Too many traits.",
  };
};

export const MESSAGES = MESSAGES_FN();

export const DIALOG_MESSAGES = ({
  resource,
  resourceName,
}: {
  resource?: string;
  resourceName?: string;
} = {}): Record<string, Header> => {
  return {
    DELETE: {
      title: {
        label: "Are you absolutely sure?",
      },
      description: `This action cannot be undone. This will permanently delete this ${resource || "resource"} ${resourceName ? `(${resourceName})` : ""} and remove it's data from our servers.`,
    },
  };
};
