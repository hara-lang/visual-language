import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  ToggleButton
} from "react-aria-components";

type ViewId = "canvas" | "scene" | "code" | "diagnostics";

type WorkspacePreferences = {
  view: ViewId;
  grid: boolean;
  guides: boolean;
  inspector: boolean;
  timeline: boolean;
  backend: "whole-wasm" | "interpreter";
};

const STORAGE_KEY = "hara.liveview.workspace.v1";
const DEFAULT_PREFERENCES: WorkspacePreferences = {
  view: "canvas",
  grid: true,
  guides: true,
  inspector: true,
  timeline: false,
  backend: "whole-wasm"
};

const views: Array<{ id: ViewId; label: string; badge: string; detail: string }> = [
  { id: "canvas", label: "Canvas", badge: "2D", detail: "draw / focus" },
  { id: "scene", label: "Scene", badge: "3D", detail: "scene / orbit" },
  { id: "code", label: "Code", badge: "HAL", detail: "src/main.hal" },
  { id: "diagnostics", label: "Diagnostics", badge: "SYS", detail: "kernel / events" }
];

const viewIds = new Set<ViewId>(views.map((view) => view.id));

function isPreferences(value: unknown): value is WorkspacePreferences {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WorkspacePreferences>;
  return (
    typeof candidate.view === "string" &&
    viewIds.has(candidate.view as ViewId) &&
    typeof candidate.grid === "boolean" &&
    typeof candidate.guides === "boolean" &&
    typeof candidate.inspector === "boolean" &&
    typeof candidate.timeline === "boolean" &&
    (candidate.backend === "whole-wasm" || candidate.backend === "interpreter")
  );
}

function CanvasView({ preferences }: { preferences: WorkspacePreferences }) {
  return (
    <div className="tool-lab-liveview-canvas" data-grid={preferences.grid} data-guides={preferences.guides}>
      {preferences.grid && <div className="tool-lab-liveview-canvas-grid" aria-hidden="true" />}
      {preferences.guides && <div className="tool-lab-liveview-canvas-guides" aria-hidden="true" />}
      <div className="tool-lab-liveview-canvas-orbit tool-lab-liveview-canvas-orbit--outer" aria-hidden="true" />
      <div className="tool-lab-liveview-canvas-orbit tool-lab-liveview-canvas-orbit--inner" aria-hidden="true" />
      <div className="tool-lab-liveview-focus">
        <span className="tool-lab-liveview-focus-dot" aria-hidden="true" />
        <strong>draw / focus</strong>
        <small>frame 284</small>
      </div>
      <div className="tool-lab-liveview-axis" aria-hidden="true"><i>x</i><i>y</i><i>z</i></div>
      {preferences.timeline && (
        <div className="tool-lab-liveview-mini-timeline" aria-label="Canvas timeline">
          <span>frame 284</span><i /><i /><i /><b>60 fps</b>
        </div>
      )}
    </div>
  );
}

function SceneView({ preferences }: { preferences: WorkspacePreferences }) {
  return (
    <div className="tool-lab-liveview-scene" data-grid={preferences.grid} data-guides={preferences.guides}>
      {preferences.grid && <div className="tool-lab-liveview-scene-grid" aria-hidden="true" />}
      {preferences.guides && <div className="tool-lab-liveview-scene-guides" aria-hidden="true" />}
      <div className="tool-lab-liveview-scene-object" aria-label="Selected scene object">
        <span className="tool-lab-liveview-scene-face tool-lab-liveview-scene-face--front" />
        <span className="tool-lab-liveview-scene-face tool-lab-liveview-scene-face--side" />
        <span className="tool-lab-liveview-scene-face tool-lab-liveview-scene-face--top" />
      </div>
      <div className="tool-lab-liveview-scene-tag"><b>Scene / 01</b><small>selected · signal glass</small></div>
      {preferences.timeline && <div className="tool-lab-liveview-scene-readout">orbit 24° · elevation 18°</div>}
    </div>
  );
}

function CodeView() {
  const code = "(defn draw-frame [ctx state)\n" +
    "  (draw/clear ctx :graphite)\n" +
    "  (draw/grid ctx {:spacing 32 :alpha 0.12})\n" +
    "  (draw/node ctx (:focus state))\n" +
    "  (draw/receipt ctx {:generation 7\n" +
    "                     :revision 18}))";

  return (
    <div className="tool-lab-liveview-code">
      <header><span>src/main.hal</span><span>live · revision 18</span></header>
      <pre><code>{code}</code></pre>
      <footer><span>Ctrl+Enter run</span><span>Whole-Wasm</span></footer>
    </div>
  );
}

