interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <div className="flex h-12 items-center rounded-xl border border-[#E2E2E0]">
      <button
        type="button"
        onClick={() =>
          onChange(Math.max(min, value - 1))
        }
        className="flex h-full w-11 items-center justify-center text-lg transition hover:bg-[#F7F7F5]"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="w-8 text-center text-sm font-medium">
        {value}
      </span>

      <button
        type="button"
        onClick={() =>
          onChange(value + 1)
        }
        className="flex h-full w-11 items-center justify-center text-lg transition hover:bg-[#F7F7F5]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}