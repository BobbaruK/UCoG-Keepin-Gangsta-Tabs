import {
  Body,
  Button,
  CodeBlock,
  CodeInline,
  Column,
  Container,
  dracula,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Markdown,
  Preview,
  Row,
  Text,
  Section,
  Tailwind,
} from "@react-email/components";

interface Props {
  name: string;
  email: string;
}

const TestEmail = ({ email, name }: Props) => {
  const code = `export default async (req, res) => {
  try {
    const html = await renderAsync(
      EmailTemplate({ firstName: 'John' })
    );
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error });
  }
}`;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head>
          <title>Reset your password - Action required</title>
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
        <Body className="font-sans">
          <Container className="mx-auto max-w-[650px] bg-gray-100 p-[40px] shadow-sm">
            <Section className="py-[20px]">
              <Text>Name: {name}</Text>
              <Text>Email: {email}</Text>
            </Section>

            <Section className="py-[20px]">
              <Button
                href="https://example.com"
                style={{ color: "#61dafb", padding: "10px 20px" }}
              >
                Click me
              </Button>
            </Section>

            <Section className="py-[20px]">
              <CodeBlock
                code={code}
                lineNumbers // add this so that there are line numbers beside each code line
                theme={dracula}
                language="javascript"
              />
            </Section>

            <Section className="py-[20px]">
              cutare <CodeInline>@react-email/code-inline</CodeInline>
            </Section>
            <Section className="py-[20px]">
              <Row>
                <Column>A</Column>
                <Column>B</Column>
                <Column>C</Column>
              </Row>
            </Section>
            <Section className="py-[20px]">
              <Heading as="h1">Heading h1</Heading>
              <Heading as="h2">Heading h2</Heading>
              <Heading as="h3">Heading h3</Heading>
              <Heading as="h4">Heading h4</Heading>
              <Heading as="h5">Heading h5</Heading>
              <Heading as="h6">Heading h6</Heading>
            </Section>
            <Section className="py-[20px]">
              <Hr />
            </Section>
            <Section className="py-[20px]">
              <Img
                src="https://d2ph5fj80uercy.cloudfront.net/06/cat1589.jpg"
                alt="Cat"
                width="300"
                height="300"
              />
            </Section>
            <Section className="py-[20px]">
              <Link href="https://example.com">Example</Link>
            </Section>
            <Section className="py-[20px]">
              <Markdown
                markdownCustomStyles={{
                  h1: { color: "red" },
                  h2: { color: "blue" },
                  codeInline: { background: "grey" },
                }}
                markdownContainerStyles={{
                  padding: "12px",
                  border: "solid 1px black",
                }}
              >{`# Hello, World!`}</Markdown>
            </Section>
            <Section className="py-[20px]">
              <Text>Lorem ipsum</Text>
            </Section>
            <Section className="py-[20px]"></Section>
            <Section className="py-[20px]"></Section>
            <Section className="py-[20px]"></Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

TestEmail.PreviewProps = {
  name: "John Doe",
  email: "email@example.com",
};

export default TestEmail;
