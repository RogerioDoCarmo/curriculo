"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/types/index";
import { buildProjectHistoryUrl, readProjectParam } from "@/lib/project-deep-link";

/**
 * State for the project detail dialog, mirrored into the URL as `?project=<id>`
 * so a project can be linked to and the Back button closes it.
 *
 * `projects` is every project that may be linked to, not only the ones on
 * screen: the home page shows three but still opens a deep link to any of them.
 * `hash` is the section to keep in the URL (the home page's `#projects`) and to
 * scroll to on arrival; the projects page has no section and passes `null`.
 */
export function useProjectDialog(projects: readonly Project[], hash: string | null) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  /**
   * Mirrors the open project into the URL without navigating.
   *
   * The no-op guard compares against the live URL rather than a remembered
   * value, so it can never drift out of step with history: clearing the
   * selection makes the dialog fire its close event a second time, and a back
   * navigation closes the dialog when the URL has *already* dropped the param —
   * pushing there would truncate the forward entry the reader just came from.
   */
  const syncUrl = useCallback(
    (projectId: string | null, mode: "push" | "replace") => {
      if (readProjectParam(window.location.search) === projectId) return;

      const url = buildProjectHistoryUrl({
        pathname: window.location.pathname,
        search: window.location.search,
        projectId,
        hash,
      });
      if (mode === "push") {
        window.history.pushState(null, "", url);
      } else {
        window.history.replaceState(null, "", url);
      }
    },
    [hash]
  );

  const open = useCallback(
    (project: Project) => {
      setSelectedProject(project);
      syncUrl(project.id, "push");
    },
    [syncUrl]
  );

  const close = useCallback(() => {
    setSelectedProject(null);
    syncUrl(null, "push");
  }, [syncUrl]);

  /** Moves to another project inside the open dialog. Replaces, so stepping doesn't flood history. */
  const step = useCallback(
    (project: Project) => {
      setSelectedProject(project);
      syncUrl(project.id, "replace");
    },
    [syncUrl]
  );

  // Deep link: `?project=<id>` opens that project's dialog on arrival. Runs
  // once — later param changes come through popstate instead.
  const deepLinkHandledRef = useRef(false);
  useEffect(() => {
    if (deepLinkHandledRef.current) return;
    deepLinkHandledRef.current = true;

    const id = readProjectParam(window.location.search);
    if (id === null) return;
    // An unknown id is ignored: the page renders normally, dialog stays closed.
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    // Scroll first, and instantly: the page has `scroll-behavior: smooth`, and
    // the modal's body scroll lock would cancel an animated scroll partway
    // through, leaving the reader parked at the top of the page instead.
    if (hash !== null) {
      document.getElementById(hash)?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    setSelectedProject(project);
  }, [projects, hash]);

  // Back/forward moves through the opened projects; state follows the URL here,
  // never the other way around (pushing from this handler would fight history).
  useEffect(() => {
    const handlePopstate = () => {
      const id = readProjectParam(window.location.search);
      setSelectedProject(id === null ? null : (projects.find((p) => p.id === id) ?? null));
    };
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [projects]);

  return { selectedProject, open, close, step };
}
