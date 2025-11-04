import { Heading, Img, Section, Text } from "@react-email/components";

interface Props {
  title: string;
  description?: string;
}

const HeaderEmail = ({ title, description }: Props) => {
  return (
    <Section>
      {/* TODO: put the path to the png in the public folder when build on vps */}
      <Img
        src={"https://moccasin-veradis-69.tiiny.site/auth-v3-logo.png"}
        alt="Logo"
        width="100"
      />
      <Heading as="h1" mb={0} className="text-center font-bold text-gray-900">
        {title}
      </Heading>
      {description && (
        <Text className="m-0 text-center text-[16px] text-gray-600">
          {description}
        </Text>
      )}
    </Section>
  );
};

export default HeaderEmail;
