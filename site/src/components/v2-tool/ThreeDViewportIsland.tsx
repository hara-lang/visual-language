import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, KeyboardControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Ecctrl } from "ecctrl";
import { Leva, useControls, useCreateStore } from "leva";
import { action, runTimeline, timePassed } from "@pmndrs/timeline";
import * as THREE from "three";

type ViewportVariant = "3d" | "node" | "animation";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] }
];

const levaTheme = {
  colors: {
    accent1: "#4d9bff",
    accent2: "#152235",
    accent3: "#1d2d42",
    highlight1: "#f1f5fb",
    highlight2: "#aab7c7",
    highlight3: "#718198",
    folderWidgetColor: "#192536",
    folderTextColor: "#f1f5fb",
    toolTipBackground: "#0d131c",
    toolTipText: "#f1f5fb"
  },
  radii: { xs: "3px", sm: "4px", lg: "6px" },
  sizes: { rootWidth: "220px", controlWidth: "86px", rowHeight: "26px" },
  fontSizes: { root: "10px", toolTip: "10px" },
  fonts: { mono: "Geist, Helvetica Neue, Arial, sans-serif" }
};

function TimelineDriver({ playing, resetToken, onProgress, store }) {
  const { duration } = useControls("Timeline", {
    duration: { value: 8, min: 2, max: 20, step: 1, label: "Loop" }
  }, { store });
  const timelineState = useRef({ progress: 0 });
  const updateTimeline = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const abortController = new AbortController();
    const timeline = async function* () {
      while (!abortController.signal.aborted) {
        yield* action({
          update: (_state, _clock, actionTime) => {
            progressRef.current = Math.min(actionTime / duration, 1);
          },
          until: timePassed(duration, "seconds")
        });
        yield* action({
          update: (_state, _clock, actionTime) => {
            progressRef.current = 1 - Math.min(actionTime / duration, 1);
          },
          until: timePassed(duration, "seconds")
        });
      }
    };

    progressRef.current = 0;
    timelineState.current.progress = 0;
    updateTimeline.current = runTimeline(timeline, abortController.signal);
    return () => abortController.abort();
  }, [duration]);

  useEffect(() => {
    progressRef.current = 0;
    timelineState.current.progress = 0;
    onProgress(0);
  }, [resetToken, onProgress]);

  useFrame((_, delta) => {
    if (playing) updateTimeline.current?.(timelineState.current, delta);
    timelineState.current.progress = progressRef.current;
    onProgress(progressRef.current);
  });

  return null;
}

