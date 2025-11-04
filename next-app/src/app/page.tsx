import { Header } from "@/components/layout/header";

export default async function Home() {
  return (
    <>
      <Header />
      <div className="container flex flex-col items-center gap-4 py-4">
        <h1>Boilerplate for better auth</h1>
      </div>
    </>
  );
}
