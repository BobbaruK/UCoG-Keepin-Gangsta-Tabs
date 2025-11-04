import { Section, Text } from "@react-email/components";
import React, { ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

const SecurityNotice = ({ title, children }: Props) => {
  return (
    <Section className="mb-[24px] rounded-[6px] border-l-4 border-red-500 bg-red-50 p-[16px]">
      <Text className="m-0 mb-[8px] text-[14px] leading-[20px] font-bold text-gray-700">
        {title || "Security Notice"}
      </Text>

      {children}
    </Section>
  );
};

export default SecurityNotice;
