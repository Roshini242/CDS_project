export default function Spinner() {
  return (
    <div style={{
      width: 20, height: 20,
      border: "2px solid #ffffff44",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin .8s linear infinite",
      display: "inline-block"
    }} />
  );
}