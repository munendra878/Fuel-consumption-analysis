export default function Charts({ data }) {
  if (!data || data.length === 0) return <p>No chart data</p>;
  return (
    <div>
      {data.map((item, i) => (
        <div key={i}>
          {item.label}: {item.value}
        </div>
      ))}
    </div>
  );
}
