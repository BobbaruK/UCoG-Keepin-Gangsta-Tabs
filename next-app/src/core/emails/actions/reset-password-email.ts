"use server";

import { resend } from "@/lib/resend";
import React from "react";
import ResetPasswordTemplate from "../templates/alerts-reset-password";

export const sendResetPasswordEmail = async ({
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
    subject: "Reset your password.",
    react: React.createElement(ResetPasswordTemplate, {
      name,
      email,
      url,
    }),
  });
};
