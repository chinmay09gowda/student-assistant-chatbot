export async function sendMessage(messages, file = null) {
  try {
    const formData = new FormData();
    formData.append("messages", JSON.stringify(messages));
    if (file) {
      formData.append("file", file);
    }

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const resp = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      body: formData,
    });
    const data = await resp.json();
    return data.reply || "No response";
  } catch (err) {
    console.error(err);
    return "Error connecting to backend";
  }
}
