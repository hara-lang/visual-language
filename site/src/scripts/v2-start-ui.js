import { initialiseHabitat } from "./v2-start-habitat.js";

export function initialiseStart() {
      const briefNode = document.querySelector("[data-agent-brief]");
      const briefTemplate = briefNode?.textContent?.trim() ?? "";
      const intentButtons = [...document.querySelectorAll("[data-intent]")];
      const selectedIntent = document.querySelector("[data-selected-intent]");
      const statusMessage = document.querySelector("[data-status-message]");

      const announce = (message) => {
        if (statusMessage) statusMessage.textContent = message;
      };

      const renderBrief = (prompt) => {
        if (!briefNode) return;
        briefNode.textContent = briefTemplate.replace(/My first goal: .*\./, `My first goal: ${prompt}.`);
        if (selectedIntent) selectedIntent.textContent = prompt;
      };

      intentButtons.forEach((button) => {
        button.addEventListener("click", () => {
          intentButtons.forEach((candidate) => {
            const active = candidate === button;
            candidate.classList.toggle("is-active", active);
            candidate.setAttribute("aria-pressed", String(active));
          });
          renderBrief(button.dataset.intentPrompt ?? "build something useful");
          announce(`Agent brief updated for: ${button.dataset.intentPrompt}`);
        });
      });

      const copyAgentBrief = async (button) => {
        const text = briefNode?.textContent?.trim() ?? briefTemplate;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.append(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        const original = button.textContent;
        button.textContent = "Brief copied";
        announce("Agent brief copied to clipboard");
        window.setTimeout(() => { button.textContent = original; }, 1800);
      };

      document.querySelectorAll("[data-copy-agent-brief]").forEach((button) => {
        button.addEventListener("click", () => copyAgentBrief(button));
      });

      const scanButton = document.querySelector("[data-run-scan]");
      const scanRows = [...document.querySelectorAll("[data-scan-row]")];
      const scanSummary = document.querySelector("[data-scan-summary]");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const runVisualScan = async () => {
        if (!scanButton || scanButton.disabled) return;
        scanButton.disabled = true;
        scanButton.textContent = "Scanning specimen…";
        if (scanSummary) scanSummary.textContent = "Reading visible repository evidence";
        for (let index = 0; index < scanRows.length; index += 1) {
          const row = scanRows[index];
          row.dataset.state = "checking";
          row.querySelector("output").textContent = "checking";
          if (!reduceMotion) await new Promise((resolve) => window.setTimeout(resolve, 260));
          row.dataset.state = index === 3 ? "gap" : "found";
          row.querySelector("output").textContent = index === 3 ? "gap" : index === 4 ? "candidate" : "found";
        }
        if (scanSummary) scanSummary.textContent = "3 evidence surfaces · 1 contract gap · 1 candidate";
        scanButton.textContent = "Scan model complete";
        announce("Visual repository scan complete. Habitat is a candidate, not a verified Hara recipe.");
      };

      scanButton?.addEventListener("click", runVisualScan);

      const recipeData = {
        habitat: {
          title: "Build Hara Habitat first.",
          why: "It makes Hara's live session, explicit state, and capability boundaries visible before syntax becomes the lesson.",
          href: "#habitat",
          action: "Open Habitat workbench"
        },
        receipts: {
          title: "Build a work receipt explorer.",
          why: "This is the strongest automation path: start with one repeated task, expose every boundary, and make retry and completion evidence visible.",
          href: "#graduate",
          action: "Inspect the durable path"
        },
        inspector: {
          title: "Build a live session inspector.",
          why: "This suits systems programmers who want to understand Hara by operating session state, events, generations, and source revisions directly.",
          href: "#habitat",
          action: "Inspect the session model"
        }
      };

      const recipeCards = [...document.querySelectorAll("[data-recipe-card]")];
      const recommendationTitle = document.querySelector("[data-recommendation-title]");
      const recommendationWhy = document.querySelector("[data-recommendation-why]");
      const recommendationLink = document.querySelector("[data-open-recommendation]");

      document.querySelectorAll("[data-recipe-select]").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.recipeSelect;
          const recipe = recipeData[id];
          if (!recipe) return;
          recipeCards.forEach((card) => card.classList.toggle("is-selected", card.dataset.recipeCard === id));
          document.querySelectorAll("[data-recipe-select]").forEach((candidate) => {
            const active = candidate === button;
            candidate.setAttribute("aria-pressed", String(active));
            candidate.textContent = active ? "Selected direction" : "Choose this direction";
          });
          if (recommendationTitle) recommendationTitle.textContent = recipe.title;
          if (recommendationWhy) recommendationWhy.textContent = recipe.why;
          if (recommendationLink) {
            recommendationLink.href = recipe.href;
            recommendationLink.textContent = recipe.action;
          }
          announce(`${recipe.title} selected`);
        });
      });

      document.querySelectorAll("[data-rail-tab]").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.railTab;
          document.querySelectorAll("[data-rail-tab]").forEach((candidate) => {
            const active = candidate === button;
            candidate.classList.toggle("is-active", active);
            candidate.setAttribute("aria-selected", String(active));
          });
          document.querySelectorAll("[data-rail-panel]").forEach((panel) => {
            panel.hidden = panel.dataset.railPanel !== id;
          });
        });
      });

      const selectWorkbenchTab = (id) => {
        document.querySelectorAll("[data-workbench-tab]").forEach((button) => {
          const active = button.dataset.workbenchTab === id;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-selected", String(active));
        });
        document.querySelectorAll("[data-workbench-panel]").forEach((panel) => {
          panel.hidden = panel.dataset.workbenchPanel !== id;
        });
      };

      document.querySelectorAll("[data-workbench-tab]").forEach((button) => {
        button.addEventListener("click", () => selectWorkbenchTab(button.dataset.workbenchTab));
      });
      document.querySelector("[data-code-focus]")?.addEventListener("click", () => selectWorkbenchTab("code"));
      document.querySelector("[data-receipt-focus]")?.addEventListener("click", () => selectWorkbenchTab("receipt"));


      initialiseHabitat({ announce, reduceMotion, selectWorkbenchTab });
}
