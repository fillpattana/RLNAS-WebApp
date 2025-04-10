export const handleAgentChange = (setActiveAgent) => (agentId) => {
  setActiveAgent(agentId);
};

export const handleEpisodeClick = (setActiveEpisode) => (episode) => {
  setActiveEpisode(episode);
};

export const handleNodeClick =
  (setSelectedNode, selectedNodeRef) => (nodeData) => {
    selectedNodeRef.current = nodeData;
    setSelectedNode(nodeData);
  };

export const handleNextIteration =
  (
    setIndex,
    activeAgent,
    activeEpisode,
    graphData,
    setGraphData,
    timestamp,
    fetchGraphDataFn
  ) =>
  async (selectedIndex) => {
    setIndex(selectedIndex);

    const agentNum = activeAgent.split(" ")[1];
    const episodeNum = activeEpisode.name.split(" ")[1];
    const iterationNum = selectedIndex;

    if (!graphData[iterationNum]) {
      const data = await fetchGraphDataFn(
        timestamp,
        agentNum,
        episodeNum,
        iterationNum
      );
      setGraphData((prevData) => ({ ...prevData, [iterationNum]: data }));
    }
  };