function SceneObject({ accent, progress }) {
  const beacon = useRef(null);
  useFrame((state) => {
    if (!beacon.current) return;
    beacon.current.rotation.y += 0.004;
    beacon.current.position.y = 0.7 + Math.sin(progress * Math.PI * 2) * 0.18;
    beacon.current.position.x = Math.cos(progress * Math.PI * 2) * 0.8;
    beacon.current.position.z = Math.sin(progress * Math.PI * 2) * 0.8;
    beacon.current.rotation.x = state.clock.elapsedTime * 0.16;
  });

  return (
    <group ref={beacon}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color={accent} metalness={0.78} roughness={0.2} emissive={accent} emissiveIntensity={0.18} />
      </mesh>
      <mesh scale={1.35}>
        <torusGeometry args={[0.48, 0.012, 8, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

function MaterialSurface({ accent, progress, roughness, metalness, emission }) {
  const subject = useRef(null);
  const ring = useRef(null);

  useFrame((state) => {
    const orbit = progress * Math.PI * 2;
    if (subject.current) {
      subject.current.rotation.y = state.clock.elapsedTime * 0.16 + orbit * 0.18;
      subject.current.rotation.x = Math.sin(orbit) * 0.12;
      subject.current.position.y = Math.sin(orbit) * 0.12;
    }
    if (ring.current) {
      ring.current.rotation.z = state.clock.elapsedTime * -0.08;
      ring.current.scale.setScalar(1 + Math.sin(orbit) * 0.025);
    }
  });

  return (
    <group>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.018, 10, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.7} />
      </mesh>
      <group ref={subject}>
        <mesh castShadow>
          <sphereGeometry args={[0.82, 48, 32]} />
          <meshStandardMaterial
            color="#cbd6e1"
            metalness={metalness}
            roughness={roughness}
            emissive={accent}
            emissiveIntensity={emission}
          />
        </mesh>
        <mesh position={[0.14, 0.18, 0.74]} rotation={[0.15, 0.22, 0.12]}>
          <boxGeometry args={[0.34, 0.08, 0.025]} />
          <meshBasicMaterial color={accent} transparent opacity={0.75} />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#162233" transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

function AnimatedRig({ accent, progress }) {
  const rig = useRef(null);
  const leftArm = useRef(null);
  const rightArm = useRef(null);
  const leftLeg = useRef(null);
  const rightLeg = useRef(null);

  useFrame((state) => {
    const motion = Math.sin(progress * Math.PI * 2);
    const stride = Math.cos(progress * Math.PI * 2);
    if (rig.current) {
      rig.current.rotation.y = state.clock.elapsedTime * 0.12 - 0.3;
      rig.current.position.y = Math.sin(progress * Math.PI * 4) * 0.08;
    }
    if (leftArm.current) leftArm.current.rotation.z = -0.45 + motion * 0.38;
    if (rightArm.current) rightArm.current.rotation.z = 0.45 - motion * 0.38;
    if (leftLeg.current) leftLeg.current.rotation.z = stride * 0.2;
    if (rightLeg.current) rightLeg.current.rotation.z = -stride * 0.2;
  });

  const jointMaterial = <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.24} metalness={0.68} roughness={0.28} />;
  const boneMaterial = <meshStandardMaterial color="#bdc9d7" emissive={accent} emissiveIntensity={0.08} metalness={0.42} roughness={0.38} />;

  return (
    <group ref={rig} position={[0, 0, 0]}>
      <mesh position={[0, 2.02, 0]} castShadow>{/* Head */}<icosahedronGeometry args={[0.32, 2]} />{jointMaterial}</mesh>
      <mesh position={[0, 1.35, 0]} castShadow>{/* Spine */}<boxGeometry args={[0.22, 0.92, 0.22]} />{boneMaterial}</mesh>
      <mesh position={[0, 1.83, 0]}>{/* Chest joint */}<sphereGeometry args={[0.16, 20, 16]} />{jointMaterial}</mesh>
      <mesh position={[0, 0.82, 0]}>{/* Pelvis */}<boxGeometry args={[0.58, 0.24, 0.28]} />{boneMaterial}</mesh>
      <group ref={leftArm} position={[-0.16, 1.65, 0]}>
        <mesh position={[-0.42, 0, 0]} castShadow><boxGeometry args={[0.76, 0.13, 0.13]} />{boneMaterial}</mesh>
        <mesh position={[-0.82, 0, 0]}><sphereGeometry args={[0.14, 20, 16]} />{jointMaterial}</mesh>
      </group>
      <group ref={rightArm} position={[0.16, 1.65, 0]}>
        <mesh position={[0.42, 0, 0]} castShadow><boxGeometry args={[0.76, 0.13, 0.13]} />{boneMaterial}</mesh>
        <mesh position={[0.82, 0, 0]}><sphereGeometry args={[0.14, 20, 16]} />{jointMaterial}</mesh>
      </group>
      <group ref={leftLeg} position={[-0.18, 0.7, 0]}>
        <mesh position={[0, -0.52, 0]} castShadow><boxGeometry args={[0.16, 0.92, 0.16]} />{boneMaterial}</mesh>
        <mesh position={[0, -1.02, 0]}><sphereGeometry args={[0.13, 20, 16]} />{jointMaterial}</mesh>
      </group>
      <group ref={rightLeg} position={[0.18, 0.7, 0]}>
        <mesh position={[0, -0.52, 0]} castShadow><boxGeometry args={[0.16, 0.92, 0.16]} />{boneMaterial}</mesh>
        <mesh position={[0, -1.02, 0]}><sphereGeometry args={[0.13, 20, 16]} />{jointMaterial}</mesh>
      </group>
    </group>
  );
}

const graphNodes = [
  { id: "input", index: "01", title: "Texture Coordinate", type: "Input", x: "4%", y: "18%", rows: [["Generated", "vector"], ["Normal", "vector"], ["UV", "vector"]] },
  { id: "ramp", index: "04", title: "Color Ramp", type: "Converter", x: "17%", y: "62%", rows: [["Fac", "value"], ["Color", "color"]] },
  { id: "shader", index: "07", title: "Principled BSDF", type: "Shader", x: "39%", y: "30%", rows: [["Base Color", "color"], ["Roughness", "value"], ["Metallic", "value"], ["Normal", "vector"], ["BSDF", "shader"]] },
  { id: "output", index: "12", title: "Material Output", type: "Output", x: "72%", y: "34%", rows: [["Surface", "shader"], ["Volume", "shader"], ["Displacement", "vector"]] }
];

function NodeGraphSurface() {
  const [selectedNode, setSelectedNode] = useState("shader");

  return (
    <div className="tool-lab-runtime-graph tool-lab-runtime-graph--node-editor" aria-label="Blender-style material node graph">
      <div className="tool-lab-runtime-graph-head">
        <span>Shader graph</span>
        <b>Command steel</b>
        <span>4 nodes · 4 links</span>
      </div>
      <svg className="tool-lab-runtime-graph-links" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
        <path d="M196 170 C290 170 292 285 390 285" />
        <path d="M196 235 C290 235 292 320 390 320" />
        <path d="M295 445 C360 445 330 350 390 350" />
        <path d="M612 408 C690 408 690 278 720 278" />
      </svg>
      {graphNodes.map((node) => (
        <article
          className="tool-lab-runtime-graph-node"
          data-active={selectedNode === node.id ? "true" : "false"}
          data-node={node.id}
          key={node.id}
          role="button"
          tabIndex={0}
          style={{ "--node-x": node.x, "--node-y": node.y }}
          onClick={() => setSelectedNode(node.id)}
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedNode(node.id); }}
        >
          <header><span>{node.index}</span><b>{node.title}</b><i>{node.type}</i></header>
          <div className="tool-lab-runtime-graph-sockets">
            {node.rows.map(([label, socket]) => (
              <label key={label} data-socket={socket}>
                <span className="tool-lab-runtime-graph-socket"></span>
                <b>{label}</b>
                {node.id === "shader" && label === "Roughness" && <em>0.28</em>}
                {node.id === "shader" && label === "Metallic" && <em>0.84</em>}
              </label>
            ))}
          </div>
        </article>
      ))}
      <div className="tool-lab-runtime-graph-footer"><span>Shader graph</span><span>116%</span></div>
    </div>
  );
}

function TimelineDemoOverlay({ progress }) {
  const frame = Math.max(1, Math.round(progress * 119) + 1);
  const phase = progress < 0.25 ? "Settle" : progress < 0.5 ? "Reach" : progress < 0.75 ? "Signal" : "Return";
  const tracks = [
    ["Root", [12, 48, 86]],
    ["Arm.L", [22, 56, 78]],
    ["Arm.R", [22, 56, 78]],
    ["Signal", [34, 66, 94]]
  ];

  return (
    <div className="tool-lab-runtime-demo" aria-label="Timeline animation demo">
      <header><span>Demo / Sentinel turn</span><b>F{frame} · {phase}</b></header>
      <div className="tool-lab-runtime-demo-tracks">
        {tracks.map(([name, keys]) => (
          <div className="tool-lab-runtime-demo-track" key={name as string}>
            <span>{name}</span>
            <div>{(keys as number[]).map((key) => <i key={key} style={{ left: `${key}%` }}></i>)}</div>
          </div>
        ))}
        <b className="tool-lab-runtime-demo-playhead" style={{ left: `${progress * 100}%` }}></b>
      </div>
      <footer><span>Timeline demo</span><span>24 fps</span><span>120 frames</span></footer>
    </div>
  );
}

function Player({ accent }) {
  return (
    <Ecctrl camInitDis={6} camFollowMult={[80, 80]} floatHeight={0.22}>
      <mesh castShadow>
        <capsuleGeometry args={[0.24, 0.7, 8, 16]} />
        <meshStandardMaterial color={accent} metalness={0.34} roughness={0.5} />
      </mesh>
    </Ecctrl>
  );
}

function RuntimeScene({ progress, variant, store }) {
  const controlGroup = variant === "node" ? "Material" : variant === "animation" ? "Motion" : "Viewport";
  const controls = useControls(controlGroup, {
    accent: { value: "#4d9bff", label: "Signal" },
    showGrid: { value: true, label: "Grid" },
    ambient: { value: 0.8, min: 0, max: 2, step: 0.05, label: "Ambient" },
    ...(variant === "node"
      ? {
          roughness: { value: 0.28, min: 0, max: 1, step: 0.01, label: "Roughness" },
          metalness: { value: 0.84, min: 0, max: 1, step: 0.01, label: "Metalness" },
          emission: { value: 0.16, min: 0, max: 1, step: 0.01, label: "Emission" }
        }
      : {})
  }, { store });
  const { accent, showGrid, ambient, roughness = 0.28, metalness = 0.84, emission = 0.16 } = controls;

  return (
    <>
      <color attach="background" args={["#090f17"]} />
      <fog attach="fog" args={["#090f17", 8, 18]} />
      <ambientLight intensity={ambient} color="#c8d9ee" />
      <directionalLight position={[4, 8, 3]} intensity={2.2} color="#e8f1ff" castShadow />
      <pointLight position={[-3, 2, -2]} intensity={6} distance={8} color={accent} />
      {showGrid && <Grid args={[20, 20]} cellSize={0.5} sectionSize={2} fadeDistance={16} fadeStrength={1.4} cellColor="#26384c" sectionColor="#4d9bff" />}
      {variant === "3d" && (
        <Physics gravity={[0, -9.81, 0]}>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh receiveShadow position={[0, -0.65, 0]}>
              <boxGeometry args={[20, 0.2, 20]} />
              <meshStandardMaterial color="#111b27" metalness={0.25} roughness={0.72} />
            </mesh>
          </RigidBody>
          <KeyboardControls map={keyboardMap}>
            <Player accent={accent} />
          </KeyboardControls>
        </Physics>
      )}
      {variant === "node" && <MaterialSurface accent={accent} progress={progress} roughness={roughness} metalness={metalness} emission={emission} />}
      {variant === "animation" && <AnimatedRig accent={accent} progress={progress} />}
      {variant === "3d" && <SceneObject accent={accent} progress={progress} />}
    </>
  );
}

export default function ThreeDViewportIsland({ variant = "3d" }: { variant?: ViewportVariant }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const store = useCreateStore();

  return (
    <div className={`tool-lab-runtime-island tool-lab-runtime-island--${variant}`}>
      <div className={`tool-lab-runtime-canvas${variant === "node" ? " tool-lab-runtime-canvas--graph" : ""}`}>
        <Canvas shadows camera={{ position: [4.8, 3.4, 6.2], fov: 42 }} dpr={[1, 2]}>
          <TimelineDriver playing={playing} resetToken={resetToken} onProgress={setProgress} store={store} />
          <RuntimeScene progress={progress} variant={variant} store={store} />
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.38} luminanceThreshold={0.42} luminanceSmoothing={0.16} mipmapBlur />
            <Vignette darkness={0.34} eskil={false} />
          </EffectComposer>
        </Canvas>
        {variant === "node" && <NodeGraphSurface />}
        {variant === "animation" && <TimelineDemoOverlay progress={progress} />}
      </div>
      {variant !== "node" && <div className="tool-lab-runtime-leva" aria-label={`${variant} runtime controls`}>
        <Leva store={store} theme={levaTheme} fill flat collapsed={variant !== "3d"} oneLineLabels titleBar={{ title: variant === "animation" ? "Motion controls" : "Scene", drag: false, filter: false }} />
      </div>}
      {variant !== "node" && <div className="tool-lab-runtime-timeline" aria-label="Timeline controls">
        <button type="button" title={playing ? "Pause timeline" : "Play timeline"} aria-label={playing ? "Pause timeline" : "Play timeline"} onClick={() => setPlaying((value) => !value)}>{playing ? "Ⅱ" : "▶"}</button>
        <button type="button" title="Reset timeline" aria-label="Reset timeline" onClick={() => setResetToken((value) => value + 1)}>↺</button>
        <input aria-label="Timeline position" type="range" min="0" max="1" step="0.01" value={progress} onChange={(event) => setProgress(Number(event.target.value))} />
        <output>{Math.round(progress * 100)}%</output>
      </div>}
    </div>
  );
}
