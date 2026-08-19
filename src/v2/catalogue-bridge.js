const routeDetails = (pathname) => {
  if (pathname.includes("/v2/world/discussion/")) return { label: "World / Discussion", parentLabel: "World", parentPath: "/v2/world/" };
  if (pathname.includes("/v2/world/around/")) return { label: "World / Around Hara", parentLabel: "World", parentPath: "/v2/world/" };
  if (pathname.includes("/v2/world/community/")) return { label: "Learn / Community study", parentLabel: "Learn", parentPath: "/v2/learn/" };
  if (pathname.includes("/v2/world/onboarding/")) return { label: "Learn / Onboarding study", parentLabel: "Learn", parentPath: "/v2/learn/" };
  if (pathname.includes("/v2/world/")) return { label: "World / Overview", parentLabel: "Applications", parentPath: "/v2/#catalogue-applications" };
  return { label: "Application study", parentLabel: "Catalogue", parentPath: "/v2/" };
};

const catalogueBase = (pathname) => {
  const marker = "/v2/";
  const index = pathname.indexOf(marker);
  return index >= 0 ? `${pathname.slice(0, index)}/` : "/";
};

const withBase = (base, path) => `${base}${path.replace(/^\/+/, "")}`;

export function initialiseCatalogueBridges() {
  document.querySelectorAll("body.hara-v2 > header.v2-lab-header").forEach((header) => {
    if (!(header instanceof HTMLElement) || header.dataset.catalogueBridgeReady === "true") return;
    header.dataset.catalogueBridgeReady = "true";

    const pathname = window.location.pathname;
    const base = catalogueBase(pathname);
    const home = withBase(base, "/v2/");
    const details = routeDetails(pathname);
    const brand = header.querySelector(":scope > .v2-lab-brand");
    const sectionNav = header.querySelector(":scope > nav");
    const theme = header.querySelector(":scope > [data-hara-theme-toggle]");

    if (brand instanceof HTMLAnchorElement) {
      brand.href = home;
      brand.setAttribute("aria-label", "Back to the Hara visual-language catalogue");
    }
    if (sectionNav instanceof HTMLElement) sectionNav.dataset.legacySectionNav = "true";

    const groups = document.createElement("nav");
    groups.className = "v2-legacy-catalogue-groups";
    groups.setAttribute("aria-label", "Visual language catalogue");
    [
      ["Foundations", "/v2/#catalogue-foundations"],
      ["Library", "/v2/#catalogue-library"],
      ["Applications", "/v2/#catalogue-applications"]
    ].forEach(([label, path]) => {
      const link = document.createElement("a");
      link.href = withBase(base, path);
      link.textContent = label;
      if (label === "Applications") link.setAttribute("aria-current", "location");
      groups.append(link);
    });

    const back = document.createElement("a");
    back.className = "v2-legacy-parent-link";
    back.href = withBase(base, details.parentPath);
    back.textContent = `← ${details.parentLabel}`;
    back.setAttribute("aria-label", `Back to ${details.parentLabel}`);

    const location = document.createElement("span");
    location.className = "v2-legacy-route-label";
    location.textContent = details.label;

    header.insertBefore(groups, theme ?? sectionNav ?? null);
    header.insertBefore(back, theme ?? sectionNav ?? null);
    header.insertBefore(location, sectionNav ?? null);
  });
}
