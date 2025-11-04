import { APP_NAME } from "@/constants/misc";
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
import ConfirmationLink from "../components/confirmation-link";
import FooterEmail from "../components/footer";
import HeaderEmail from "../components/header";
import SecurityNotice from "../components/security-notice";

interface Props {
  name: string;
  email: string;
  url: string;
}

const ConfirmEmailTemplate = ({ name, email, url }: Props) => {
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
        <Preview>Confirm your email address - Action required</Preview>
        <Body className="my-[10px] bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
            <HeaderEmail title={`Welcome to ${APP_NAME}!`} />

            <Section>
              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Hi <strong>{name}</strong>,
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Thank you for signing up! We&apos;re excited to have you join
                our community. To get started and ensure the security of your
                account, please confirm your email address by clicking the
                button below.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={url}
                  className="box-border rounded-[8px] bg-blue-600 px-[32px] py-[12px] text-[16px] font-semibold text-white no-underline"
                >
                  Confirm Email Address
                </Button>
              </Section>

              <Text className="mb-[24px] text-[14px] leading-[20px] text-gray-600">
                Email confirmation helps us verify that you&apos;re the owner of
                this email address and keeps your account secure from
                unauthorized access.
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Once confirmed, you&apos;ll have full access to your account and
                can start exploring all the features we have to offer.
                You&apos;ll be able to customize your profile, access premium
                content, and receive important updates.
              </Text>

              <SecurityNotice>
                <ConfirmationLink time={"1 hour"} />
              </SecurityNotice>

              <Text className="mb-[32px] text-[16px] leading-[24px] text-gray-700">
                Best regards,
                <br />
                Admin
              </Text>
            </Section>

            <FooterEmail email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ConfirmEmailTemplate.PreviewProps = {
  name: "John Doe",
  email: "email@example.com",
  url: "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJvZ2RhbnN0YW5pbGE4OUBnbWFpbC5jb20iLCJ1cGRhdGVUbyI6ImJvYmJhcnUzMTFAZ21haWwuY29tIiwiaWF0IjoxNzU5NjIwOTc4LCJleHAiOjE3NTk2MjQ1Nzh9.aC5eRPhcsdt-XAg1e5VUpiRNVXk51JhbFIldbeART80&callbackURL=/settings",
};

export default ConfirmEmailTemplate;
