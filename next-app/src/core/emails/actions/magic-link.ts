"use server";

import { resend } from "@/lib/resend";
import React from "react";
import MagicLinkTemplate from "../templates/alerts-magic-link";

export const sendMagicLinkEmail = async ({
  email,
  url,
}: {
  email: string;
  url: string;
  token?: string;
}) => {
  await resend.emails.send({
    from: "Admin <admin@scsseco.eu>",
    to: email,
    subject: "Secure login link.",
    react: React.createElement(MagicLinkTemplate, {
      email,
      url,
    }),
  });
};
