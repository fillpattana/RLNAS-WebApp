function Properties({ node }) {
  if (!node) return <div>Select a node to see details</div>;
  return (
    <div>
      <h3>Node Details</h3>
      <p>
        <strong>Node Number:</strong> {node.id}
      </p>
      <p>
        <strong>Node Type:</strong> {node.type}
      </p>
      <p>
        <strong>Activation Function:</strong> {node.activation}
      </p>
      <p>
        <strong>Weights:</strong> {JSON.stringify(node.weights)}
      </p>
      <p>
        <strong>Biases:</strong> {JSON.stringify(node.biases)}
      </p>
    </div>
  );
}

export default Properties;
