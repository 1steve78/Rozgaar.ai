import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fbff] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
