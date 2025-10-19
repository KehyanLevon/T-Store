import { useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { createProductFx } from "../entities/products/model";
import { ProductForm, type ProductFormSubmit } from "../components/ProductForm";
import "./ProductCreate.css";

export default function ProductCreate() {
  const [createProduct, pending] = useUnit([
    createProductFx,
    createProductFx.pending,
  ]);
  const navigate = useNavigate();

  async function handleSubmit(data: ProductFormSubmit) {
    await createProduct({
      name: data.name,
      price: data.price,
      discountPrice: data.discountPrice,
      description: data.description,
      photoBase64: data.photoBase64 ?? undefined,
      photoMime: data.photoMime ?? undefined,
    });
    navigate("/products");
  }

  return (
    <div className="card create-product">
      <h1 className="cp__title">Create a product</h1>
      <ProductForm
        mode="create"
        initialValues={{
          name: "",
          price: "",
          discountPrice: "",
          description: "",
        }}
        pending={pending}
        onCancel={() => navigate("/products")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
