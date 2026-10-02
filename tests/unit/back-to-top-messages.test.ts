/**
 * The layout passes `backToTop.label` to BackToTopButton, whose own default is
 * English. If a locale loses the key, that locale would silently fall back to
 * English (the bug this replaced), so every locale must carry its own text.
 */

import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ptBR from "@/messages/pt-BR.json";

describe("backToTop.label", () => {
  it.each([
    ["en", en, "Back to top"],
    ["pt-BR", ptBR, "Voltar ao topo"],
    ["es", es, "Volver arriba"],
  ])("is translated in %s", (_locale, messages, expected) => {
    expect(messages.backToTop.label).toBe(expected);
  });
});
