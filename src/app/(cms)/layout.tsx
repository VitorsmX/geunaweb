export const metadata = {
  title: "Outstatic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="yes">
      <body>
        {children}
      </body>
    </html>
  );
}
