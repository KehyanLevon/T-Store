import fileToBase64 from "../../shared/utils/fileToBase64";

interface PhotoUploaderProps {
  photoBase64?: string;
  photoMime?: string;
  onChange: (payload: { base64?: string; mime?: string }) => void;
  onRemove: () => void;
  onError: (msg: string | null) => void;
}

export function PhotoUploader({
  photoBase64,
  photoMime,
  onChange,
  onRemove,
  onError,
}: PhotoUploaderProps) {
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        onError("The file must be an image");
        return;
      }
      const MAX_MB = 5;
      if (file.size > MAX_MB * 1024 * 1024) {
        onError(`The file is too large (>${MAX_MB}MB)`);
        return;
      }

      const { base64, mime } = await fileToBase64(file);
      onChange({ base64, mime });
      onError(null);
    } catch (err: any) {
      onError(err?.message || "Failed to read file");
    }
  }

  return (
    <div className="field">
      <label className="label">Profile Photo</label>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div className="avatar-preview">
          {photoBase64 && photoMime ? (
            <img src={`data:${photoMime};base64,${photoBase64}`} alt="avatar" />
          ) : (
            <div className="avatar-empty" />
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <label className="btn btn--muted" style={{ cursor: "pointer" }}>
            Change
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </label>

          <button
            type="button"
            className="btn btn--muted"
            onClick={onRemove}
            disabled={!photoBase64}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
