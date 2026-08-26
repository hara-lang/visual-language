import { entranceById, practiceScenario } from "../lib/v2-learn.mjs";

const setText = (root, selector, value) => { const node = root?.querySelector(selector); if (node) node.textContent = String(value ?? ""); };
const setPressed = (nodes, selected) => { for (const node of nodes) node.setAttribute("aria-pressed", node === selected ? "true" : "false"); };

async function copyValue(button) {
  const original = button.textContent;
  try { if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable"); await navigator.clipboard.writeText(button.dataset.copyValue ?? ""); button.textContent = "Copied"; button.dataset.copyState = "copied"; }
  catch { button.textContent = "Copy unavailable"; button.dataset.copyState = "unavailable"; }
  window.setTimeout(() => { button.textContent = original; delete button.dataset.copyState; }, 1600);
}

function initialiseCopyButtons(root) { for (const button of root.querySelectorAll("[data-copy-value]")) button.addEventListener("click", () => copyValue(button)); }

function initialiseFirstRun(root) {
  const run = root.querySelector("[data-first-run]"); const edit = root.querySelector("[data-first-edit]"); const output = root.querySelector("[data-first-run-output]"); const lesson = root.querySelector("#lesson"); const lessonEdit = root.querySelector("[data-lesson-edit]");
  run?.addEventListener("click", () => { if (!output) return; output.querySelector("strong").textContent = "Evaluation complete"; output.querySelector("span").textContent = "one value · no setup required"; output.dataset.state = "complete"; /* Run deliberately does not call focus(). */ });
  edit?.addEventListener("click", () => { lesson?.scrollIntoView({ behavior: "smooth", block: "start" }); window.setTimeout(() => lessonEdit?.click(), 180); });
}

function initialiseEntrances(root) {
  const buttons = [...root.querySelectorAll("[data-learn-entrance]")]; const preview = root.querySelector("[data-learn-entrance-preview]"); if (!buttons.length || !preview) return;
  const render = (button) => { const entrance = entranceById(button.dataset.learnEntrance ?? "new-programmer"); setPressed(buttons, button); setText(preview, "[data-entrance-label]", entrance.label); setText(preview, "[data-entrance-title]", entrance.title); setText(preview, "[data-entrance-summary]", entrance.summary); setText(preview, "[data-entrance-lesson]", entrance.firstLesson); setText(preview, "[data-entrance-minutes]", `${entrance.estimatedMinutes} minutes`); setText(preview, "[data-entrance-evidence]", entrance.evidence); };
  for (const button of buttons) button.addEventListener("click", () => render(button));
}

function initialiseTrackFilter(root) {
  const query = root.querySelector("[data-track-query]"); const cards = [...root.querySelectorAll("[data-track-card]")]; const count = root.querySelector("[data-track-count]"); const empty = root.querySelector("[data-track-empty]"); const reset = root.querySelector("[data-track-reset]"); if (!query || !cards.length) return;
  const apply = () => { const needle = query.value.trim().toLowerCase(); let visible = 0; for (const card of cards) { const matches = !needle || (card.dataset.search ?? "").includes(needle); card.hidden = !matches; if (matches) visible += 1; } if (count) count.textContent = `${visible} track${visible === 1 ? "" : "s"}`; if (empty) empty.hidden = visible !== 0; };
  query.addEventListener("input", apply); reset?.addEventListener("click", () => { query.value = ""; apply(); query.focus(); });
}

function initialiseCourse(root) { const buttons = [...root.querySelectorAll("[data-course-unit]")]; for (const button of buttons) button.addEventListener("click", () => { if (!button.disabled) setPressed(buttons, button); }); }

function initialiseLesson(root) {
  const run = root.querySelector("[data-lesson-run]"); const edit = root.querySelector("[data-lesson-edit]"); const reset = root.querySelector("[data-lesson-reset]"); const editor = root.querySelector("[data-lesson-editor]"); const result = root.querySelector("[data-lesson-result]"); const observation = root.querySelector("[data-lesson-observation]"); const sequence = root.querySelector("[data-lesson-sequence]"); const status = root.querySelector("[data-lesson-status]"); if (!editor) return;
  const original = editor.value; let eventSequence = 41;
  run?.addEventListener("click", () => { eventSequence += 1; if (status) { status.textContent = "Evaluation complete"; status.dataset.tone = "success"; } if (sequence) sequence.textContent = `event ${eventSequence}`; if (result) result.textContent = `{:message "Hello from a namespace"\n :next :inspect-qualified-symbol}`; if (observation) observation.textContent = `Namespace tutorial.profile evaluated without moving editor focus · event ${eventSequence}.`; /* Run never focuses editor. */ });
  edit?.addEventListener("click", () => { editor.readOnly = false; editor.dataset.editable = "true"; editor.focus(); editor.setSelectionRange(editor.value.length, editor.value.length); if (status) { status.textContent = "Editing local source"; status.dataset.tone = "signal"; } });
  reset?.addEventListener("click", () => { editor.value = original; editor.readOnly = true; delete editor.dataset.editable; if (status) { status.textContent = "Ready"; status.dataset.tone = "success"; } });
  const choices = [...root.querySelectorAll("[data-understanding-choice]")]; const output = root.querySelector("[data-understanding-result]"); for (const choice of choices) choice.addEventListener("click", () => { setPressed(choices, choice); const correct = choice.dataset.understandingChoice === "scope"; if (output) output.textContent = correct ? "Correct. The qualified name preserves ownership and disambiguation across packages and runtimes." : "Try again. This is about durable identity, not speed or syntax validity."; choice.dataset.result = correct ? "correct" : "incorrect"; });
}

function initialisePractice(root) {
  const buttons = [...root.querySelectorAll("[data-practice-scenario]")]; const panels = [...root.querySelectorAll("[data-practice-panel]")]; const state = root.querySelector("[data-practice-state]"); const save = root.querySelector("[data-practice-save]"); const reveal = root.querySelector("[data-reveal-solution]"); const check = root.querySelector("[data-practice-check]"); const reset = root.querySelector("[data-practice-reset]"); const editor = root.querySelector("[data-practice-editor]"); if (!buttons.length || !panels.length) return; const original = editor?.value ?? "";
  const render = (id, selectedButton = buttons.find((button) => button.dataset.practiceScenario === id)) => { const scenario = practiceScenario(id); if (selectedButton) setPressed(buttons, selectedButton); for (const panel of panels) panel.hidden = panel.dataset.practicePanel !== scenario.id; if (state) { state.textContent = scenario.label; state.dataset.tone = scenario.state; } if (save) save.disabled = !scenario.saveAllowed; if (reveal) reveal.disabled = !["local-pass", "server-verified"].includes(scenario.state); };
  for (const button of buttons) button.addEventListener("click", () => render(button.dataset.practiceScenario ?? "initial", button)); check?.addEventListener("click", () => { render("checking"); window.setTimeout(() => render("local-pass"), 450); }); reset?.addEventListener("click", () => { if (editor) editor.value = original; render("initial"); }); reveal?.addEventListener("click", () => { reveal.textContent = "Peer approaches available below the exact solved attempt"; reveal.dataset.revealed = "true"; });
}

function initialiseProjects(root) { const buttons = [...root.querySelectorAll("[data-project-choice]")]; for (const button of buttons) button.addEventListener("click", () => setPressed(buttons, button)); }

function initialiseEnvironmentDropdowns(root) {
  for (const select of root.querySelectorAll("[data-environment-section-select]")) {
    const environment = select.closest(".hara-tool-environment"); const stage = environment?.querySelector(".hara-tool-environment-stage"); if (!environment || !stage) continue;
    const render = (value) => {
      environment.dataset.activeSection = value;
      stage.dataset.activeSection = value;
      for (const panel of stage.querySelectorAll('[role="tabpanel"]')) {
        const active = panel.dataset.section === value;
        panel.hidden = !active;
        panel.dataset.active = active ? "true" : "false";
        panel.tabIndex = active ? 0 : -1;
      }
    };
    select.addEventListener("change", () => render(select.value));
    render(select.value);
  }
}

export function initialiseLearn(root = document) { if (!root?.querySelector) return; initialiseCopyButtons(root); initialiseFirstRun(root); initialiseEntrances(root); initialiseTrackFilter(root); initialiseCourse(root); initialiseLesson(root); initialisePractice(root); initialiseProjects(root); initialiseEnvironmentDropdowns(root); }
