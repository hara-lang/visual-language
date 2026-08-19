import { initialiseHabitatCanvas } from "./v2-start-canvas.js";

export function initialiseHabitat({ announce, reduceMotion, selectWorkbenchTab }) {
      const world = {
        fear: 42,
        separation: 18,
        light: 0.84,
        speed: 1.2,
        generation: 1,
        revision: 1,
        receiptCount: 0,
        paused: reduceMotion
      };

      controls = {
        fear: document.querySelector('[data-world-control="fear"]'),
        separation: document.querySelector('[data-world-control="separation"]'),
        light: document.querySelector('[data-world-control="light"]'),
        speed: document.querySelector('[data-world-control="speed"]')
      };
      const outputs = {
        fear: document.querySelector("[data-fear-output]"),
        separation: document.querySelector("[data-separation-output]"),
        light: document.querySelector("[data-light-output]"),
        speed: document.querySelector("[data-speed-output]")
      };
      const sourceOutput = document.querySelector("[data-habitat-source]");
      const stateOutput = document.querySelector("[data-habitat-state]");
      const generationOutputs = document.querySelectorAll("[data-generation], [data-receipt-generation]");
      const revisionOutputs = document.querySelectorAll("[data-revision], [data-receipt-revision]");
      const pauseButton = document.querySelector("[data-toggle-pause]");
      const runtimeStatus = document.querySelector("[data-runtime-status]");
      const clockRate = document.querySelector("[data-clock-rate]");

      const reasons = {
        fear: (before, after) => after > before
          ? "Moths begin evasive movement farther from the bat."
          : "Moths tolerate a closer bat before turning away.",
        separation: (before, after) => after > before
          ? "The swarm preserves more personal space."
          : "The swarm can gather more tightly around the light.",
        light: (before, after) => after > before
          ? "The light exerts a stronger attraction on nearby moths."
          : "The light becomes a weaker influence on the swarm.",
        speed: (before, after) => after > before
          ? "The habitat clock advances more quickly."
          : "The habitat clock advances more slowly."
      };

      const paths = {
        fear: "[:rules :fear-radius]",
        separation: "[:rules :separation]",
        light: "[:light :strength]",
        speed: "[:rules :night-speed]",
        world: "[:world]"
      };

      const syncFearPreset = (value) => {
        const presetValues = { brave: 28, default: 42, cautious: 70 };
        document.querySelectorAll(".start-preset-row button").forEach((button) => {
          button.classList.toggle("is-active", presetValues[button.dataset.mutation] === Number(value));
        });
      };

      const formatValue = (key, value) => {
        if (key === "world") return String(value);
        if (key === "light") return Number(value).toFixed(2);
        if (key === "speed") return Number(value).toFixed(2);
        return String(Math.round(Number(value)));
      };

      const receiptLiteral = (key, value) => key === "world"
        ? JSON.stringify(String(value))
        : formatValue(key, value);

      const renderWorldSource = () => {
        if (sourceOutput) sourceOutput.textContent = `(def world\n  {:light     {:position [0.72 0.28]\n               :strength ${world.light.toFixed(2)}}\n\n   :rules     {:attraction   0.16\n               :separation   ${Math.round(world.separation)}\n               :fear-radius  ${Math.round(world.fear)}\n               :night-speed  ${world.speed.toFixed(2)}}\n\n   :creatures [{:id :moth-1 :kind :moth}\n               {:id :moth-2 :kind :moth}\n               {:id :bat-1  :kind :bat}]})`;
        if (stateOutput) stateOutput.textContent = `{:status :${world.paused ? "paused" : "running"}\n :generation ${world.generation}\n :source-revision ${world.revision}\n :entities {:moths 12 :bats 1 :lights 1}\n :rules {:fear-radius ${Math.round(world.fear)}\n         :separation ${Math.round(world.separation)}\n         :night-speed ${world.speed.toFixed(2)}}\n :capabilities #{:canvas :clock}\n :host :visual-simulation}`;
        if (outputs.fear) outputs.fear.textContent = String(Math.round(world.fear));
        if (outputs.separation) outputs.separation.textContent = String(Math.round(world.separation));
        if (outputs.light) outputs.light.textContent = world.light.toFixed(2);
        if (outputs.speed) outputs.speed.textContent = `${world.speed.toFixed(2)}×`;
        if (clockRate) clockRate.textContent = `${world.speed.toFixed(2)}×`;
        generationOutputs.forEach((output) => { output.textContent = String(world.generation); });
        revisionOutputs.forEach((output) => { output.textContent = String(world.revision); });
      };

      const renderReceipt = (key, before, after, reason) => {
        world.receiptCount += 1;
        const receiptId = `mutation/${String(world.receiptCount).padStart(3, "0")}`;
        document.querySelector("[data-receipt-id]").textContent = receiptId;
        document.querySelector("[data-receipt-path]").textContent = paths[key];
        document.querySelector("[data-receipt-before]").textContent = formatValue(key, before);
        document.querySelector("[data-receipt-after]").textContent = formatValue(key, after);
        document.querySelector("[data-receipt-reason]").textContent = reason;
        document.querySelector("[data-receipt-count]").textContent = String(world.receiptCount);
        const receiptOutput = document.querySelector("[data-receipt-output]");
        const receiptEmpty = document.querySelector("[data-receipt-empty]");
        if (receiptEmpty) receiptEmpty.hidden = true;
        if (receiptOutput) {
          receiptOutput.hidden = false;
          receiptOutput.textContent = `{:receipt/id :${receiptId}\n :session :habitat/01\n :generation ${world.generation}\n :source-revision ${world.revision}\n :patch {:path ${paths[key]}\n         :before ${receiptLiteral(key, before)}\n         :after ${receiptLiteral(key, after)}}\n :reason "${reason}"\n :status :applied}`;
        }
      };

      const applyMutation = (key, rawValue, reason) => {
        const value = Number(rawValue);
        const before = world[key];
        if (!Number.isFinite(value) || before === value) return;
        world[key] = value;
        world.revision += 1;
        if (controls[key]) {
          controls[key].value = String(value);
          controls[key].dataset.committed = String(value);
        }
        if (key === "fear") syncFearPreset(value);
        const resolvedReason = reason ?? reasons[key](before, value);
        renderWorldSource();
        renderReceipt(key, before, value, resolvedReason);
        document.querySelector("[data-canvas-instruction]")?.classList.add("is-complete");
        announce(`${paths[key]} changed from ${formatValue(key, before)} to ${formatValue(key, value)}. ${resolvedReason}`);
        selectWorkbenchTab("receipt");
      };

      Object.entries(controls).forEach(([key, control]) => {
        control?.addEventListener("input", () => {
          world[key] = Number(control.value);
          if (key === "fear") syncFearPreset(world[key]);
          renderWorldSource();
        });
        control?.addEventListener("change", () => {
          const current = world[key];
          const previous = Number(control.dataset.committed ?? control.defaultValue);
          control.dataset.committed = String(current);
          if (previous !== current) {
            world.revision += 1;
            const reason = reasons[key](previous, current);
            renderWorldSource();
            renderReceipt(key, previous, current, reason);
            announce(`${paths[key]} changed from ${formatValue(key, previous)} to ${formatValue(key, current)}. ${reason}`);
          }
        });
        if (control) control.dataset.committed = control.value;
      });

      const mutationPresets = {
        brave: ["fear", 28, "Moths tolerate a closer bat before turning away."],
        default: ["fear", 42, "The original balanced avoidance radius is restored."],
        cautious: ["fear", 70, "Moths begin evasive movement farther from the bat."],
        space: ["separation", 28, "The swarm preserves more personal space."],
        bright: ["light", 1, "The light exerts its maximum attraction on the swarm."],
        slow: ["speed", 0.7, "The habitat clock advances more slowly."]
      };

      document.querySelectorAll("[data-mutation]").forEach((button) => {
        button.addEventListener("click", () => {
          const preset = mutationPresets[button.dataset.mutation];
          if (!preset) return;
          applyMutation(...preset);
        });
      });

      const initialWorld = { fear: 42, separation: 18, light: 0.84, speed: 1.2 };
      document.querySelector("[data-reset-world]")?.addEventListener("click", () => {
        const before = `fear ${Math.round(world.fear)} · separation ${Math.round(world.separation)} · light ${world.light.toFixed(2)} · speed ${world.speed.toFixed(2)}`;
        Object.assign(world, initialWorld);
        world.generation += 1;
        world.revision += 1;
        Object.entries(controls).forEach(([key, control]) => {
          if (control) {
            control.value = String(world[key]);
            control.dataset.committed = control.value;
          }
        });
        resetMoths();
        syncFearPreset(world.fear);
        renderWorldSource();
        renderReceipt("world", before, "starter recipe", "The Habitat world and all editable rules were restored together.");
        announce("Habitat reset to the starting recipe");
      });

      const setPaused = (paused) => {
        world.paused = paused;
        if (pauseButton) {
          pauseButton.setAttribute("aria-pressed", String(paused));
          pauseButton.textContent = paused ? "Resume" : "Pause";
        }
        if (runtimeStatus) runtimeStatus.textContent = paused ? "paused" : "running";
        renderWorldSource();
        announce(paused ? "Habitat paused" : "Habitat resumed");
      };

      pauseButton?.addEventListener("click", () => setPaused(!world.paused));
      if (reduceMotion) setPaused(true);

      initialiseHabitatCanvas({ world, setPaused, renderWorldSource });
      renderWorldSource();
}
