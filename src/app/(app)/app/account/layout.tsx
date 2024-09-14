import Header from "@/components/dashboard-header";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col max-w-[1050px] min-h-screen mx-auto px-4">
      <Header />
      {children}
    </div>
  );
}
