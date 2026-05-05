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
      jobTitle: "Desenvolvedor Mobile Frontend React",
      description:
        "Desenvolvedor Mobile Frontend React especializado em React, React Native, TypeScript e Java. Experiência em desenvolvimento web moderno e arquitetura de software.",
    },
    en: {
      name: "Rogério do Carmo",
      jobTitle: "Mobile Frontend React Developer",
      description:
        "Mobile Frontend React Developer specialized in React, React Native, TypeScript and Java. Experience in modern web development and software architecture.",
    },
    es: {
      name: "Rogério do Carmo",
      jobTitle: "Desarrollador Mobile Frontend React",
      description:
        "Desarrollador Mobile Frontend React especializado en React, React Native, TypeScript y Java. Experiencia en desarrollo web moderno y arquitectura de software.",
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
      "React Native",
      "Java",
      "Web Development",
      "Software Architecture",
      "Mobile Frontend Development",
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
