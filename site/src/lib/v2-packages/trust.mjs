// @ts-check

import { packageCards, packageContentTypes } from "./discovery.mjs";
import { packageDetail, releaseScenarios } from "./package.mjs";
import { publishStates } from "./publishing.mjs";

export const provenanceChecklist = [
  { id: "publisher", question: "Who published this package?", answer: packageDetail.publishedBy, authority: "Identity registry", evidence: "publisher signature + publication receipt" },
  { id: "revision", question: "Which revision and artifacts were published?", answer: packageDetail.exactReleaseRevision, authority: "Release registry", evidence: `${packageDetail.sourceRevision} · ${packageDetail.artifactDigest}` },
  { id: "namespaces", question: "Which namespaces are included?", answer: `${packageDetail.namespaceInventory.length} exact namespace references`, authority: "Namespace registry", evidence: packageDetail.namespaceInventory.map(({ ref }) => ref).join(" · ") },
  { id: "targets", question: "Which runtime targets are supported?", answer: packageDetail.compatibility.map(({ target, version, state }) => `${target} ${version}: ${state}`).join(" · "), authority: "Compatibility registry", evidence: packageDetail.compatibility.map(({ evidence }) => evidence).join(" · ") },
  { id: "change", question: "What changed from the previous version?", answer: packageDetail.releases[0].note, authority: "Release note + migration relation", evidence: packageDetail.migration.receipt },
  { id: "reproduce", question: "How can the release be verified or reproduced?", answer: "Resolve the source revision, lock, artifact manifest, digests, checks, and publisher signature.", authority: "Package registry", evidence: "reproduction:std.typed:2.4.1:manifest:58d19c7a" }
];

export const packagesSummary = {
  packages: packageCards.length,
  namespaces: packageCards.reduce((count, item) => count + item.namespaces.length, 0),
  contentTypes: packageContentTypes.length,
  releaseStates: releaseScenarios.length,
  publishStates: publishStates.length,
  provenanceQuestions: provenanceChecklist.length
};
