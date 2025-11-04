import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import FooterEmail from "../components/footer";
import HeaderEmail from "../components/header";
import SecurityNotice from "../components/security-notice";

interface Props {
  name: string;
  oldMail: string;
  newMail: string;
  url: string;
}

const ChangeEmailTemplate = ({ name, newMail, oldMail, url }: Props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Confirm your new email address - Action required</Preview>
        <Body className="my-[10px] bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
            <HeaderEmail title="Confirm your new email address" />

            <Section>
              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Hi <strong>{name}</strong>,
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                You recently requested to change your email address from{" "}
                <strong>{oldMail}</strong> to <strong>{newMail}</strong>. To
                complete this change and ensure the security of your account,
                please confirm your new email address by clicking the button
                below.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={url}
                  className="box-border rounded-[8px] bg-blue-600 px-[32px] py-[12px] text-[16px] font-semibold text-white no-underline"
                >
                  Confirm New Email Address
                </Button>
              </Section>

              <SecurityNotice>
                <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                  • Your old email address will remain active until you confirm
                  the new one.
                </Text>
                <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                  • If you didn&apos;t request this change, please contact
                  support immediately.
                </Text>
              </SecurityNotice>

              <Text className="mb-[32px] text-[16px] leading-[24px] text-gray-700">
                Best regards,
                <br />
                Admin
              </Text>
            </Section>

            <FooterEmail email={oldMail} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ChangeEmailTemplate.PreviewProps = {
  name: "John Doe",
  oldMail: "oldemail@example.com",
  newMail: "newemail@example.com",
  url: "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJvZ2RhbnN0YW5pbGE4OUBnbWFpbC5jb20iLCJ1cGRhdGVUbyI6ImJvYmJhcnUzMTFAZ21haWwuY29tIiwiaWF0IjoxNzU5NjIwOTc4LCJleHAiOjE3NTk2MjQ1Nzh9.aC5eRPhcsdt-XAg1e5VUpiRNVXk51JhbFIldbeART80&callbackURL=/settings",
};

export default ChangeEmailTemplate;
