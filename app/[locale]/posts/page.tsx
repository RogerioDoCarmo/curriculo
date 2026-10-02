import { setRequestLocale, getTranslations } from "next-intl/server";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/content";
import PostsPage from "@/components/PostsPage";

interface PostsRouteProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PostsRouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "posts" });

  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  };
}

export default async function PostsRoute({ params }: PostsRouteProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  const posts = await getPosts(locale);

  return (
    <main className="min-h-screen">
      <PostsPage posts={posts} locale={locale} />
    </main>
  );
}
