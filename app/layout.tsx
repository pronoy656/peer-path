import "./globals.css";
import { AppStoreProvider } from "@/lib/store/AppStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
