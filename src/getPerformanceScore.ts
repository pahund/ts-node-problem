export default async function () {
  const { default: fs } = await import("node:fs");
  const { default: lighthouse } = await import("lighthouse");
  const { default: chromeLauncher } = await import("chrome-launcher");
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "html",
    onlyCategories: ["performance"],
    port: chrome.port,
  };
  // @ts-ignore
  const runnerResult = await lighthouse("https://example.com", options);

  if (!runnerResult) {
    throw Error("no result");
  }

  if (!runnerResult.lhr.categories.performance.score) {
    throw Error("no performance result");
  }

  await chrome.kill();

  return runnerResult.lhr.categories.performance.score * 100;
}
