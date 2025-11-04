import { Text } from "@react-email/components";

interface Props {
  time: string;
}

const ConfirmationLink = ({ time }: Props) => {
  return (
    <Text className="text-[14px] leading-[20px] text-gray-600">
      This confirmation link will expire in <strong>{time}</strong> for security
      reasons. If you didn&apos;t create an account with us, you can safely
      ignore this email.
    </Text>
  );
};

export default ConfirmationLink;
