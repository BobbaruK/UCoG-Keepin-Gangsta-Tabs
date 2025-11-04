"use client";

import { Badge } from "@/components/ui/badge";
import { Account } from "@/types/account";
import { UserProfile } from "@/types/user-profile";
import {
  createContext,
  TransitionStartFunction,
  useContext,
  useTransition,
} from "react";
import {
  SettingsReducerState,
  useSettingsReducer,
} from "../hooks/use-settings-reducer";

type SettingsContextType = {
  user: UserProfile;
  accounts: Account[];

  totpURI: string;
  setTotpURI: (uri: string) => void;
  backupCodes: string[];
  setBackupCodes: (codes: string[]) => void;
  isLoading: boolean;
  startTransition: TransitionStartFunction;

  openChangeEmailDialog: boolean;
  setOpenChangeEmailDialog: (open: boolean) => void;
  openDeleteAccountDialog: boolean;
  setOpenDeleteAccountDialog: (open: boolean) => void;
  openChangePasswordDialog: boolean;
  setOpenChangePasswordDialog: (open: boolean) => void;
  openActivate2faDialog: boolean;
  setOpenActivate2faDialog: (open: boolean) => void;
  openScanQRCodeDialog: boolean;
  setOpenScanQRCodeDialog: (open: boolean) => void;
  openBackupCodesDialog: boolean;
  setOpenBackupCodesDialog: (open: boolean) => void;
  openSessionsDialog: boolean;
  setOpenSessionsDialog: (open: boolean) => void;
  openAvatarDialog: boolean;
  setOpenAvatarDialog: (open: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType>({
  user: {} as UserProfile,
  accounts: [],

  totpURI: "",
  setTotpURI: () => {},
  backupCodes: [],
  setBackupCodes: () => {},
  isLoading: false,
  startTransition: () => {},

  openChangeEmailDialog: false,
  setOpenChangeEmailDialog: () => {},
  openDeleteAccountDialog: false,
  setOpenDeleteAccountDialog: () => {},
  openChangePasswordDialog: false,
  setOpenChangePasswordDialog: () => {},
  openActivate2faDialog: false,
  setOpenActivate2faDialog: () => {},
  openScanQRCodeDialog: false,
  setOpenScanQRCodeDialog: () => {},
  openBackupCodesDialog: false,
  setOpenBackupCodesDialog: () => {},
  openSessionsDialog: false,
  setOpenSessionsDialog: () => {},
  openAvatarDialog: false,
  setOpenAvatarDialog: () => {},
});

export const useSettingsContext = () => {
  return useContext(SettingsContext);
};

interface Props {
  children: React.ReactNode;
  user: UserProfile;
  accounts: Account[];
}

export default function SettingsProvider({ children, user, accounts }: Props) {
  const SHOW_CONTEXT_SETTINGS = false;

  const [isLoading, startTransition] = useTransition();
  const { state, dispatch } = useSettingsReducer();

  return (
    <SettingsContext.Provider
      value={{
        user,
        accounts,

        isLoading,
        startTransition,

        totpURI: state.totpURI,
        setTotpURI: (uri) =>
          dispatch({
            type: "SET_TOTPURI",
            totpURI: uri,
          }),
        backupCodes: state.backupCodes,
        setBackupCodes: (codes) =>
          dispatch({
            type: "SET_BACKUPCODES",
            backupCodes: codes,
          }),
        openChangeEmailDialog: state.openChangeEmailDialog,
        setOpenChangeEmailDialog: (open) =>
          dispatch({
            type: "SET_OPEN_CHANGE_EMAIL_DIALOG",
            openChangeEmailDialog: open,
          }),
        openDeleteAccountDialog: state.openDeleteAccountDialog,
        setOpenDeleteAccountDialog: (open) =>
          dispatch({
            type: "SET_OPEN_DELETE_ACCOUNT_DIALOG",
            openDeleteAccountDialog: open,
          }),
        openChangePasswordDialog: state.openChangePasswordDialog,
        setOpenChangePasswordDialog: (open) =>
          dispatch({
            type: "SET_OPEN_CHANGE_PASSWORD_DIALOG",
            openChangePasswordDialog: open,
          }),
        openActivate2faDialog: state.openActivate2faDialog,
        setOpenActivate2faDialog: (open) =>
          dispatch({
            type: "SET_OPEN_ACTIVATE_2FA_DIALOG",
            openActivate2faDialog: open,
          }),
        openScanQRCodeDialog: state.openScanQRCodeDialog,
        setOpenScanQRCodeDialog: (open) =>
          dispatch({
            type: "SET_OPEN_SCAN_QR_DIALOG",
            openScanQRCodeDialog: open,
          }),
        openBackupCodesDialog: state.openBackupCodesDialog,
        setOpenBackupCodesDialog: (open) =>
          dispatch({
            type: "SET_OPEN_BACKUP_CODES_DIALOG",
            openBackupCodesDialog: open,
          }),
        openSessionsDialog: state.openSessionsDialog,
        setOpenSessionsDialog: (open) =>
          dispatch({
            type: "SET_OPEN_SESSIONS_DIALOG",
            openSessionsDialog: open,
          }),
        openAvatarDialog: state.openAvatarDialog,
        setOpenAvatarDialog: (open) =>
          dispatch({
            type: "SET_OPEN_AVATAR_DIALOG",
            openAvatarDialog: open,
          }),
      }}
    >
      {SHOW_CONTEXT_SETTINGS && <ReducerSettings state={state} />}

      {children}
    </SettingsContext.Provider>
  );
}

function ReducerSettings({ state }: { state: SettingsReducerState }) {
  return (
    <div className="text-muted-foreground bg-muted border-muted-foreground pointer-events-none fixed top-12 left-10 z-99999999 w-96 rounded-lg border p-2 opacity-80 hover:opacity-100">
      <p className="flex items-center gap-1">
        totpURI:{" "}
        <Badge
          variant={state.totpURI ? "success" : "danger"}
          className="inline-block max-w-[290px] truncate"
        >
          {JSON.stringify(state.totpURI, null, 2)}
        </Badge>
      </p>
      <p className="flex items-center gap-1">
        backupCodes:{" "}
        <Badge
          variant={state.backupCodes.length ? "success" : "danger"}
          className="inline-block max-w-[250px] truncate"
        >
          {JSON.stringify(state.backupCodes, null, 2)}
        </Badge>
      </p>
      <p>
        openChangeEmailDialog:{" "}
        <Badge variant={state.openChangeEmailDialog ? "success" : "danger"}>
          {JSON.stringify(state.openChangeEmailDialog, null, 2)}
        </Badge>
      </p>
      <p>
        openDeleteAccountDialog:{" "}
        <Badge variant={state.openDeleteAccountDialog ? "success" : "danger"}>
          {JSON.stringify(state.openDeleteAccountDialog, null, 2)}
        </Badge>
      </p>
      <p>
        openChangePasswordDialog:{" "}
        <Badge variant={state.openChangePasswordDialog ? "success" : "danger"}>
          {JSON.stringify(state.openChangePasswordDialog, null, 2)}
        </Badge>
      </p>
      <p>
        openActivate2faDialog:{" "}
        <Badge variant={state.openActivate2faDialog ? "success" : "danger"}>
          {JSON.stringify(state.openActivate2faDialog, null, 2)}
        </Badge>
      </p>
      <p>
        openScanQRCodeDialog:{" "}
        <Badge variant={state.openScanQRCodeDialog ? "success" : "danger"}>
          {JSON.stringify(state.openScanQRCodeDialog, null, 2)}
        </Badge>
      </p>
      <p>
        openBackupCodesDialog:{" "}
        <Badge variant={state.openBackupCodesDialog ? "success" : "danger"}>
          {JSON.stringify(state.openBackupCodesDialog, null, 2)}
        </Badge>
      </p>
      <p>
        openSessionsDialog:{" "}
        <Badge variant={state.openSessionsDialog ? "success" : "danger"}>
          {JSON.stringify(state.openSessionsDialog, null, 2)}
        </Badge>
      </p>
      <p>
        openAvatarDialog:{" "}
        <Badge variant={state.openAvatarDialog ? "success" : "danger"}>
          {JSON.stringify(state.openAvatarDialog, null, 2)}
        </Badge>
      </p>
    </div>
  );
}
