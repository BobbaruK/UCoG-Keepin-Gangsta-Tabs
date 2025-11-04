"use client";

import { useReducer } from "react";

export interface SettingsReducerState {
  totpURI: string;
  backupCodes: string[];
  openChangeEmailDialog: boolean;
  openDeleteAccountDialog: boolean;
  openChangePasswordDialog: boolean;
  openActivate2faDialog: boolean;
  openScanQRCodeDialog: boolean;
  openBackupCodesDialog: boolean;
  openSessionsDialog: boolean;
  openAvatarDialog: boolean;
}

export type SettingsReducerAction =
  | {
      type: "SET_TOTPURI";
      totpURI: string;
    }
  | {
      type: "SET_BACKUPCODES";
      backupCodes: string[];
    }
  | {
      type: "SET_OPEN_CHANGE_EMAIL_DIALOG";
      openChangeEmailDialog: boolean;
    }
  | {
      type: "SET_OPEN_DELETE_ACCOUNT_DIALOG";
      openDeleteAccountDialog: boolean;
    }
  | {
      type: "SET_OPEN_CHANGE_PASSWORD_DIALOG";
      openChangePasswordDialog: boolean;
    }
  | {
      type: "SET_OPEN_ACTIVATE_2FA_DIALOG";
      openActivate2faDialog: boolean;
    }
  | {
      type: "SET_OPEN_SCAN_QR_DIALOG";
      openScanQRCodeDialog: boolean;
    }
  | {
      type: "SET_OPEN_BACKUP_CODES_DIALOG";
      openBackupCodesDialog: boolean;
    }
  | {
      type: "SET_OPEN_SESSIONS_DIALOG";
      openSessionsDialog: boolean;
    }
  | {
      type: "SET_OPEN_AVATAR_DIALOG";
      openAvatarDialog: boolean;
    };

const settingsReducerInitialState: SettingsReducerState = {
  totpURI: "",
  backupCodes: [],
  openChangeEmailDialog: false,
  openDeleteAccountDialog: false,
  openChangePasswordDialog: false,
  openActivate2faDialog: false,
  openScanQRCodeDialog: false,
  openBackupCodesDialog: false,
  openSessionsDialog: false,
  openAvatarDialog: false,
};

function settingsReducer(
  state: SettingsReducerState,
  action: SettingsReducerAction,
) {
  switch (action.type) {
    case "SET_TOTPURI":
      return { ...state, totpURI: action.totpURI };

    case "SET_BACKUPCODES":
      return { ...state, backupCodes: action.backupCodes };

    case "SET_OPEN_CHANGE_EMAIL_DIALOG":
      return { ...state, openChangeEmailDialog: action.openChangeEmailDialog };

    case "SET_OPEN_DELETE_ACCOUNT_DIALOG":
      return {
        ...state,
        openDeleteAccountDialog: action.openDeleteAccountDialog,
      };

    case "SET_OPEN_CHANGE_PASSWORD_DIALOG":
      return {
        ...state,
        openChangePasswordDialog: action.openChangePasswordDialog,
      };

    case "SET_OPEN_ACTIVATE_2FA_DIALOG":
      return {
        ...state,
        openActivate2faDialog: action.openActivate2faDialog,
      };

    case "SET_OPEN_SCAN_QR_DIALOG":
      return {
        ...state,
        openScanQRCodeDialog: action.openScanQRCodeDialog,
      };

    case "SET_OPEN_BACKUP_CODES_DIALOG":
      return {
        ...state,
        openBackupCodesDialog: action.openBackupCodesDialog,
      };

    case "SET_OPEN_SESSIONS_DIALOG":
      return {
        ...state,
        openSessionsDialog: action.openSessionsDialog,
      };

    case "SET_OPEN_AVATAR_DIALOG":
      return {
        ...state,
        openAvatarDialog: action.openAvatarDialog,
      };

    default:
      return state;
  }
}

export function useSettingsReducer() {
  const [state, dispatch] = useReducer(
    settingsReducer,
    settingsReducerInitialState,
  );

  return { state, dispatch };
}
