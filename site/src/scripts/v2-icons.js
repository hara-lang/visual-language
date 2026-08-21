function setPressed(buttons, selected) {
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button === selected)));
}

function setSvgSize(svg, size) {
  if (!(svg instanceof SVGElement)) return;
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.style.width = `${size}px`;
  svg.style.height = `${size}px`;
}

function initialiseIconFilters(root) {
  const buttons = [...root.querySelectorAll("[data-icon-filter]")];
  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement) || button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => {
      setPressed(buttons, button);
      const filter = button.dataset.iconFilter || "all";
      root.querySelectorAll("[data-icon-category]").forEach((group) => {
        if (!(group instanceof HTMLElement) || group.hasAttribute("data-icon-card")) return;
        group.hidden = filter !== "all" && group.dataset.iconCategory !== filter;
      });
    });
  });

  root.querySelectorAll("[data-icon-scale]").forEach((select) => {
    if (!(select instanceof HTMLSelectElement) || select.dataset.ready === "true") return;
    select.dataset.ready = "true";
    select.addEventListener("change", () => {
      const size = Number(select.value);
      if (!Number.isFinite(size) || size < 16 || size > 48) return;
      root.querySelectorAll("[data-icon-preview] .hara-icon").forEach((svg) => setSvgSize(svg, size));
    });
  });
}

function initialiseCapabilityFilter(root) {
  root.querySelectorAll("[data-capability-filter]").forEach((select) => {
    if (!(select instanceof HTMLSelectElement) || select.dataset.ready === "true") return;
    select.dataset.ready = "true";
    select.addEventListener("change", () => {
      const filter = select.value;
      root.querySelectorAll("[data-capability-card]").forEach((card) => {
        if (card instanceof HTMLElement) card.hidden = filter !== "all" && card.dataset.capabilityState !== filter;
      });
    });
  });
}

export function initialiseIconGuide(root = document) {
  initialiseIconFilters(root);
  initialiseCapabilityFilter(root);
}
