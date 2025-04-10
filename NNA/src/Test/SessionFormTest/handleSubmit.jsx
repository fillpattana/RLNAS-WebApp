export async function handleSubmit(e, formData, onSuccess, setError) {
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
    if (setError) setError(error.message);
  }
}
