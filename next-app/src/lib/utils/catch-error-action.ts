import { ErrorCode } from "@/types/errors";
import { APIError } from "better-auth/api";

export const catchError = (error: unknown) => {
  // console.error("Something went wrong: ", JSON.stringify(error));

  if (error instanceof APIError) {
    const errCode = error.body?.code as ErrorCode;

    switch (errCode) {
      // case "USER_ALREADY_EXISTS":
      //   return {
      //     error: "Oops! Something went wrong. Please try again.",
      //   };

      default:
        return {
          error: error.message,
        };
    }
  }

  if (error instanceof Error)
    return {
      error: error.message,
    };

  throw error;
};
