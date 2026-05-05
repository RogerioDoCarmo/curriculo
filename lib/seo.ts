import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  locale: string;
  url: string;
  image?: string;
  type?: "website" | "profile" | "article";
}

/**
 * Generate comprehensive metadata for SEO optimization
 * Includes Open Graph and Twitter Card tags
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    locale,
    url,
    image = "/og-image.png",
    type = "website",
  } = config;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Rogério do Carmo" }],
    creator: "Rogério do Carmo",
    publisher: "Rogério do Carmo",
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": `${url}/pt-BR`,
        en: `${url}/en`,
        es: `${url}/es`,
      },
    },
    openGraph: {
      type,
      locale,
      url,
      title,
      description,
      siteName: "Rogério do Carmo - Portfolio",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@rogeriodocarmo",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-code",
      yandex: "yandex-verification-code",
    },
  };
}

/**
 * Generate page-specific metadata with locale support
 */
export function generatePageMetadata(
  page: "home" | "projects" | "experience" | "skills" | "contact",
  locale: string,
  baseUrl: string
): Metadata {
  const translations: Record<
    string,
    Record<typeof page, { title: string; description: string; keywords: string[] }>
  > = {
    "pt-BR": {
      home: {
        title: "Rogério do Carmo - Desenvolvedor Mobile Frontend React",
        description:
          "Portfolio profissional de Rogério do Carmo. Desenvolvedor Mobile Frontend React especializado em React, React Native, TypeScript e Java.",
        keywords: [
          "desenvolvedor",
          "mobile frontend",
          "react",
          "react native",
          "typescript",
          "portfolio",
        ],
      },
      projects: {
        title: "Projetos - Rogério do Carmo",
        description:
          "Explore meus projetos de desenvolvimento web e aplicações. Trabalhos com React, Next.js, TypeScript e mais.",
        keywords: ["projetos", "portfolio", "desenvolvimento web", "aplicações"],
      },
      experience: {
        title: "Experiência - Rogério do Carmo",
        description:
          "Minha trajetória profissional e acadêmica como desenvolvedor. Experiências, conquistas e habilidades.",
        keywords: ["experiência", "carreira", "trajetória profissional", "currículo"],
      },
      skills: {
        title: "Habilidades - Rogério do Carmo",
        description:
          "Minhas habilidades técnicas e competências. Linguagens de programação, frameworks e ferramentas.",
        keywords: ["habilidades", "competências", "tecnologias", "ferramentas"],
      },
      contact: {
        title: "Contato - Rogério do Carmo",
        description: "Entre em contato comigo. Envie uma mensagem ou conecte-se nas redes sociais.",
        keywords: ["contato", "email", "mensagem", "redes sociais"],
      },
    },
    en: {
      home: {
        title: "Rogério do Carmo - Mobile Frontend React Developer",
        description:
          "Professional portfolio of Rogério do Carmo. Mobile Frontend React Developer specialized in React, React Native, TypeScript and Java.",
        keywords: [
          "developer",
          "mobile frontend",
          "react",
          "react native",
          "typescript",
          "portfolio",
        ],
      },
      projects: {
        title: "Projects - Rogério do Carmo",
        description:
          "Explore my web development projects and applications. Work with React, Next.js, TypeScript and more.",
        keywords: ["projects", "portfolio", "web development", "applications"],
      },
      experience: {
        title: "Experience - Rogério do Carmo",
        description:
          "My professional and academic journey as a developer. Experiences, achievements and skills.",
        keywords: ["experience", "career", "professional journey", "resume"],
      },
      skills: {
        title: "Skills - Rogério do Carmo",
        description:
          "My technical skills and competencies. Programming languages, frameworks and tools.",
        keywords: ["skills", "competencies", "technologies", "tools"],
      },
      contact: {
        title: "Contact - Rogério do Carmo",
        description: "Get in touch with me. Send a message or connect on social media.",
        keywords: ["contact", "email", "message", "social media"],
      },
    },
    es: {
      home: {
        title: "Rogério do Carmo - Desarrollador Mobile Frontend React",
        description:
          "Portafolio profesional de Rogério do Carmo. Desarrollador Mobile Frontend React especializado en React, React Native, TypeScript y Java.",
        keywords: [
          "desarrollador",
          "mobile frontend",
          "react",
          "react native",
          "typescript",
          "portafolio",
        ],
      },
      projects: {
        title: "Proyectos - Rogério do Carmo",
        description:
          "Explora mis proyectos de desarrollo web y aplicaciones. Trabajos con React, Next.js, TypeScript y más.",
        keywords: ["proyectos", "portafolio", "desarrollo web", "aplicaciones"],
      },
      experience: {
        title: "Experiencia - Rogério do Carmo",
        description:
          "Mi trayectoria profesional y académica como desarrollador. Experiencias, logros y habilidades.",
        keywords: ["experiencia", "carrera", "trayectoria profesional", "currículum"],
      },
      skills: {
        title: "Habilidades - Rogério do Carmo",
        description:
          "Mis habilidades técnicas y competencias. Lenguajes de programación, frameworks y herramientas.",
        keywords: ["habilidades", "competencias", "tecnologías", "herramientas"],
      },
      contact: {
        title: "Contacto - Rogério do Carmo",
        description: "Ponte en contacto conmigo. Envía un mensaje o conéctate en redes sociales.",
        keywords: ["contacto", "email", "mensaje", "redes sociales"],
      },
    },
  };

  const pageData = translations[locale]?.[page] || translations["pt-BR"][page];

  return generateMetadata({
    ...pageData,
    locale,
    url: `${baseUrl}/${locale}${page === "home" ? "" : `/${page}`}`,
  });
}
