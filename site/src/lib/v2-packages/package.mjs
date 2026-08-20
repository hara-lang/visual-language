// @ts-check

/** @typedef {"available" | "install-failure" | "deprecated" | "superseded" | "withdrawn" | "revoked"} ReleaseScenarioState */

import { packagesFixtureNotice } from "./discovery.mjs";

export const packageDetail = {
  id: "package-hara-std-typed",
  contentType: "packages.package",
  releaseContentType: "packages.release",
  schemaVersion: "2.2.0",
  packageRef: "package:hara/std.typed",
  coordinate: "hara/std.typed",
  title: "Typed schemas and coercion",
  purpose: "Canonical schema, validation, coercion, and typed data contracts for Hara programs.",
  version: "2.4.1",
  status: "stable",
  exactReleaseRevision: "release:std.typed:2.4.1:6a7f813ca41d227e",
  artifactDigest: "sha256:8ad194f1764a5f0a4c9f0a16dd2db49e8a9f309ab3c7ca1cc60bc081766a34d2",
  sourceRevision: "git:941ad1a87e2c46b3",
  publishedBy: "identity:github:hoebat",
  publishedAt: "2026-08-18T09:15:00Z",
  registryRevision: packagesFixtureNotice.registryRevision,
  installCommand: "hara packages install hara/std.typed@2.4.1 --digest sha256:8ad194f1764a5f0a",
  installProjectionNote: "Illustrative CLI projection. The package runtime owns executable install syntax and verification.",
  namespaceInventory: [
    { ref: "namespace:std.typed", name: "std.typed", status: "active", publicForms: 18, introduced: "2.0.0" },
    { ref: "namespace:std.typed.schema", name: "std.typed.schema", status: "active", publicForms: 31, introduced: "2.0.0" },
    { ref: "namespace:std.typed.coerce", name: "std.typed.coerce", status: "active", publicForms: 14, introduced: "2.1.0" },
    { ref: "namespace:std.typed.validate", name: "std.typed.validate", status: "active", publicForms: 22, introduced: "2.0.0" }
  ],
  maintainers: [
    { identity: "identity:github:hoebat", label: "Hoebat", role: "owner", scope: "package + all namespaces", evidence: "maintainer:std.typed:owner:91e87c2a" },
    { identity: "identity:github:reviewer-kappa", label: "Kappa Reviewer", role: "release reviewer", scope: "compatibility + migration", evidence: "maintainer:std.typed:review:27a901bc" },
    { identity: "identity:bot:typed-release", label: "typed-release", role: "owned release bot", scope: "build + sign proposal", owner: "identity:github:hoebat", evidence: "bot-policy:typed-release:3" }
  ],
  compatibility: [
    { target: "JVM", version: "21", state: "verified", evidence: "compat:std.typed:2.4.1:jvm21:pass" },
    { target: "Rust evaluator", version: "0.9", state: "verified", evidence: "compat:std.typed:2.4.1:rust09:pass" },
    { target: "Browser/Wasm", version: "0.9", state: "partial", evidence: "compat:std.typed:2.4.1:wasm09:partial" },
    { target: "Node", version: "22", state: "verified", evidence: "compat:std.typed:2.4.1:node22:pass" }
  ],
  dependencies: [
    { coordinate: "hara/std.lib", range: "^4.2", resolved: "4.2.3", digest: "sha256:f3042a8c" },
    { coordinate: "hara/std.string", range: "^3.7", resolved: "3.7.1", digest: "sha256:ab117d92" },
    { coordinate: "hara/code.query", range: "^2.1", resolved: "2.1.0", digest: "sha256:9ce54a21" }
  ],
  reverseDependencies: [
    { coordinate: "hara/tool.metaspec", version: "1.7.0", compatibility: "verified" },
    { coordinate: "hara/tool.lint", version: "3.2.1", compatibility: "verified" },
    { coordinate: "greenways/hestia-schema", version: "0.4.0", compatibility: "partial" }
  ],
  releases: [
    { version: "2.4.1", date: "2026-08-18", state: "current", revision: "6a7f813ca41d227e", note: "Promotes generic schema extensions and explicit coercion receipts." },
    { version: "2.4.0", date: "2026-07-29", state: "superseded", revision: "f2e11caa98d74360", note: "Adds portable union and tuple schemas." },
    { version: "2.3.2", date: "2026-06-11", state: "deprecated", revision: "81ef642c9ca16e0b", note: "Deprecated implicit nil coercion; migrate to optional schemas." },
    { version: "2.2.0", date: "2026-03-08", state: "revoked", revision: "901d27bc646331fa", note: "Artifact signature mismatch; identity and revocation receipt retained." }
  ],
  migration: {
    from: "2.3.x",
    to: "2.4.1",
    summary: "Replace implicit nil coercion with `(optional schema)` and inspect the generated coercion receipt.",
    receipt: "migration:std.typed:2.3-to-2.4:4d12a7c9"
  },
  links: ["source", "specification", "license", "publication receipt", "reproduction manifest"]
};

/** @type {{id:string,label:string,state:ReleaseScenarioState,tone:string,summary:string,installAllowed:boolean,receipt:string|null,findings:{code:string,severity:string,message:string}[]}[]} */
export const releaseScenarios = [
  { id: "available", label: "Available release", state: "available", tone: "success", summary: "Artifact, signature, compatibility evidence, and exact registry revision are available.", installAllowed: true, receipt: "release:std.typed:2.4.1:6a7f813c", findings: [] },
  { id: "install-failure", label: "Install failed", state: "install-failure", tone: "error", summary: "The resolver could not satisfy one locked dependency. The release itself remains current.", installAllowed: true, receipt: "install-attempt:std.typed:2.4.1:failure:17", findings: [{ code: "PKG-RESOLVE-014", severity: "error", message: "hara/std.string@3.7.1 is unavailable from the selected mirror." }] },
  { id: "deprecated", label: "Deprecated release", state: "deprecated", tone: "warning", summary: "Installation remains possible for exact historical reproduction; a migration target is named.", installAllowed: true, receipt: "deprecation:std.typed:2.3.2:optional-schema", findings: [{ code: "PKG-DEPRECATED-003", severity: "warning", message: "Implicit nil coercion was replaced in 2.4.0." }] },
  { id: "superseded", label: "Superseded release", state: "superseded", tone: "warning", summary: "The exact release remains inspectable and points to its replacement.", installAllowed: true, receipt: "supersession:std.typed:2.4.0->2.4.1", findings: [] },
  { id: "withdrawn", label: "Withdrawn release", state: "withdrawn", tone: "error", summary: "New installation is disabled. Identity, reason, artifact facts, and historical dependants remain visible.", installAllowed: false, receipt: "withdrawal:std.typed:2.1.4:publisher-request", findings: [{ code: "PKG-WITHDRAWN-002", severity: "error", message: "Publisher withdrew this release after an incomplete artifact upload." }] },
  { id: "revoked", label: "Revoked release", state: "revoked", tone: "error", summary: "Verification failed after publication. Installation and redistribution are blocked by registry policy.", installAllowed: false, receipt: "revocation:std.typed:2.2.0:signature-mismatch", findings: [{ code: "PKG-VERIFY-021", severity: "error", message: "Artifact digest does not match the signed release manifest." }] }
];

/** @param {string} id */
export function releaseScenario(id) {
  return releaseScenarios.find((scenario) => scenario.id === id || scenario.state === id) ?? releaseScenarios[0];
}
