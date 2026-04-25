import { Person, WebSite, WithContext } from "schema-dts";

/**
 * Generate Schema.org Person structured data
 * Includes all essential properties for professional profile
 */
export function generatePersonSchema(locale: string): WithContext<Person> {
  const translations: Record<
    string,
    {
      name: string;
      jobTitle: string;
      description: string;
    }
  > = {
    "pt-BR": {
      name: "Rogério do Carmo",
      jobTitle: "Desenvolvedor Full Stack",
      description:
        "Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e Node.js. Experiência em desenvolvimento web moderno e arquitetura de software.",
    },
    en: {
      name: "Rogério do Carmo",
      jobTitle: "Full Stack Developer",
      description:
        "Full Stack Developer specialized in React, Next.js, TypeScript and Node.js. Experience in modern web development and software architecture.",
    },
    es: {
      name: "Rogério do Carmo",
      jobTitle: "Desarrollador Full Stack",
      description:
        "Desarrollador Full Stack especializado en React, Next.js, TypeScript y Node.js. Experiencia en desarrollo web moderno y arquitectura de software.",
    },
  };

  const data = translations[locale] || translations["pt-BR"];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url: "https://rogeriodocarmo.com",
    sameAs: [
      "https://github.com/RogerioDoCarmo/curriculo",
      "https://www.linkedin.com/in/rogeriodocarmo/",
      "https://twitter.com/rogeriodocarmo",
    ],
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Web Development",
      "Software Architecture",
      "Full Stack Development",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Educational Institution",
    },
    email: "contact@rogeriodocarmo.com",
    image: "https://rogeriodocarmo.com/profile.jpg",
  };
}

/**
 * Generate Schema.org WebSite structured data
 */
export function generateWebSiteSchema(locale: string): WithContext<WebSite> {
  const translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  > = {
    "pt-BR": {
      name: "Rogério do Carmo - Portfolio",
      description: "Portfolio profissional de Rogério do Carmo",
    },
    en: {
      name: "Rogério do Carmo - Portfolio",
      description: "Professional portfolio of Rogério do Carmo",
    },
    es: {
      name: "Rogério do Carmo - Portafolio",
      description: "Portafolio profesional de Rogério do Carmo",
    },
  };

  const data = translations[locale] || translations["pt-BR"];

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    description: data.description,
    url: "https://rogeriodocarmo.com",
    inLanguage: [locale, "pt-BR", "en", "es"],
    author: {
      "@type": "Person",
      name: "Rogério do Carmo",
    },
  };
}

/**
 * Generate JSON-LD script tag for embedding structured data
 */
export function generateStructuredDataScript(locale: string): {
  personSchema: string;
  webSiteSchema: string;
} {
  return {
    personSchema: JSON.stringify(generatePersonSchema(locale)),
    webSiteSchema: JSON.stringify(generateWebSiteSchema(locale)),
  };
}
