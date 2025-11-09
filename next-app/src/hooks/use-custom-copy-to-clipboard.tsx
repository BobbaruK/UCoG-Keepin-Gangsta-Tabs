"use client";

import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

export function useCustomCopyToClipboard() {
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (text: string | null) => () => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }

    copy(text)
      .then(() => {
        toast.success("Copy successful", {
          description: <div className="line-clamp-1">{text}</div>,
        });
      })
      .catch((error) => {
        if (error instanceof Error) console.error(error.message);

        toast.error("Failed to copy!");
      });
  };

  return { handleCopy };
}
