// @ts-check

import { packagesFixtureNotice } from "./discovery.mjs";
import { packageDetail } from "./package.mjs";

export const maintainerFixture = {
  packageRef: packageDetail.packageRef,
  registryRevision: packagesFixtureNotice.registryRevision,
  stats: [
    { label: "Current releases", value: 3, detail: "stable · preview · historical" },
    { label: "Owned namespaces", value: 4, detail: "all stewardship current" },
    { label: "Pending reviews", value: 2, detail: "compatibility + ownership" },
    { label: "Dependency alerts", value: 3, detail: "1 breaking · 2 advisory" }
  ],
  queues: [
    { id: "release-beta", kind: "release", title: "2.5.0-beta.1 awaits Wasm review", state: "review", owner: "identity:github:reviewer-kappa", evidence: "submission:std.typed:2.5.0-beta.1:77a016d2" },
    { id: "ownership-coerce", kind: "namespace ownership", title: "Delegate std.typed.coerce review scope", state: "request", owner: "identity:github:contributor-lambda", evidence: "ownership-request:std.typed.coerce:12" },
    { id: "migration-nil", kind: "migration", title: "Complete implicit nil coercion removal plan", state: "planning", owner: "identity:github:hoebat", evidence: "migration-plan:std.typed:nil:3" },
    { id: "dependency-query", kind: "dependency", title: "code.query 3.0 removes legacy selector alias", state: "breaking", owner: "identity:github:hoebat", evidence: "compat-alert:code.query:3.0:std.typed" }
  ],
  activity: [
    { identity: "identity:github:contributor-lambda", action: "proposed typed protocol projection", evidence: "contribution:std.typed:489", result: "accepted" },
    { identity: "identity:github:reviewer-kappa", action: "reviewed Rust evaluator compatibility", evidence: "review:std.typed:rust010:17", result: "pass" },
    { identity: "identity:github:hoebat", action: "published 2.4.1", evidence: "publication:std.typed:2.4.1:6a7f813c", result: "published" }
  ],
  bots: [
    { id: "bot-typed-release", label: "typed-release", owner: "identity:github:hoebat", ownerPresent: true, purpose: "Build, sign proposal, and attach reproduction manifest", capabilities: ["build", "check", "propose"], state: "available", receipt: "bot-run:typed-release:881" },
    { id: "bot-compat-watch", label: "compat-watch", owner: "identity:github:reviewer-kappa", ownerPresent: false, purpose: "Open compatibility alerts from exact registry changes", capabilities: ["read registry", "open alert"], state: "paused-owner-away", receipt: "bot-policy:compat-watch:5" }
  ]
};
