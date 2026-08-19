// @ts-check

/**
 * @typedef {object} ComponentRecord
 * @property {string} name
 * @property {string} exportPath
 * @property {string} sourcePath
 * @property {string} role
 * @property {string[]} states
 * @property {string[]} densities
 * @property {string} responsive
 * @property {string} accessibility
 * @property {"shared" | "tool" | "runtime" | "support"} owner
 */

/**
 * @typedef {object} ComponentGroup
 * @property {string} id
 * @property {string} label
 * @property {string} summary
 * @property {ComponentRecord[]} components
 */

const shared = (name, role, options = {}) => ({
  name,
  exportPath: `./astro/v2/${name}.astro`,
  sourcePath: `src/astro/v2/${name}.astro`,
  role,
  states: options.states ?? ["default"],
  densities: options.densities ?? ["comfortable", "compact shell"],
  responsive: options.responsive ?? "Yields with the document shell collapse order.",
  accessibility: options.accessibility ?? "Preserves semantic landmarks and source order.",
  owner: "shared"
});

const tool = (name, role, options = {}) => ({
  name,
  exportPath: `./astro/v2/tool/${name}.astro`,
  sourcePath: `src/astro/v2/tool/${name}.astro`,
  role,
  states: options.states ?? ["default", "selected", "disabled"],
  densities: options.densities ?? ["regular", "dense"],
  responsive: options.responsive ?? "Secondary tool regions yield before the viewport.",
  accessibility: options.accessibility ?? "Requires an accessible label and visible focus state.",
  owner: options.owner ?? "tool"
});

const support = (name, role, options = {}) => ({
  name,
  exportPath: `./astro/${name}.astro`,
  sourcePath: `src/astro/${name}.astro`,
  role,
  states: options.states ?? ["default"],
  densities: options.densities ?? ["contextual"],
  responsive: options.responsive ?? "Scales within the consuming composition.",
  accessibility: options.accessibility ?? "Decorative use must be hidden; functional use requires a label.",
  owner: "support"
});

