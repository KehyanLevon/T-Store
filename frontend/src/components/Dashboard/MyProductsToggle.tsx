interface MyProductsToggleProps {
  enabled: boolean;
  onToggle: () => void;
  visible?: boolean;
}

export function MyProductsToggle({
  enabled,
  onToggle,
  visible = true,
}: MyProductsToggleProps) {
  if (!visible) return null;

  return (
    <div className="toggle-wrap">
      <span className="toggle-label">My Products</span>
      <button
        className="switch"
        role="switch"
        aria-checked={enabled}
        id="my-products"
        onClick={onToggle}
        title={enabled ? "Showing only your products" : "Show only my products"}
      >
        <span className="switch__thumb"></span>
      </button>
    </div>
  );
}
