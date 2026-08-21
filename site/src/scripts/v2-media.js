function setPressed(buttons, selected) {
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button === selected)));
}

function initialiseFormatProjection(root) {
  const buttons = [...root.querySelectorAll("[data-media-format]")];
  const panels = [...root.querySelectorAll("[data-format-panel]")];
  const stage = root.querySelector("[data-media-stage]");

  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement) || button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => {
      const format = button.dataset.mediaFormat;
      setPressed(buttons, button);
      panels.forEach((panel) => {
        if (panel instanceof HTMLElement) panel.hidden = panel.dataset.formatPanel !== format;
      });
      if (stage instanceof HTMLElement) stage.dataset.activeFormat = format || "email";
    });
  });

  root.querySelectorAll("[data-media-state]").forEach((select) => {
    if (!(select instanceof HTMLSelectElement) || select.dataset.ready === "true") return;
    select.dataset.ready = "true";
    select.addEventListener("change", () => {
      root.querySelectorAll("[data-media-stage] .hara-delivery-frame").forEach((frame) => {
        if (frame instanceof HTMLElement) frame.dataset.artifactState = select.value;
      });
    });
  });
}

function initialiseSocialReview(root) {
  const safeZone = root.querySelector("[data-safe-zone-toggle]");
  const textOnly = root.querySelector("[data-social-text-only]");
  const controls = safeZone?.closest(".media-social-controls");
  if (!(controls instanceof HTMLElement)) return;

  const update = () => {
    controls.dataset.safeZones = String(!(safeZone instanceof HTMLInputElement) || safeZone.checked);
    controls.dataset.textOnly = String(textOnly instanceof HTMLInputElement && textOnly.checked);
  };

  for (const input of [safeZone, textOnly]) {
    if (!(input instanceof HTMLInputElement) || input.dataset.ready === "true") continue;
    input.dataset.ready = "true";
    input.addEventListener("change", update);
  }
  update();
}

export function initialiseMediaGuide(root = document) {
  initialiseFormatProjection(root);
  initialiseSocialReview(root);
}
