export function generateRandomSeeds() {
  const newSessionSeed = Math.floor(Math.random() * 100000);
  const newEnvSeed = Math.floor(Math.random() * 100000);
  const newAgentSeed = Math.floor(Math.random() * 100000);

  return {
    seed: newSessionSeed,
    envseed: newEnvSeed,
    agentseed: newAgentSeed,
  };
}
