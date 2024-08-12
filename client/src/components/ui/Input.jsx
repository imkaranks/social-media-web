import { useId } from "react";

export default function Input({ label, ...props }) {
  const id = useId();

  return (
    <div className="grid">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium dark:text-white"
      >
        {label}
      </label>
      <input
        id={id}
        className="block w-full rounded-lg border-2 border-gray-200 bg-transparent px-4 py-3 text-sm focus:border-blue-500 focus:ring-0 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-600"
        {...props}
      />
    </div>
  );
}
