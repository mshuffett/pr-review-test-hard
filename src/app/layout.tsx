import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PR Review Test App",
  description: "Test fixture for PR review skill evaluation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
