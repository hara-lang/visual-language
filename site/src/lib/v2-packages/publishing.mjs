// @ts-check

/** @typedef {"draft" | "checks-failing" | "review-pending" | "published" | "superseded" | "revoked"} PublishState */

export const publishStates = [
  { id: "draft", label: "Draft", state: "draft", tone: "muted", summary: "Author-owned release and migration notes are editable. No release identity exists.", editable: true, receipt: null },
  { id: "checks-failing", label: "Checks failing", state: "checks-failing", tone: "error", summary: "The exact build attempt is retained; publication is blocked until dependency and compatibility findings pass.", editable: true, receipt: "build-attempt:std.typed:2.5.0-beta.1:failure:4" },
  { id: "review-pending", label: "Review pending", state: "review-pending", tone: "signal", summary: "The submitted source, artifacts, declarations, and author notes are fenced for review.", editable: false, receipt: "submission:std.typed:2.5.0-beta.1:77a016d2" },
  { id: "published", label: "Published", state: "published", tone: "success", summary: "Package coordinates, version, namespace inventory, compatibility evidence, artifacts, and publisher signature are durable.", editable: false, receipt: "publication:std.typed:2.5.0-beta.1:1b74d02a" },
  { id: "superseded", label: "Superseded", state: "superseded", tone: "warning", summary: "The release remains reproducible and points to the replacing exact version.", editable: false, receipt: "supersession:std.typed:2.5.0-beta.1->2.5.0" },
  { id: "revoked", label: "Revoked", state: "revoked", tone: "error", summary: "Publication remains visible with its revocation reason and verification evidence; install is blocked.", editable: false, receipt: "revocation:std.typed:2.5.0-beta.1:key-compromise" }
];

export const publishFixture = {
  contentType: "packages.release",
  schemaVersion: "2.2.0",
  draftRevision: "release-draft:std.typed:2.5.0-beta.1:77a016d2",
  authorFields: ["title", "summary", "releaseNotes", "migrationNotes", "tags"],
  controlledFields: ["contentId", "package", "namespace", "version", "maintainers", "compatibilityMatrix", "artifactDigest", "status", "revision", "publicationReceipt"],
  metadata: {
    title: "std.typed 2.5.0 beta 1",
    summary: "Adds typed protocol projections and checker evidence for cross-runtime schema boundaries.",
    releaseNotes: "Promotes protocol projection and explicit mismatch facts into the shared typed contract.",
    migrationNotes: "No source break for 2.4 consumers; new projection receipts are opt-in."
  },
  declaration: {
    package: "package:hara/std.typed",
    namespaces: ["namespace:std.typed", "namespace:std.typed.schema", "namespace:std.typed.coerce", "namespace:std.typed.validate"],
    version: "2.5.0-beta.1",
    languageRange: ">=0.9 <1.0",
    runtimes: ["JVM 21", "Rust evaluator 0.10", "Browser/Wasm 0.10", "Node 22"]
  },
  artifacts: [
    { path: "dist/std.typed-2.5.0-beta.1.hara", kind: "source archive", size: "184 KiB", digest: "sha256:11d3a86bf271" },
    { path: "dist/std.typed-2.5.0-beta.1.jvm.jar", kind: "JVM artifact", size: "412 KiB", digest: "sha256:286c1a5e30b2" },
    { path: "dist/std.typed-2.5.0-beta.1.wasm", kind: "Wasm artifact", size: "238 KiB", digest: "sha256:f1cc72d05e9a" },
    { path: "dist/reproduction.json", kind: "reproduction manifest", size: "8 KiB", digest: "sha256:9e4b60b119f2" }
  ],
  checks: [
    { id: "metadata", label: "Contract validation", state: "pass", detail: "hara.packages@2.2.0" },
    { id: "namespaces", label: "Namespace ownership", state: "pass", detail: "4 of 4 exact stewardship records" },
    { id: "dependencies", label: "Dependency lock", state: "pass", detail: "12 direct and transitive artifacts verified" },
    { id: "jvm", label: "JVM compatibility", state: "pass", detail: "214 checks" },
    { id: "rust", label: "Rust evaluator compatibility", state: "pass", detail: "208 checks" },
    { id: "wasm", label: "Browser/Wasm compatibility", state: "warning", detail: "2 observation tests require review" },
    { id: "signature", label: "Publisher signature", state: "pending", detail: "identity:github:hoebat" }
  ],
  previewInstallCommand: "hara packages install hara/std.typed@2.5.0-beta.1 --digest sha256:11d3a86bf271",
  signingEnvelope: {
    publisher: "identity:github:hoebat",
    key: "key:greenways:packages:7b1f",
    sourceRevision: "git:77a016d2f9be481c",
    artifactManifest: "manifest:std.typed:2.5.0-beta.1:9e4b60b1",
    expectedReceipt: "publication:std.typed:2.5.0-beta.1:<registry-digest>"
  }
};

/** @param {string} id */
export function publishState(id) {
  return publishStates.find((state) => state.id === id || state.state === id) ?? publishStates[0];
}
