"use server";

import { resend } from "@/lib/resend";
import React from "react";
import DeleteAccountTemplate from "../templates/alerts-delete-account";

export const confirmDeleteAccountEmail = async ({
  name,
  email,
  url,
}: {
  name: string;
  email: string;
  url: string;
  token?: string;
}) => {
  await resend.emails.send({
    from: "Admin <admin@scsseco.eu>",
    to: email,
    subject: "Confirm account deletion.",
    react: React.createElement(DeleteAccountTemplate, {
      name,
      email,
      url,
    }),
  });
};