function DiagnosticsView() {
  const events = [
    ["18:42:06", "draw / focus", "frame 284", "ready"],
    ["18:42:05", "scene sync", "4 nodes", "ready"],
    ["18:42:04", "runtime", "Whole-Wasm", "connected"],
    ["18:41:58", "source revision", "18", "current"]
  ];

  return (
    <div className="tool-lab-liveview-diagnostics">
      <div className="tool-lab-liveview-diagnostics-summary"><strong>Kernel connected</strong><span>0 warnings</span><span>6.8 ms</span></div>
      <div className="tool-lab-liveview-diagnostics-list">
        {events.map(([time, event, detail, status]) => (
          <div className="tool-lab-liveview-diagnostics-row" key={time + "-" + event}>
            <time>{time}</time><strong>{event}</strong><span>{detail}</span><b>{status}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewSurface({ view, preferences }: { view: ViewId; preferences: WorkspacePreferences }) {
  if (view === "scene") return <SceneView preferences={preferences} />;
  if (view === "code") return <CodeView />;
  if (view === "diagnostics") return <DiagnosticsView />;
  return <CanvasView preferences={preferences} />;
}

export default function LiveviewWorkspaceIsland() {
  const [preferences, setPreferences] = useState<WorkspacePreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);
  const [inspectorTab, setInspectorTab] = useState("view");
  const selectedView = useMemo(
    () => views.find((view) => view.id === preferences.view) ?? views[0],
    [preferences.view]
  );

  useEffect(() => {
    try {
      const stored = window.localStorage?.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isPreferences(parsed)) setPreferences(parsed);
      }
    } catch {
      // A blocked or malformed local preference should not prevent the workspace from loading.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Persistence is an enhancement; private or embedded contexts may deny storage.
    }
  }, [hydrated, preferences]);

  function update<K extends keyof WorkspacePreferences>(key: K, value: WorkspacePreferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    try {
      window.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      // Continue with the in-memory reset when storage is unavailable.
    }
    setPreferences(DEFAULT_PREFERENCES);
  }

  return (
    <div className="tool-lab-liveview-workspace" data-liveview-project="live-environment-01">
      <Tabs
        className="tool-lab-liveview-tabs-root"
        selectedKey={preferences.view}
        onSelectionChange={(key) => update("view", String(key) as ViewId)}
        aria-label="Liveview project views"
      >
        <div className="tool-lab-liveview-bar">
          <div className="tool-lab-liveview-project">
            <span className="tool-lab-liveview-project-mark" aria-hidden="true">H</span>
            <div><strong>live-environment-01</strong><small>memory · revision 18</small></div>
          </div>
          <TabList className="tool-lab-liveview-tabs" aria-label="Views for this project">
            {views.map((view) => (
              <Tab id={view.id} key={view.id} className="tool-lab-liveview-tab">
                <span>{view.label}</span><b>{view.badge}</b>
              </Tab>
            ))}
          </TabList>
          <div className="tool-lab-liveview-actions">
            <span className="tool-lab-liveview-eval-label">Eval</span>
            <Button className="tool-lab-liveview-run" onPress={() => undefined}>Run</Button>
          </div>
        </div>

        <div className="tool-lab-liveview-body">
          <div className="tool-lab-liveview-main">
            <div className="tool-lab-liveview-surface-meta">
              <span>{selectedView.detail}</span><span>{selectedView.badge === "3D" ? "30 fps · 1.0×" : "60 fps · 1.0×"}</span>
            </div>
            {views.map((view) => (
              <TabPanel id={view.id} key={view.id} className="tool-lab-liveview-panel">
                <ViewSurface view={view.id} preferences={preferences} />
              </TabPanel>
            ))}
          </div>

          {preferences.inspector && (
            <aside className="tool-lab-liveview-inspector" aria-label="Workspace inspector">
              <header><div><span>WORKSPACE</span><strong>{selectedView.label}</strong></div><b>4 groups</b></header>
              <div className="tool-lab-liveview-inspector-tabs" role="group" aria-label="Workspace inspector sections">
                <ToggleButton
                  className="tool-lab-liveview-inspector-tab"
                  isSelected={inspectorTab === "view"}
                  onChange={(selected) => selected && setInspectorTab("view")}
                >View</ToggleButton>
                <ToggleButton
                  className="tool-lab-liveview-inspector-tab"
                  isSelected={inspectorTab === "project"}
                  onChange={(selected) => selected && setInspectorTab("project")}
                >Project</ToggleButton>
                <ToggleButton
                  className="tool-lab-liveview-inspector-tab"
                  isSelected={inspectorTab === "runtime"}
                  onChange={(selected) => selected && setInspectorTab("runtime")}
                >Runtime</ToggleButton>
              </div>
              {inspectorTab === "view" && (
                <div className="tool-lab-liveview-inspector-panel" role="tabpanel" aria-label="View">
                  <Disclosure className="tool-lab-liveview-disclosure" defaultExpanded>
                    <Heading level={3}><Button slot="trigger">Viewport</Button></Heading>
                    <DisclosurePanel className="tool-lab-liveview-disclosure-panel">
                      <Switch isSelected={preferences.grid} onChange={(value) => update("grid", value)}><span>Grid</span><b>{preferences.grid ? "on" : "off"}</b></Switch>
                      <Switch isSelected={preferences.guides} onChange={(value) => update("guides", value)}><span>Guides</span><b>{preferences.guides ? "on" : "off"}</b></Switch>
                      <Switch isSelected={preferences.timeline} onChange={(value) => update("timeline", value)}><span>Timeline</span><b>{preferences.timeline ? "on" : "off"}</b></Switch>
                    </DisclosurePanel>
                  </Disclosure>
                  <Disclosure className="tool-lab-liveview-disclosure" defaultExpanded>
                    <Heading level={3}><Button slot="trigger">Quality</Button></Heading>
                    <DisclosurePanel className="tool-lab-liveview-disclosure-panel">
                      <Select className="tool-lab-liveview-select" selectedKey={preferences.backend} onSelectionChange={(key) => update("backend", String(key) as WorkspacePreferences["backend"])} aria-label="Runtime backend">
                        <Label>Backend</Label>
                        <Button className="tool-lab-liveview-select-button"><SelectValue /></Button>
                        <Popover className="tool-lab-liveview-select-popover">
                          <ListBox className="tool-lab-liveview-select-list">
                            <ListBoxItem id="whole-wasm">Whole-Wasm</ListBoxItem>
                            <ListBoxItem id="interpreter">Interpreter</ListBoxItem>
                          </ListBox>
                        </Popover>
                      </Select>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}
              {inspectorTab === "project" && (
                <div className="tool-lab-liveview-inspector-panel" role="tabpanel" aria-label="Project">
                  <Disclosure className="tool-lab-liveview-disclosure" defaultExpanded>
                    <Heading level={3}><Button slot="trigger">Project</Button></Heading>
                    <DisclosurePanel className="tool-lab-liveview-disclosure-panel">
                      <div className="tool-lab-liveview-inspector-value"><span>Session</span><strong>isolated</strong></div>
                      <div className="tool-lab-liveview-inspector-value"><span>Revision</span><strong>18</strong></div>
                      <div className="tool-lab-liveview-inspector-value"><span>Memory</span><strong>live-environment-01</strong></div>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}
              {inspectorTab === "runtime" && (
                <div className="tool-lab-liveview-inspector-panel" role="tabpanel" aria-label="Runtime">
                  <Disclosure className="tool-lab-liveview-disclosure" defaultExpanded>
                    <Heading level={3}><Button slot="trigger">Runtime</Button></Heading>
                    <DisclosurePanel className="tool-lab-liveview-disclosure-panel">
                      <div className="tool-lab-liveview-inspector-value"><span>State</span><strong>connected</strong></div>
                      <div className="tool-lab-liveview-inspector-value"><span>Frame</span><strong>284</strong></div>
                      <div className="tool-lab-liveview-inspector-value"><span>Latency</span><strong>6.8 ms</strong></div>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              )}
              <Button className="tool-lab-liveview-reset" onPress={reset}>Reset workspace</Button>
            </aside>
          )}
        </div>
      </Tabs>

      {!preferences.inspector && (
        <Button className="tool-lab-liveview-show-inspector" onPress={() => update("inspector", true)}>Show inspector</Button>
      )}
    </div>
  );
}
