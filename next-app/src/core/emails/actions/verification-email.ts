"use server";

import { resend } from "@/lib/resend";
import React from "react";
import ConfirmEmailTemplate from "../templates/alerts-confirm-email";

export const sendVerificationEmail = async ({
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
    subject: "Welcome! Confirm your email address.",
    react: React.createElement(ConfirmEmailTemplate, {
      name,
      email,
      url,
    }),
  });
};
