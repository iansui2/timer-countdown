import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Timer Countdown",
  description: "A modern countdown timer app",
  icons: {
    icon: "/timer.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}