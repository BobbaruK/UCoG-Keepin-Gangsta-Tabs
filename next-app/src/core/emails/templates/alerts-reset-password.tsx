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

const ResetPasswordTemplate = ({ name, email, url }: Props) => {
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
        <Preview>Reset your password - Action required</Preview>
        <Body className="my-[10px] bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
            <HeaderEmail
              title="Reset your password"
              description="We received a request to reset your password"
            />

            <Section>
              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Hi <strong>{name}</strong>,
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                We received a password reset request for your account associated
                with <strong>{email}</strong>. If you made this request, click
                the button below to reset your password.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={url}
                  className="box-border rounded-[8px] bg-blue-600 px-[32px] py-[12px] text-[16px] font-semibold text-white no-underline"
                >
                  Confirm Email Address
                </Button>
              </Section>

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

ResetPasswordTemplate.PreviewProps = {
  name: "John Doe",
  email: "email@example.com",
  url: "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJvZ2RhbnN0YW5pbGE4OUBnbWFpbC5jb20iLCJ1cGRhdGVUbyI6ImJvYmJhcnUzMTFAZ21haWwuY29tIiwiaWF0IjoxNzU5NjIwOTc4LCJleHAiOjE3NTk2MjQ1Nzh9.aC5eRPhcsdt-XAg1e5VUpiRNVXk51JhbFIldbeART80&callbackURL=/settings",
};

export default ResetPasswordTemplate;
