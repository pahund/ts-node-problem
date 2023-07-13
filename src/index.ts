import getPerformanceScore from "./getPerformanceScore";

(async () => {
  const score = await getPerformanceScore();
  console.log("Performance score:", score);
})();
