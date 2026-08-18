import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteConfigProvider } from "@/components/layout/SiteConfigProvider";
import { getStoreConfig } from "@/lib/store-config.server";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings.metaTitle || settings.siteTitle || "AGMERZ ESTATE",
      description: settings.metaDescription || settings.description,
      ...(settings.faviconUrl ? { icons: { icon: settings.faviconUrl } } : {}),
      ...(settings.ogImage
        ? { openGraph: { images: [{ url: settings.ogImage }] } }
        : {}),
    };
  } catch {
    return {
      title: "AGMERZ ESTATE",
      description: "Premium real estate agency",
    };
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getStoreConfig();

  return (
    <SiteConfigProvider config={config}>
      <div className="flex min-h-screen flex-col">
        <Header config={config} />
        <main className="flex-1">{children}</main>
        <Footer config={config} />
      </div>
    </SiteConfigProvider>
  );
}
