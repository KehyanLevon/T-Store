export interface SearchBarProps {
  value: string;
  onChange: (next: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search">
      <label className="search__label">
        <svg
          className="search__icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>

        <input
          className="search__input"
          placeholder="Search for products"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ border: "1px solid #f6f7f8" }}
        />
      </label>
    </div>
  );
}
