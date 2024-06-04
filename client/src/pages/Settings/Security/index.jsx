export default function Security() {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">Privacy &amp; Security</h2>

      <div className="mb-4 flex">
        <input
          type="checkbox"
          className="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
          id="profile-visibility"
        />
        <label
          htmlFor="profile-visibility"
          className="ms-3 text-sm text-gray-500 dark:text-neutral-400"
        >
          Private Profile
        </label>
      </div>

      <div className="mb-4 flex">
        <input
          type="checkbox"
          className="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
          id="two-factor-auth"
        />
        <label
          htmlFor="two-factor-auth"
          className="ms-3 text-sm text-gray-500 dark:text-neutral-400"
        >
          Two Factor Authentication
        </label>
      </div>

      <ul>
        <li>
          <strong>Change password</strong>
        </li>
        <li>
          <strong>App Permissions:</strong> [Manage App Permissions]
        </li>
        <li>
          <strong>Blocked Users:</strong> [View/Manage Blocked Users]
        </li>
        <li>
          <strong>Data Privacy:</strong> [Manage Data Privacy]
        </li>
        <li>
          <strong>Login History:</strong> [View Login History]
        </li>
      </ul>
    </>
  );
}
