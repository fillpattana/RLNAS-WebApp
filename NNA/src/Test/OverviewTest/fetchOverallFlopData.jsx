export async function fetchOverallFlopData(runtimestamp) {
  const response = await fetch(
    `http://localhost:3000/api/OverviewFlopMetric/${encodeURIComponent(
      runtimestamp
    )}`
  );
  if (!response.ok) {
    throw new Error(`API call failed with timestamp=${runtimestamp}`);
  }

  const result = await response.json();
  let transformedData = [];
  let agentNames = new Set();

  Object.entries(result).forEach(([agentKey, episodes]) => {
    agentNames.add(agentKey);
    Object.entries(episodes).forEach(([episodeKey, accuracy]) => {
      let episodeNum = parseInt(episodeKey.replace("EPISODE", ""), 10);
      if (!isNaN(episodeNum)) {
        let existingEntry = transformedData.find(
          (entry) => entry.episodeNum === episodeNum
        );
        if (!existingEntry) {
          existingEntry = { episodeNum };
          transformedData.push(existingEntry);
        }
        existingEntry[agentKey] = accuracy !== null ? accuracy : null;
      }
    });
  });

  transformedData.sort((a, b) => a.episodeNum - b.episodeNum);
  return { transformedData, agentNames: Array.from(agentNames) };
}
