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
import ConfirmationLink from "../components/confirmation-link";

interface Props {
  name: string;
  email: string;
  url: string;
}

const DeleteAccountTemplate = ({ name, email, url }: Props) => {
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
        <Preview>Confirm account deletion - Action required</Preview>
        <Body className="my-[10px] bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
            <HeaderEmail
              title="Confirm account deletion"
              description="We received a request to delete your account"
            />

            <Section>
              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Hi <strong>{name}</strong>,
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                We received a request to permanently delete your account
                associated with <strong>{email}</strong>. This action cannot be
                undone and will remove all your data, settings, and content.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={url}
                  className="box-border rounded-[8px] bg-red-600 px-[32px] py-[12px] text-[16px] font-semibold text-white no-underline"
                >
                  Yes, delete my account
                </Button>
              </Section>

              <SecurityNotice title="Important Warning!">
                <Text className="text-[14px] leading-[20px] text-gray-600">
                  Account deletion is <strong>permanent</strong> and{" "}
                  <strong>cannot be reversed</strong>. You will lose:
                </Text>
                <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                  • All your personal data and settings
                </Text>
                <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                  • Your content and files
                </Text>
                <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                  • Access to all services
                </Text>
                <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                  • Your account history
                </Text>
              </SecurityNotice>

              <SecurityNotice>
                <Text className="text-[14px] leading-[20px] text-gray-600">
                  If you didn&apos;t request this account deletion, please
                  contact our support team immediately. Someone may have
                  unauthorized access to your account.
                </Text>

                <ConfirmationLink time={"1 hour"} />
              </SecurityNotice>

              <Text className="m-0 text-[16px] leading-[24px] text-gray-700">
                We&apos;re sorry to see you go. If you have any feedback about
                your experience, we&apos;d love to hear from you.
              </Text>

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

DeleteAccountTemplate.PreviewProps = {
  name: "John Doe",
  email: "email@example.com",
  url: "http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJvZ2RhbnN0YW5pbGE4OUBnbWFpbC5jb20iLCJ1cGRhdGVUbyI6ImJvYmJhcnUzMTFAZ21haWwuY29tIiwiaWF0IjoxNzU5NjIwOTc4LCJleHAiOjE3NTk2MjQ1Nzh9.aC5eRPhcsdt-XAg1e5VUpiRNVXk51JhbFIldbeART80&callbackURL=/settings",
};

export default DeleteAccountTemplate;
