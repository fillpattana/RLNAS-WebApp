function Properties({ node }) {
  if (!node) return <div>Select a node to see details</div>;

  const { id, type, activation, params } = node;

  return (
    <div style={{ padding: 20, margin: 2 }}>
      <p>
        <strong>Node Number:</strong> {id}
      </p>
      <p>
        <strong>Node Type:</strong> {type}
      </p>

      {type === "convolutional" && (
        <>
          <p>
            <strong>Activation Function:</strong> {activation?.type || "N/A"}
          </p>
          <p>
            <strong>Weights:</strong>
          </p>
          <p>
            {params?.weights ? JSON.stringify(params.weights, null, 2) : "N/A"}
          </p>
          <p>
            <strong>Biases:</strong>
          </p>
          <p>
            {params?.biases ? JSON.stringify(params.biases, null, 2) : "N/A"}
          </p>
          <p>
            <strong>Stride:</strong> {params?.stride ?? "N/A"}
          </p>
          <p>
            <strong>Padding:</strong> {params?.padding ?? "N/A"}
          </p>
          <p>
            <strong>Kernel Size:</strong> {params?.kernelsize_x} x{" "}
            {params?.kernelsize_y}
          </p>
          <p>
            <strong>Filters:</strong> {params?.numoffilter ?? "N/A"}
          </p>
        </>
      )}

      {type === "dense" && (
        <>
          <p>
            <strong>Number of Nodes:</strong> {params?.numofnodes ?? "N/A"}
          </p>
          <p>
            <strong>Activation Function:</strong> {activation?.type || "N/A"}
          </p>
          <p>
            <strong>Weights:</strong>
          </p>
          <p>
            {params?.weights ? JSON.stringify(params.weights, null, 2) : "N/A"}
          </p>
          <p>
            <strong>Biases:</strong>
          </p>
          <p>
            {params?.biases ? JSON.stringify(params.biases, null, 2) : "N/A"}
          </p>
        </>
      )}
    </div>
  );
}

export default Properties;
