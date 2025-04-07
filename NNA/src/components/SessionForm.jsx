import { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

function SessionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    datasetname: "",
    floatprecision: 16,
    seed: "",
    batchsize: 1,
    envseed: "",
    maxagents: 1,
    maxepisodes: 1,
    maxiterations: 1,
    maxnodes: 1,
    maxedges: 1,
    agentseed: "",
    agentlearnrate: "",
    agentmode: false,
    agentbias: 0.0,
  });

  const [sessionSeed, setSessionSeed] = useState("");
  const [envSeed, setEnvSeed] = useState("");
  const [agentSeed, setAgentSeed] = useState("");

  const generateRandomSeeds = () => {
    const newSessionSeed = Math.floor(Math.random() * 100000);
    const newEnvSeed = Math.floor(Math.random() * 100000);
    const newAgentSeed = Math.floor(Math.random() * 100000);

    setSessionSeed(newSessionSeed);
    setEnvSeed(newEnvSeed);
    setAgentSeed(newAgentSeed);

    setFormData((prevFormData) => ({
      ...prevFormData,
      seed: newSessionSeed,
      envseed: newEnvSeed,
      agentseed: newAgentSeed,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "range"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/newsession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }

      const result = await response.json();
      console.log("Success:", result);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Data Set Name</Form.Label>
        <Form.Control
          type="text"
          name="datasetname"
          value={formData.datasetname}
          onChange={handleChange}
        />
      </Form.Group>

      <Card className="p-3 mb-3">
        <Form.Group className="mb-3">
          <Form.Label>Float Precision</Form.Label>
          <div>
            {[16, 32].map((precision) => (
              <Form.Check
                key={precision}
                type="radio"
                label={`${precision}`}
                name="floatprecision"
                value={precision}
                checked={formData.floatprecision == precision}
                onChange={handleChange}
                inline
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>GH N3 MODE</Form.Label>
          <Form.Check
            type="switch"
            name="agentmode"
            checked={formData.agentmode}
            onChange={handleChange}
          />
        </Form.Group>

        {[
          { label: "Number of Agents", name: "maxagents", min: 1, max: 8 },
          { label: "Number of Episodes", name: "maxepisodes", min: 1, max: 30 },
          {
            label: "Number of Iterations/Episode",
            name: "maxiterations",
            min: 1,
            max: 25,
          },
          { label: "Number of Nodes", name: "maxnodes", min: 1, max: 40 },
          { label: "Number of Edges", name: "maxedges", min: 1, max: 50 },
          {
            label: "Accuracy vs Efficiency",
            name: "agentbias",
            min: 0,
            max: 1,
            step: 0.01,
          },
        ].map(({ label, name, min, max, step = 1 }) => (
          <Form.Group className="mb-3" key={name}>
            <Form.Label>
              {label}: {formData[name]}
            </Form.Label>
            <Form.Range
              name={name}
              min={min}
              max={max}
              step={step}
              value={formData[name]}
              onChange={handleChange}
            />
          </Form.Group>
        ))}

        {/* Fields that require Number Input */}
        {[
          { label: "Batch Size", name: "batchsize", min: 1 },
          {
            label: "Agent's Learning Rate",
            name: "agentlearnrate",
            step: "any",
          },
        ].map(({ label, name, min, step }) => (
          <Form.Group className="mb-3" key={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type="number"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              min={min}
              step={step}
            />
          </Form.Group>
        ))}
      </Card>

      <Card className="p-3 mb-3">
        <Row className="mb-2">
          <Col>
            <h6>Seeds</h6>
          </Col>
          <Col className="text-end">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={generateRandomSeeds}
            >
              Generate Random
            </Button>
          </Col>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>Session Seed</Form.Label>
          <Form.Control
            type="number"
            name="seed"
            value={sessionSeed}
            onChange={(e) => {
              const newSeed = e.target.value;
              setSessionSeed(newSeed);
              setFormData((prev) => ({ ...prev, seed: newSeed }));
            }}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Env Seed</Form.Label>
          <Form.Control
            type="number"
            name="envseed"
            value={envSeed}
            onChange={(e) => {
              const newEnvSeed = e.target.value;
              setEnvSeed(newEnvSeed);
              setFormData((prev) => ({ ...prev, envseed: newEnvSeed }));
            }}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Agent Seed</Form.Label>
          <Form.Control
            type="number"
            name="agentseed"
            value={agentSeed}
            onChange={(e) => {
              const newAgentSeed = e.target.value;
              setAgentSeed(newAgentSeed);
              setFormData((prev) => ({ ...prev, agentseed: newAgentSeed }));
            }}
          />
        </Form.Group>
      </Card>

      <Button variant="primary" type="submit">
        Confirm
      </Button>
    </Form>
  );
}

export default SessionForm;
