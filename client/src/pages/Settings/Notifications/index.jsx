export default function Notifications() {
  return (
    <>
      <h2>Notification Settings</h2>
      <ul>
        <li>
          <strong>Push Notifications:</strong> <input type="checkbox" />
        </li>
        <li>
          <strong>Email Notifications:</strong> <input type="checkbox" />
        </li>
        <li>
          <strong>In-App Alerts:</strong> <input type="checkbox" />
        </li>
        <li>
          <strong>Mute/Unmute Conversations:</strong> [Manage Conversations]
        </li>
      </ul>
    </>
  );
}
