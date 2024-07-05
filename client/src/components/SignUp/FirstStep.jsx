export default function FirstStep({ email, password, updateFormData }) {
  return (
    <>
      <div className="grid">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className="block w-full rounded-lg border-2 border-gray-200 bg-transparent px-4 py-3 text-sm focus:border-blue-500 focus:ring-0 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-600"
          placeholder="you@site.com"
        />
      </div>
      <div className="grid">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => updateFormData({ password: e.target.value })}
          placeholder="••••••••"
          className="block w-full rounded-lg border-2 border-gray-200 bg-transparent px-4 py-3 text-sm focus:border-blue-500 focus:ring-0 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-600"
        />
      </div>
    </>
  );
}
