import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Charts.css";

interface Statistics {
  storage: number;
  cpu: number;
  ram: number;
  diskIO: number;
  battery: number;
}

interface ChartsProps {
  statss: Statistics[] | null;
}

export default function Charts({ statss }: ChartsProps) {
  if (!statss || statss.length === 0) return <p>Loading chart...</p>;

  const data = statss.map((stats) => ({
    name: new Date().toLocaleTimeString(),
    storage: Math.max(0, stats.storage),
    cpu: Math.max(0, stats.cpu),
    ram: Math.max(0, stats.ram),
    diskIO: Math.max(0, stats.diskIO),
    battery: Math.max(0, stats.battery),
  }));

  return (
    <div className="charts">
      <div className="chart-container">
        <h2 className="chart-title">RAM Usage (%)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
            <YAxis tick={{ fontSize: 12, fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="ram"
              stroke="#ff7300"
              fill="#ff7300"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CPU Usage Chart */}
      <div className="chart-container">
        <h2 className="chart-title">CPU Usage (%)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
            <YAxis tick={{ fontSize: 12, fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* RAM Usage Chart */}

      {/* Disk I/O Chart */}
      <div className="chart-container">
        <h2 className="chart-title">Disk I/O (MB/s)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
            <YAxis tick={{ fontSize: 12, fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="diskIO"
              stroke="#4caf50"
              fill="#4caf50"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
