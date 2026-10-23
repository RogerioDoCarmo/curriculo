/**
 * Unit tests for OfflineDetectorProvider
 *
 * The real @rogeriodocarmo/offline-detector-web component is mocked here —
 * its own behavior (probing, snackbar/banner/indicator rendering) is the
 * library's responsibility and is covered end-to-end by the Playwright
 * offline-detector spec. This test only verifies the wrapper's own
 * responsibility: passing children and locale through correctly.
 */

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import OfflineDetectorProvider from "@/components/OfflineDetectorProvider";

const mockUseLocale = jest.fn();

jest.mock("next-intl", () => ({
  useLocale: () => mockUseLocale(),
}));

const mockUseTheme = jest.fn();

jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => mockUseTheme(),
}));

const mockOfflineDetector = jest.fn(({ children }: { readonly children: React.ReactNode }) => (
  <>{children}</>
));

jest.mock("@rogeriodocarmo/offline-detector-web", () => ({
  OfflineDetector: (props: { readonly children: React.ReactNode }) => mockOfflineDetector(props),
}));

function renderProvider(children: ReactNode = <div data-testid="app-content">App</div>) {
  return render(<OfflineDetectorProvider>{children}</OfflineDetectorProvider>);
}

describe("OfflineDetectorProvider", () => {
  beforeEach(() => {
    mockOfflineDetector.mockClear();
    mockUseLocale.mockReturnValue("en");
    mockUseTheme.mockReturnValue({ theme: "light" });
  });

  it("renders its children", () => {
    renderProvider();

    expect(screen.getByTestId("app-content")).toBeInTheDocument();
  });

  it.each(["en", "pt-BR", "es"])(
    "passes the next-intl locale %s through to OfflineDetector",
    (locale) => {
      mockUseLocale.mockReturnValue(locale);

      renderProvider();

      expect(mockOfflineDetector).toHaveBeenCalledWith(expect.objectContaining({ locale }));
    }
  );

  it("passes the site's own theme through as colorScheme", () => {
    mockUseTheme.mockReturnValue({ theme: "dark" });

    renderProvider();

    expect(mockOfflineDetector).toHaveBeenCalledWith(
      expect.objectContaining({ colorScheme: "dark" })
    );
  });

  it("shows no piece while online (the mocked detector renders only children)", () => {
    renderProvider();

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
