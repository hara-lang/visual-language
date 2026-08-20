// @ts-check

import { packageDetail } from "./package.mjs";

export const namespaceDetail = {
  id: "namespace-std-typed",
  contentType: "packages.namespace",
  schemaVersion: "2.2.0",
  namespaceRef: "namespace:std.typed",
  name: "std.typed",
  packageRef: packageDetail.packageRef,
  packageCoordinate: packageDetail.coordinate,
  exactRevision: "namespace:std.typed:91c8347e2ac05bb1",
  status: "active",
  introduced: "2.0.0",
  deprecated: null,
  owner: "identity:github:hoebat",
  stewards: [
    { identity: "identity:github:hoebat", scope: "owner", since: "2.0.0" },
    { identity: "identity:github:reviewer-kappa", scope: "schema review", since: "2.3.0" }
  ],
  categories: [
    { id: "schema", label: "Schema construction", forms: [{ name: "schema", kind: "function", introduced: "2.0.0" }, { name: "optional", kind: "function", introduced: "2.4.0" }, { name: "union", kind: "function", introduced: "2.4.0" }] },
    { id: "validation", label: "Validation", forms: [{ name: "check", kind: "function", introduced: "2.0.0" }, { name: "explain", kind: "function", introduced: "2.1.0" }, { name: "valid?", kind: "predicate", introduced: "2.0.0" }] },
    { id: "coercion", label: "Coercion", forms: [{ name: "coerce", kind: "function", introduced: "2.1.0" }, { name: "coercion-receipt", kind: "function", introduced: "2.4.0" }, { name: "coerce-nil", kind: "function", introduced: "2.1.0", deprecated: "2.4.0" }] }
  ],
  availability: [
    { runtime: "JVM", packageVersion: "2.4.1", state: "available" },
    { runtime: "Rust evaluator", packageVersion: "2.4.1", state: "available" },
    { runtime: "Browser/Wasm", packageVersion: "2.4.1", state: "partial" },
    { runtime: "Node", packageVersion: "2.4.1", state: "available" }
  ],
  aliases: [
    { alias: "typed", target: "std.typed", state: "supported", introduced: "2.0.0" },
    { alias: "schema/check", target: "std.typed/check", state: "migration", introduced: "1.8.0", deprecated: "2.3.0" }
  ],
  conflicts: [
    { symbol: "check", namespace: "tool.metaspec", resolution: "Use qualified symbols; no registry collision exists.", state: "documented" },
    { symbol: "schema", namespace: "std.schema", resolution: "Legacy alias redirects to std.typed/schema through 3.0.", state: "migration" }
  ],
  migrations: [
    { from: "std.schema", to: "std.typed", version: "2.0.0", receipt: "namespace-migration:std.schema->std.typed:2" },
    { from: "schema/check", to: "std.typed/check", version: "2.3.0", receipt: "symbol-migration:schema.check->std.typed.check" }
  ],
  contributions: [
    { identity: "identity:github:hoebat", action: "accepted namespace ownership", evidence: "ownership:std.typed:91c8347e" },
    { identity: "identity:github:reviewer-kappa", action: "reviewed optional schema migration", evidence: "review:std.typed:optional:2.4" },
    { identity: "identity:github:contributor-lambda", action: "added coercion receipt examples", evidence: "contribution:std.typed:441" }
  ],
  exampleSource: `(require '[std.typed :as t])\n\n(def profile\n  (t/schema {:name :string\n             :email (t/optional :string)}))\n\n(t/check profile {:name "Ada"})`
};
