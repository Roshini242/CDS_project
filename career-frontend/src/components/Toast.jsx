export default function Toast({ msg, type }) {
  if (!msg) return null;
  const isError = type === "error";
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 999,
      background: isError ? "#ff444422" : "#10b98122",
      border: `1px solid ${isError ? "#ff4444" : "#10b981"}`,
      color: isError ? "#ff8888" : "#6ee7b7",
      padding: "12px 20px", borderRadius: "10px",
      fontSize: "0.9rem", animation: "fadeUp .4s ease"
    }}>
      {msg}
    </div>
  );
}