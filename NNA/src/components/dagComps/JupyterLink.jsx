import Button from "react-bootstrap/Button";

const OpenArchitectureButton = ({ graph }) => {
  const handleClick = () => {
    const raw = graph?.[0]?.Graph; // <- access Graph correctly
    const architecture = raw?.hyperlink?.architecture;

    if (!architecture) {
      alert("No architecture found in graph object.");
      return;
    }

    const encoded = encodeURIComponent(architecture);
    const url = `http://localhost:5000/generate?strings=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <Button onClick={handleClick} variant="primary">
      Open Architecture
    </Button>
  );
};

export default OpenArchitectureButton;
