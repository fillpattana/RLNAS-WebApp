import { describe, it, expect, vi, test } from "vitest";
import {
  handleAgentChange,
  handleEpisodeClick,
  handleNodeClick,
  handleNextIteration,
} from "./agentPageChangeHandlers"; // Adjust if needed

test("handleAgentChange calls setActiveAgent with agentId", () => {
  const mockSetActiveAgent = vi.fn();
  const agentChangeHandler = handleAgentChange(mockSetActiveAgent);

  agentChangeHandler("Agent 1");

  expect(mockSetActiveAgent).toHaveBeenCalledWith("Agent 1");
});

test("handleEpisodeClick calls setActiveEpisode with episode", () => {
  const mockSetActiveEpisode = vi.fn();
  const episodeClickHandler = handleEpisodeClick(mockSetActiveEpisode);

  const episode = { name: "Episode 2" };
  episodeClickHandler(episode);

  expect(mockSetActiveEpisode).toHaveBeenCalledWith(episode);
});

test("handleNodeClick updates selectedNodeRef and calls setSelectedNode", () => {
  const mockSetSelectedNode = vi.fn();
  const selectedNodeRef = { current: null };

  const nodeClickHandler = handleNodeClick(
    mockSetSelectedNode,
    selectedNodeRef
  );
  const nodeData = { id: 1, label: "Node A" };

  nodeClickHandler(nodeData);

  expect(selectedNodeRef.current).toEqual(nodeData);
  expect(mockSetSelectedNode).toHaveBeenCalledWith(nodeData);
});

test("handleNextIteration sets index and fetches graph data if not cached", async () => {
  const mockSetIndex = vi.fn();
  const mockSetGraphData = vi.fn(
    (fn) => fn({ 0: "existing" }) // simulate previous state
  );
  const mockFetchGraphDataFn = vi.fn().mockResolvedValue("newData");

  const handler = handleNextIteration(
    mockSetIndex,
    "Agent 3",
    { name: "Episode 5" },
    { 0: "existing" },
    mockSetGraphData,
    "2025-04-10T00:00:00Z",
    mockFetchGraphDataFn
  );

  await handler(2);

  expect(mockSetIndex).toHaveBeenCalledWith(2);
  expect(mockFetchGraphDataFn).toHaveBeenCalledWith(
    "2025-04-10T00:00:00Z",
    "3",
    "5",
    2
  );

  expect(mockSetGraphData).toHaveBeenCalled();
});
