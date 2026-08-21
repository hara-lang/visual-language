import {
  architectureMap,
  packageGraph,
  packageRelationsFor,
  sessionStateMachine
} from "../lib/v2-diagrams.mjs";

const byId = (items, id) => items.find((item) => item.id === id) ?? null;

function setPressed(buttons, selected) {
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button === selected)));
}

function initialiseArchitecture(root = document) {
  root.querySelectorAll("[data-architecture-figure]").forEach((figure) => {
    if (!(figure instanceof HTMLElement) || figure.dataset.ready === "true") return;
    figure.dataset.ready = "true";

    const inspector = figure.querySelector("[data-architecture-inspector]");
    const nodes = [...figure.querySelectorAll("[data-node-id]")];
    const label = inspector?.querySelector("[data-architecture-node-label]");
    const detail = inspector?.querySelector("[data-architecture-node-detail]");
    const owner = inspector?.querySelector("[data-architecture-node-owner]");
    const evidence = inspector?.querySelector("[data-architecture-node-evidence]");
    const status = inspector?.querySelector(".diagram-status-word");

    const select = (button) => {
      if (!(button instanceof HTMLButtonElement)) return;
      const node = byId(architectureMap.nodes, button.dataset.nodeId);
      if (!node) return;
      setPressed(nodes, button);
      if (label) label.textContent = node.label;
      if (detail) detail.textContent = node.detail;
      if (owner) owner.textContent = node.owner;
      if (evidence) {
        const relations = architectureMap.relations.filter(({ from, to }) => from === node.id || to === node.id);
        evidence.textContent = relations.map(({ evidence: item }) => item).filter(Boolean).join(" · ") || architectureMap.sourceRevision;
      }
      if (status instanceof HTMLElement) {
        status.dataset.status = node.status;
        status.textContent = node.status === "external" ? "External authority" : node.status === "proposed" ? "Proposed boundary" : "Current boundary";
      }
    };

    nodes.forEach((button) => button.addEventListener("click", () => select(button)));
    const initial = nodes.find((button) => button.dataset.nodeId === "catalog") ?? nodes[0];
    if (initial) select(initial);
  });

  const modeButtons = [...root.querySelectorAll("[data-architecture-mode]")];
  modeButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement) || button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => {
      setPressed(modeButtons, button);
      root.querySelectorAll("[data-architecture-figure]").forEach((figure) => {
        if (figure instanceof HTMLElement) figure.dataset.mode = button.dataset.architectureMode || "runtime";
      });
    });
  });
}

function initialiseSequence(root = document) {
  const buttons = [...root.querySelectorAll("[data-sequence-mode]")];
  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement) || button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => {
      setPressed(buttons, button);
      const mode = button.dataset.sequenceMode || "complete";
      root.querySelectorAll("[data-sequence-figure]").forEach((figure) => {
        if (!(figure instanceof HTMLElement)) return;
        figure.dataset.mode = mode;
        figure.querySelectorAll(".diagram-sequence-event").forEach((event) => {
          if (event instanceof HTMLElement) event.hidden = mode === "unavailable" && event.dataset.state !== "unavailable";
        });
      });
    });
  });
}

function initialiseStateMachine(root = document) {
  root.querySelectorAll("[data-state-machine]").forEach((machine) => {
    if (!(machine instanceof HTMLElement) || machine.dataset.ready === "true") return;
    machine.dataset.ready = "true";
    const actions = [...machine.querySelectorAll("[data-state-action]")];
    const reset = machine.querySelector("[data-state-reset]");
    const label = machine.querySelector("[data-state-current-label]");
    const id = machine.querySelector("[data-state-current-id]");
    const feedback = machine.querySelector("[data-state-feedback]");

    const render = (current, message) => {
      machine.dataset.currentState = current;
      const state = byId(sessionStateMachine.states, current);
      if (label) label.textContent = state?.label ?? current;
      if (id) id.textContent = current;
      machine.querySelectorAll("[data-state-id]").forEach((node) => {
        if (node instanceof HTMLElement) node.dataset.active = String(node.dataset.stateId === current);
      });
      actions.forEach((action) => {
        if (action instanceof HTMLButtonElement) action.disabled = action.dataset.from !== current;
      });
      if (feedback) feedback.textContent = message ?? state?.description ?? "";
    };

    actions.forEach((action) => {
      if (!(action instanceof HTMLButtonElement)) return;
      action.addEventListener("click", () => {
        const from = action.dataset.from;
        const to = action.dataset.to;
        const transition = sessionStateMachine.transitions.find((item) => item.from === from && item.to === to);
        if (!transition || machine.dataset.currentState !== from) return;
        render(to, `${transition.label}: ${transition.guard}. Evidence: ${transition.evidence}.`);
      });
    });

    reset?.addEventListener("click", () => render(sessionStateMachine.initial, "Specimen reset to Idle. Create is the only enabled transition in this path."));
    render(machine.dataset.currentState || sessionStateMachine.initial);
  });
}

function initialiseGraph(root = document) {
  root.querySelectorAll("[data-package-graph]").forEach((graph) => {
    if (!(graph instanceof HTMLElement) || graph.dataset.ready === "true") return;
    graph.dataset.ready = "true";
    const buttons = [...graph.querySelectorAll("[data-node-id]")];
    const label = graph.querySelector("[data-graph-label]");
    const kind = graph.querySelector("[data-graph-kind]");
    const status = graph.querySelector("[data-graph-status]");
    const detail = graph.querySelector("[data-graph-detail]");
    const revision = graph.querySelector("[data-graph-revision]");
    const owner = graph.querySelector("[data-graph-owner]");
    const count = graph.querySelector("[data-graph-relation-count]");
    const relations = graph.querySelector("[data-graph-relations]");
    const fence = document.querySelector("[data-graph-selected-fence]");

    const select = (button) => {
      if (!(button instanceof HTMLButtonElement)) return;
      const node = byId(packageGraph.nodes, button.dataset.nodeId);
      if (!node) return;
      setPressed(buttons, button);
      if (label) label.textContent = node.label;
      if (kind) kind.textContent = node.kind;
      if (status instanceof HTMLElement) {
        status.dataset.graphStatus = node.status;
        status.textContent = node.status;
      }
      if (detail) detail.textContent = node.detail;
      if (revision) revision.textContent = node.revision;
      if (owner) owner.textContent = node.owner;
      if (fence) fence.textContent = node.revision;
      const adjacent = packageRelationsFor(node.id);
      if (count) count.textContent = String(adjacent.length);
      if (relations instanceof HTMLElement) {
        relations.replaceChildren(...adjacent.map((edge) => {
          const article = document.createElement("article");
          article.dataset.kind = edge.kind;
          const heading = document.createElement("b");
          heading.textContent = edge.label;
          const paragraph = document.createElement("p");
          const from = byId(packageGraph.nodes, edge.from)?.label ?? edge.from;
          const to = byId(packageGraph.nodes, edge.to)?.label ?? edge.to;
          paragraph.textContent = `${from} → ${to}`;
          article.append(heading, paragraph);
          return article;
        }));
      }
    };

    buttons.forEach((button) => button.addEventListener("click", () => select(button)));
    if (buttons[0]) select(buttons[0]);
  });
}

export function initialiseDiagrams(root = document) {
  initialiseArchitecture(root);
  initialiseSequence(root);
  initialiseStateMachine(root);
  initialiseGraph(root);
}
