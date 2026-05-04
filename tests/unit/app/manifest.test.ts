/**
 * Tests for Web App Manifest
 *
 * Validates the PWA manifest configuration for mobile installation
 */

import manifest from "@/app/manifest";

describe("Web App Manifest", () => {
  let manifestData: ReturnType<typeof manifest>;

  beforeEach(() => {
    manifestData = manifest();
  });

  describe("Basic Properties", () => {
    it("should have a full name for app stores and install prompts", () => {
      expect(manifestData.name).toBeDefined();
      expect(manifestData.name).toBe("Rogério do Carmo | Desenvolvedor React Native Mobile");
      expect(manifestData.name).toBeTruthy();
      if (manifestData.name) {
        expect(manifestData.name.length).toBeGreaterThan(0);
      }
    });

    it("should have a short name for home screen display", () => {
      expect(manifestData.short_name).toBeDefined();
      expect(manifestData.short_name).toBe("Rogério do Carmo");
      expect(manifestData.short_name).toBeTruthy();
      if (manifestData.short_name && manifestData.name) {
        expect(manifestData.short_name.length).toBeLessThan(manifestData.name.length);
      }
    });

    it("should have a description", () => {
      expect(manifestData.description).toBeTruthy();
      expect(manifestData.description).toContain("Rogério do Carmo");
      expect(manifestData.description).toContain("React Native");
    });

    it("should have a start URL", () => {
      expect(manifestData.start_url).toBe("/");
    });

    it("should use standalone display mode", () => {
      expect(manifestData.display).toBe("standalone");
    });
  });

  describe("Theme and Colors", () => {
    it("should have a white background color", () => {
      expect(manifestData.background_color).toBe("#ffffff");
    });

    it("should have a primary blue theme color", () => {
      expect(manifestData.theme_color).toBe("#2563eb");
    });

    it("should have valid hex color codes", () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(manifestData.background_color).toMatch(hexColorRegex);
      expect(manifestData.theme_color).toMatch(hexColorRegex);
    });
  });

  describe("Icons", () => {
    it("should have at least one icon", () => {
      expect(manifestData.icons).toBeDefined();
      expect(Array.isArray(manifestData.icons)).toBe(true);
      if (manifestData.icons) {
        expect(manifestData.icons.length).toBeGreaterThan(0);
      }
    });

    it("should have an SVG icon", () => {
      expect(manifestData.icons).toBeDefined();
      if (manifestData.icons) {
        const svgIcon = manifestData.icons.find((icon) => icon.type === "image/svg+xml");
        expect(svgIcon).toBeDefined();
        if (svgIcon) {
          expect(svgIcon.src).toBe("/icon.svg");
        }
      }
    });

    it("should have proper icon configuration", () => {
      expect(manifestData.icons).toBeDefined();
      if (manifestData.icons && manifestData.icons.length > 0) {
        const icon = manifestData.icons[0];
        expect(icon.src).toBeTruthy();
        expect(icon.sizes).toBe("any");
        expect(icon.type).toBe("image/svg+xml");
        expect(icon.purpose).toBe("any");
      }
    });

    it("should have valid purpose values", () => {
      const validPurposes = ["any", "maskable", "monochrome", undefined];
      expect(manifestData.icons).toBeDefined();
      if (manifestData.icons) {
        manifestData.icons.forEach((icon) => {
          expect(validPurposes).toContain(icon.purpose);
        });
      }
    });
  });

  describe("PWA Requirements", () => {
    it("should meet minimum PWA manifest requirements", () => {
      // PWA requires: name, short_name, start_url, display, icons
      expect(manifestData.name).toBeTruthy();
      expect(manifestData.short_name).toBeTruthy();
      expect(manifestData.start_url).toBeTruthy();
      expect(manifestData.display).toBeTruthy();
      expect(manifestData.icons).toBeTruthy();
      if (manifestData.icons) {
        expect(manifestData.icons.length).toBeGreaterThan(0);
      }
    });

    it("should have appropriate display mode for standalone app", () => {
      const validDisplayModes = ["standalone", "fullscreen", "minimal-ui", "browser"];
      expect(validDisplayModes).toContain(manifestData.display);
    });
  });

  describe("Short Name Optimization", () => {
    it("should have a short name suitable for mobile home screens", () => {
      expect(manifestData.short_name).toBeDefined();
      // Mobile home screens typically show 10-12 characters
      if (manifestData.short_name) {
        expect(manifestData.short_name.length).toBeLessThanOrEqual(20);
      }
    });

    it("should have short name different from full name", () => {
      expect(manifestData.short_name).toBeDefined();
      expect(manifestData.name).toBeDefined();
      expect(manifestData.short_name).not.toBe(manifestData.name);
    });

    it("should have short name that is a subset of full name", () => {
      expect(manifestData.name).toBeDefined();
      expect(manifestData.short_name).toBeDefined();
      if (manifestData.name) {
        expect(manifestData.name).toContain("Rogério do Carmo");
      }
      expect(manifestData.short_name).toBe("Rogério do Carmo");
    });
  });

  describe("Branding Consistency", () => {
    it("should use consistent branding in name and description", () => {
      const brandName = "Rogério do Carmo";
      expect(manifestData.name).toBeDefined();
      expect(manifestData.short_name).toBeDefined();
      expect(manifestData.description).toBeDefined();
      expect(manifestData.name).toContain(brandName);
      expect(manifestData.short_name).toContain(brandName);
      expect(manifestData.description).toContain(brandName);
    });

    it("should mention React Native in branding", () => {
      expect(manifestData.name).toBeDefined();
      expect(manifestData.description).toBeDefined();
      expect(manifestData.name).toContain("React Native");
      expect(manifestData.description).toContain("React Native");
    });
  });

  describe("Type Safety", () => {
    it("should return a valid MetadataRoute.Manifest type", () => {
      expect(typeof manifestData).toBe("object");
      expect(manifestData).not.toBeNull();
    });

    it("should have all required string properties as strings", () => {
      expect(typeof manifestData.name).toBe("string");
      expect(typeof manifestData.short_name).toBe("string");
      expect(typeof manifestData.description).toBe("string");
      expect(typeof manifestData.start_url).toBe("string");
      expect(typeof manifestData.display).toBe("string");
      expect(typeof manifestData.background_color).toBe("string");
      expect(typeof manifestData.theme_color).toBe("string");
    });

    it("should have icons as an array", () => {
      expect(Array.isArray(manifestData.icons)).toBe(true);
    });
  });
});
