export function handleChange(e, formData, setFormData) {
  const { name, value, type, checked } = e.target;

  const newValue =
    type === "checkbox" ? checked : type === "range" ? Number(value) : value;

  setFormData({
    ...formData,
    [name]: newValue,
  });
}
