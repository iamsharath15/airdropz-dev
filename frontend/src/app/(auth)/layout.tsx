// done v1
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="items-center justify-center flex min-h-screen w-full">
      {children}
    </div>
  );
}
