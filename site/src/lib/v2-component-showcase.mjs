export const componentShowcaseGroups = [
  {
    id: "identity-atmosphere",
    eyebrow: "Support layer",
    title: "Identity and atmosphere",
    description: "Brand, theme, surface, motif, and procedural visual primitives rendered together.",
    components: [
      { name: "ThemeToggle", path: "src/astro/ThemeToggle.astro" },
      { name: "HaraMark", path: "src/astro/HaraMark.astro" },
      { name: "Motif", path: "src/astro/Motif.astro" },
      { name: "Backdrop", path: "src/astro/Backdrop.astro" },
      { name: "Surface", path: "src/astro/Surface.astro" },
      { name: "FleetField", path: "src/astro/v2/FleetField.astro" },
      { name: "ShaderField", path: "src/astro/v2/ShaderField.astro" }
    ]
  },
  {
    id: "document-shell",
    eyebrow: "Document layer",
    title: "Shell and navigation",
    description: "The complete document shell with global, contextual, local, and page-level navigation.",
    components: [
      { name: "Shell", path: "src/astro/v2/Shell.astro" },
      { name: "Header", path: "src/astro/v2/Header.astro" },
      { name: "ContextNav", path: "src/astro/v2/ContextNav.astro" },
      { name: "Sidebar", path: "src/astro/v2/Sidebar.astro" },
      { name: "PageHeader", path: "src/astro/v2/PageHeader.astro" }
    ]
  },
  {
    id: "tool-controls",
    eyebrow: "Tool layer",
    title: "Controls and command surfaces",
    description: "Buttons, toggles, fields, tabs, rails, groups, toolbars, and status boundaries with real states.",
    components: [
      { name: "Toolbar", path: "src/astro/v2/tool/Toolbar.astro" },
      { name: "ToolGroup", path: "src/astro/v2/tool/ToolGroup.astro" },
      { name: "ToolButton", path: "src/astro/v2/tool/ToolButton.astro" },
      { name: "ToolToggle", path: "src/astro/v2/tool/ToolToggle.astro" },
      { name: "ToolSelect", path: "src/astro/v2/tool/ToolSelect.astro" },
      { name: "ToolNumberField", path: "src/astro/v2/tool/ToolNumberField.astro" },
      { name: "TabStrip", path: "src/astro/v2/tool/TabStrip.astro" },
      { name: "IconRail", path: "src/astro/v2/tool/IconRail.astro" },
      { name: "StatusBar", path: "src/astro/v2/tool/StatusBar.astro" }
    ]
  },
  {
    id: "workbench-shell",
    eyebrow: "Workbench layer",
    title: "Docked and floating workbench",
    description: "The bounded workbench geometry with panels, inspector disclosure, overlays, and palettes.",
    components: [
      { name: "WorkbenchShell", path: "src/astro/v2/tool/WorkbenchShell.astro" },
      { name: "DockPanel", path: "src/astro/v2/tool/DockPanel.astro" },
      { name: "PanelHeader", path: "src/astro/v2/tool/PanelHeader.astro" },
      { name: "InspectorSection", path: "src/astro/v2/tool/InspectorSection.astro" },
      { name: "FloatingPalette", path: "src/astro/v2/tool/FloatingPalette.astro" },
      { name: "ViewportOverlay", path: "src/astro/v2/tool/ViewportOverlay.astro" }
    ]
  },
  {
    id: "environment-composition",
    eyebrow: "Environment layer",
    title: "Environment primitives and composition",
    description: "Section navigation, resources, frontmatter, capabilities, and the compound environment workbench.",
    components: [
      { name: "SectionNavigator", path: "src/astro/v2/tool/SectionNavigator.astro" },
      { name: "EnvironmentSection", path: "src/astro/v2/tool/EnvironmentSection.astro" },
      { name: "FrontmatterGrid", path: "src/astro/v2/tool/FrontmatterGrid.astro" },
      { name: "ResourceList", path: "src/astro/v2/tool/ResourceList.astro" },
      { name: "CapabilityPane", path: "src/astro/v2/tool/CapabilityPane.astro" },
      { name: "EnvironmentWorkbench", path: "src/astro/v2/tool/EnvironmentWorkbench.astro" }
    ]
  },
  {
    id: "runtime-composition",
    eyebrow: "Runtime layer",
    title: "Runtime state and application shells",
    description: "Lifecycle lamps, requested connections, compact control, and full runtime application chrome.",
    components: [
      { name: "StatusLamp", path: "src/astro/v2/tool/StatusLamp.astro" },
      { name: "RuntimeSwitch", path: "src/astro/v2/tool/RuntimeSwitch.astro" },
      { name: "ConnectionRow", path: "src/astro/v2/tool/ConnectionRow.astro" },
      { name: "CompactRuntimeShell", path: "src/astro/v2/tool/CompactRuntimeShell.astro" },
      { name: "RuntimeAppShell", path: "src/astro/v2/tool/RuntimeAppShell.astro" }
    ]
  }
];

export const showcasedComponentNames = componentShowcaseGroups.flatMap((group) => (
  group.components.map((component) => component.name)
));
