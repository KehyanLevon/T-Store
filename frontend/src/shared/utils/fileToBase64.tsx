export default async function fileToBase64(
  file: File
): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const [prefix, base64] = result.split(",", 2);
      const mime =
        prefix.match(/^data:(.*?);base64$/)?.[1] ||
        file.type ||
        "application/octet-stream";
      resolve({ base64, mime });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
