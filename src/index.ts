(async () => {
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
  // TODO find a way to import interface Flags from lighthouse
  // @ts-ignore
  const runnerResult = await lighthouse("https://example.com", options);

  if (!runnerResult) {
    throw Error("no result");
  }

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync(
    "lhreport.html",
    Array.isArray(reportHtml) ? reportHtml.join("") : reportHtml,
  );

  // `.lhr` is the Lighthouse Result as a JS object
  console.log("Report is done for", runnerResult.lhr.finalDisplayedUrl);
  if (!runnerResult.lhr.categories.performance.score) {
    throw Error("no performance result");
  }
  console.log(
    "Performance score was",
    runnerResult.lhr.categories.performance.score * 100,
  );

  await chrome.kill();
})();
