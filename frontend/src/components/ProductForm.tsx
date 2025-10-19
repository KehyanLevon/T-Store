import { useState, type FormEvent } from "react";
import { InputField } from "../shared/ui/InputField";
import "../pages/ProductCreate.css";

export type ProductFormValues = {
  name: string;
  price: string;
  discountPrice: string;
  description: string;
  existingPhotoBase64?: string | null;
  existingPhotoMime?: string | null;
};

export type ProductFormSubmit = {
  name: string;
  price: number;
  discountPrice?: number | null;
  description?: string | null;
  photoBase64?: string | null;
  photoMime?: string | null;
};

export function ProductForm(props: {
  mode: "create" | "edit";
  initialValues: ProductFormValues;
  pending?: boolean;
  onCancel?: () => void;
  onSubmit: (data: ProductFormSubmit) => Promise<void> | void;
}) {
  const { mode, initialValues, pending, onCancel, onSubmit } = props;

  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);

  const [newPhotoBase64, setNewPhotoBase64] = useState<string | undefined>();
  const [newPhotoMime, setNewPhotoMime] = useState<string | undefined>();
  const [removePhoto, setRemovePhoto] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function fileToBase64(
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

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("The file must be an image");

    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024)
      return setError(`The file is too large (>${MAX_MB}MB)`);

    const { base64, mime } = await fileToBase64(file);
    setNewPhotoBase64(base64);
    setNewPhotoMime(mime);
    setRemovePhoto(false);
    setError(null);
  }

  function validate(): string | null {
    const price = Number(form.price);
    const discountPrice = form.discountPrice
      ? Number(form.discountPrice)
      : null;

    if (!form.name.trim()) return "Name is required";
    if (!Number.isFinite(price) || price <= 0) return "The price must be > 0";
    if (discountPrice != null) {
      if (!Number.isFinite(discountPrice) || discountPrice < 0)
        return "Incorrect discount price";
      if (discountPrice > price)
        return "The discount price cannot be higher than the price";
    }
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    const price = Number(form.price);
    const discountPrice = form.discountPrice
      ? Number(form.discountPrice)
      : null;
    const payload: ProductFormSubmit = {
      name: form.name.trim(),
      price,
      discountPrice: discountPrice ?? undefined,
      description: form.description.trim() || undefined,
      photoBase64:
        mode === "create"
          ? newPhotoBase64 ?? undefined
          : removePhoto
          ? null
          : newPhotoBase64 !== undefined
          ? newPhotoBase64
          : undefined,
      photoMime:
        mode === "create"
          ? newPhotoMime ?? undefined
          : removePhoto
          ? null
          : newPhotoMime !== undefined
          ? newPhotoMime
          : undefined,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err?.message || "Operation failed");
    }
  }

  const previewSrc =
    newPhotoBase64 && newPhotoMime
      ? `data:${newPhotoMime};base64,${newPhotoBase64}`
      : removePhoto
      ? null
      : form.existingPhotoBase64 && form.existingPhotoMime
      ? `data:${form.existingPhotoMime};base64,${form.existingPhotoBase64}`
      : null;

  return (
    <form onSubmit={handleSubmit} className="cp__form">
      <InputField
        label="Product name"
        id="name"
        name="name"
        type="text"
        placeholder="e.g., Handcrafted Leather Wallet"
        value={form.name}
        onChange={handleChange}
      />

      <div className="cp__row">
        <div className="cp__col">
          <InputField
            label="Price"
            id="price"
            name="price"
            type="number"
            inputMode="decimal"
            placeholder="$ 50.00"
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <div className="cp__col">
          <InputField
            label="Discounted price (optional)"
            id="discountPrice"
            name="discountPrice"
            type="number"
            inputMode="decimal"
            placeholder="$ 40.00"
            value={form.discountPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="photo">
          Photo (optional)
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleFile}
        />

        {previewSrc && (
          <div className="cp__preview">
            <img src={previewSrc} alt="preview" />
            <button
              type="button"
              className="btn btn--muted cp__remove"
              onClick={() => {
                setNewPhotoBase64(undefined);
                setNewPhotoMime(undefined);
              }}
            >
              Clear new file
            </button>
          </div>
        )}

        {mode === "edit" && (form.existingPhotoBase64 || newPhotoBase64) && (
          <label className="cp__remove-check">
            <input
              type="checkbox"
              checked={removePhoto}
              onChange={(e) => setRemovePhoto(e.target.checked)}
            />
            <span>Remove photo</span>
          </label>
        )}

        <p className="muted">PNG, JPG, GIF up to 10MB</p>
      </div>

      <div className="field">
        <label className="label" htmlFor="description">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          className="input cp__textarea"
          placeholder="e.g., This handcrafted leather wallet is made with premium full-grain leather..."
          value={form.description}
          onChange={handleChange}
          rows={5}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="cp__actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn--muted"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </button>
        )}
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending
            ? mode === "create"
              ? "Publishing..."
              : "Saving..."
            : mode === "create"
            ? "Publish"
            : "Save changes"}
        </button>
      </div>
    </form>
  );
}
