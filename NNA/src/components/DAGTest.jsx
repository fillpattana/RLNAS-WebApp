import React, { useEffect, useRef } from "react";

const DAGTest = ({ iteration, agent, episode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 1000;
    canvas.height = 500;

    // Clear previous drawings
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Text properties
    context.font = "50px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Draw text on canvas
    context.fillText(`Agent: ${agent}`, canvas.width / 2, canvas.height / 3);
    context.fillText(
      `Episode: ${episode}`,
      canvas.width / 2,
      canvas.height / 2
    );
    context.fillText(
      `Iteration: ${iteration}`,
      canvas.width / 2,
      (canvas.height / 3) * 2
    );
  }, [iteration, agent, episode]);

  return <canvas ref={canvasRef} />;
};

export default DAGTest;
