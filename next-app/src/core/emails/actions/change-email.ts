"use server";

import { resend } from "@/lib/resend";
import React from "react";
import ChangeEmailTemplate from "../templates/alerts-change-email";

export const sendChangeEmail = async ({
  name,
  newMail,
  oldMail,
  url,
}: {
  name: string;
  oldMail: string;
  newMail: string;
  url: string;
  token?: string;
}) => {
  await resend.emails.send({
    from: "Admin <admin@scsseco.eu>",
    to: oldMail,
    subject: "Confirm your new email address.",
    react: React.createElement(ChangeEmailTemplate, {
      name,
      oldMail,
      newMail,
      url,
    }),
  });
};
