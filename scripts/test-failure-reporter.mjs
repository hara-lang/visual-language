import { inspect } from "node:util";

const trim = (value, limit = 1200) => {
  const text = String(value ?? "");
  return text.length <= limit ? text : `${text.slice(0, limit)}…`;
};

export default async function* failureReporter(source) {
  let failures = 0;

  for await (const event of source) {
    if (event.type !== "test:fail") continue;
    failures += 1;

    const data = event.data ?? {};
    const error = data.details?.error ?? data.error;
    const location = [data.file, data.line, data.column].filter(Boolean).join(":");
    const details = error ? inspect({
      message: error.message,
      code: error.code,
      operator: error.operator,
      expected: error.expected,
      actual: error.actual,
      stack: error.stack?.split("\n").slice(0, 7).join("\n")
    }, {
      depth: 4,
      colors: false,
      compact: false,
      breakLength: 110,
      maxArrayLength: 20,
      maxStringLength: 900
    }) : "No error object was supplied by the test runner.";

    yield `\nFAIL ${failures}: ${data.name ?? "unnamed test"}\n${location ? `LOCATION ${location}\n` : ""}${trim(details, 3400)}\n`;
  }

  yield `\nTOTAL FAILURES: ${failures}\n`;
}
