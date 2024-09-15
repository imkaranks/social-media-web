export default function Appearance() {
  return (
    <>
      <h2>Appearance &amp; Theme</h2>
      <ul>
        <li>
          <strong>Dark Mode:</strong> <input type="checkbox" />
        </li>
        <li>
          <strong>Theme Customization:</strong> [Customize Theme]
        </li>
        <li>
          <strong>Font Size:</strong>{" "}
          <input type="range" min={1} max={3} step={1} />
        </li>
        <li>
          <strong>Background Image:</strong>{" "}
          <input type="file" accept="image/*" />
        </li>
        <li>
          <strong>Display Density:</strong>
          <select>
            <option value="compact">Compact</option>
            <option value="regular">Regular</option>
            <option value="spacious">Spacious</option>
          </select>
        </li>
      </ul>
    </>
  );
}
