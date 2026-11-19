type TrendChartProps = {
  values: number[];
  labels: string[];
};

function TrendChart({ values, labels }: TrendChartProps) {
  // const points = values
  //   .map((value, index) => `${58 + index * 100},${180 - value * 13}`)
  //   .join(" ");

  const chartWidth = 600;
  const chartHeight = 156;
  const maxValue = Math.max(12, ...values);

  const axisLabels = [
    { value: maxValue, x: 0, y: 28 },
    { value: (maxValue * 2) / 3, x: 5, y: 80 },
    { value: maxValue / 3, x: 5, y: 132 },
    { value: 0, x: 15, y: 184 },
  ];

  const points = values
    .map((value, index) => {
      const x = 58 + (index / Math.max(values.length - 1, 1)) * chartWidth;
      const y = 180 - (value / maxValue) * chartHeight;

      return `${x},${y}`;
    })
    .join(" ");

  const area = `${points} 658,180 58,180`;
  return (
    <svg viewBox="0 0 700 210" role="img" aria-label="Daily steps trend">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#18a999" stopOpacity=".2" />
          <stop offset="1" stopColor="#18a999" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[24, 76, 128, 180].map((y) => (
        <line className="grid-line" key={y} x1="38" y1={y} x2="680" y2={y} />
      ))}

      {axisLabels.map((label) => (
        <text className="axis-label" key={label.y} x={label.x} y={label.y}>
          {label.value === 0 ? "0" : `${Number(label.value.toFixed(1))}k`}
        </text>
      ))}

      {/* <text className="axis-label" x="0" y="28">
        12k
      </text>
      <text className="axis-label" x="5" y="80">
        8k
      </text>
      <text className="axis-label" x="5" y="132">
        4k
      </text>
      <text className="axis-label" x="15" y="184">
        0
      </text> */}
      <polygon className="line-fill" points={area} />
      <polyline className="steps-line" points={points} />
      {/* {values.map((value, index) => (
        <circle
          className="steps-dot"
          key={index}
          cx={58 + index * 100}
          cy={180 - value * 13}
          r="5"
        />
      ))} */}

      {values.map((value, index) => {
        const x = 58 + (index / Math.max(values.length - 1, 1)) * chartWidth;
        const y = 180 - (value / maxValue) * chartHeight;

        return <circle className="steps-dot" key={index} cx={x} cy={y} r="5" />;
      })}

      {/* {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
        <text className="axis-label" key={day} x={49 + index * 100} y="202">
          {day}
        </text>
      ))} */}

      {labels.map((label, index) => {
        const x = 58 + (index / Math.max(values.length - 1, 1)) * chartWidth;

        return (
          <text
            className="axis-label"
            key={label}
            x={x}
            y="202"
            textAnchor="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default TrendChart;