/** @type {ComponentGroup[]} */
export const componentGroups = [
  {
    id: "support",
    label: "Identity and support",
    summary: "Theme, identity, motif, backdrop, and generic surface helpers used around the v2 layers.",
    components: [
      support("ThemeToggle", "Direct light/dark theme control.", {
        states: ["light", "dark"],
        accessibility: "Button label announces the destination theme and remains readable on mobile."
      }),
      support("HaraMark", "Protected block-H identity mark with one signal square.", {
        densities: ["24px minimum", "product", "hero"],
        accessibility: "Decorative by default; the containing link supplies the accessible name."
      }),
      support("Motif", "Edge, Aperture, or Rack technical atmosphere.", {
        states: ["edge", "aperture", "rack", "light", "dark"],
        accessibility: "Atmosphere is never required to understand content."
      }),
      support("Backdrop", "Full-region material background treatment."),
      support("Surface", "Generic v1-compatible material surface helper.")
    ]
  },
  {
    id: "shell",
    label: "Shell and navigation",
    summary: "The document application frame and its global, contextual, rail, page-heading, and illustration regions.",
    components: [
      shared("Shell", "Composes header, context navigation, sidebar, main content, and optional inspector.", {
        states: ["default", "with context", "with inspector", "compact"],
        responsive: "Inspector drops first, then sidebar; main source order remains intact."
      }),
      shared("Header", "Product header with identity, primary navigation, and action slots.", {
        states: ["anonymous", "signed in", "current route"],
        accessibility: "Uses the banner landmark and labelled primary navigation."
      }),
      shared("ContextNav", "Product-local route or task navigation below the global header.", {
        states: ["default", "current page", "overflow"],
        responsive: "Becomes a horizontally reachable scroll row rather than hiding destinations."
      }),
      shared("Sidebar", "Section navigation and supporting facts for reading or registry surfaces.", {
        states: ["default", "current item", "collapsed"],
        responsive: "Removed after the inspector; equivalent navigation remains reachable."
      }),
      shared("PageHeader", "Large page title, description, actions, metadata, and optional illustration.", {
        states: ["text only", "illustrated", "with actions", "with metadata"]
      }),
      shared("FleetField", "Original Hara technical illustration for dedicated art fields.", {
        states: ["light", "dark", "static"],
        densities: ["section", "hero"],
        accessibility: "Requires a concise SVG title when informative; motion is never required."
      })
    ]
  },
  {
    id: "tool-controls",
    label: "Tool controls",
    summary: "Dense but calm controls for editor transport, mode, numeric, selection, tab, rail, and status surfaces.",
    components: [
      tool("Toolbar", "Groups related commands along one horizontal or vertical edge.", {
        states: ["regular", "dense", "horizontal", "vertical", "sticky"]
      }),
      tool("ToolGroup", "Separates command families inside a toolbar."),
      tool("ToolButton", "Immediate command or transport action.", {
        states: ["default", "hover", "active", "icon only", "disabled", "loading"]
      }),
      tool("ToolToggle", "Persistent binary mode or visibility state.", {
        states: ["off", "pressed", "icon only", "disabled"]
      }),
      tool("ToolSelect", "Compact selection among known tool modes or resources."),
      tool("ToolNumberField", "Exact numeric value with unit and dense inline option."),
      tool("TabStrip", "Document, panel, or mode tabs with explicit selected state.", {
        states: ["default", "selected", "disabled", "horizontal", "vertical"]
      }),
      tool("IconRail", "Compact mode or tool navigation at a workbench edge.", {
        states: ["vertical", "horizontal", "selected", "disabled"]
      }),
      tool("StatusBar", "Low-priority runtime, selection, revision, and connection telemetry.", {
        states: ["ready", "busy", "warning", "offline"]
      })
    ]
  },
  {
    id: "tool-shell",
    label: "Workbench shell",
    summary: "Viewport-first docking, inspection, floating, overlay, and panel-heading primitives.",
    components: [
      tool("WorkbenchShell", "Coordinates toolbar, left/right/bottom docks, viewport, overlays, and status.", {
        states: ["full", "no inspector", "no rail", "viewport only"],
        densities: ["desktop", "tablet", "phone"],
        responsive: "Right dock, then left dock, then bottom dock yield in that order."
      }),
      tool("DockPanel", "Left, right, bottom, or floating secondary work region.", {
        states: ["left", "right", "bottom", "floating", "selected", "collapsed"],
        densities: ["narrow", "regular", "wide"]
      }),
      tool("FloatingPalette", "Temporary command, asset, or insertion palette over the viewport.", {
        states: ["top left", "top right", "bottom left", "bottom right", "center"]
      }),
      tool("ViewportOverlay", "Non-blocking viewport telemetry or interactive mini-control.", {
        states: ["informational", "interactive", "five placements"]
      }),
      tool("InspectorSection", "Expandable property family inside an inspector.", {
        states: ["closed", "open", "with summary metadata"]
      }),
      tool("PanelHeader", "Panel identity, eyebrow, metadata, and action row.", {
        states: ["regular", "compact", "with actions"]
      })
    ]
  },
  {
    id: "environment",
    label: "Environment",
    summary: "Reusable live-environment sections for navigation, front matter, resources, capabilities, and composed editor sessions.",
    components: [
      tool("SectionNavigator", "Moves among stable environment sections such as Code, Files, Canvas, and Runtime."),
      tool("EnvironmentSection", "Section container with identity, state, and content slots."),
      tool("FrontmatterGrid", "Displays editable, derived, and controlled environment metadata.", {
        states: ["editable", "derived", "controlled", "invalid"]
      }),
      tool("ResourceList", "Files, sessions, assets, and runtime resources with current-state semantics.", {
        states: ["default", "selected", "modified", "missing", "disabled"]
      }),
      tool("CapabilityPane", "Shows only available Sessions, Files, Canvas, 3D, Runtime, and Observation capabilities.", {
        states: ["partial capabilities", "all capabilities", "unavailable"]
      }),
      tool("EnvironmentWorkbench", "Composes navigation, editor/viewport, optional capability pane, and observations.", {
        states: ["code", "front matter", "graphics", "console", "embedded"],
        responsive: "Capability pane dismisses before the editor or viewport is compromised."
      })
    ]
  },
  {
    id: "runtime",
    label: "Runtime",
    summary: "Compact and application-sized runtime state, connection, backend, and lifecycle components.",
    components: [
      tool("StatusLamp", "Text-supported runtime or connection state marker.", {
        owner: "runtime",
        states: ["ready", "busy", "warning", "error", "offline"]
      }),
      tool("RuntimeSwitch", "Capability-aware interpreter or HBC backend selection.", {
        owner: "runtime",
        states: ["selected", "unsupported", "disabled"]
      }),
      tool("ConnectionRow", "Named provider or runtime connection with state and action.", {
        owner: "runtime",
        states: ["connected", "connecting", "error", "disconnected"]
      }),
      tool("CompactRuntimeShell", "Documentation-sized runtime identity, transport, output, and detail surface.", {
        owner: "runtime",
        states: ["idle", "running", "cancelled", "failed", "complete"]
      }),
      tool("RuntimeAppShell", "Application-sized runtime lifecycle and capability envelope.", {
        owner: "runtime",
        states: ["idle", "running", "restarting", "replacing", "cancelled", "disposed"]
      })
    ]
  }
];

export const publicComponentInventory = componentGroups.flatMap((group) =>
  group.components.map((component) => ({ ...component, groupId: group.id, groupLabel: group.label }))
);

export const v2ComponentInventory = publicComponentInventory.filter((component) =>
  component.exportPath.startsWith("./astro/v2/")
);

export const toolComponentInventory = publicComponentInventory.filter((component) =>
  component.exportPath.startsWith("./astro/v2/tool/")
);

export const supportComponentInventory = publicComponentInventory.filter((component) =>
  component.exportPath.startsWith("./astro/") && !component.exportPath.startsWith("./astro/v2/")
);

export const componentInventoryByName = (name) =>
  publicComponentInventory.find((component) => component.name === name);
