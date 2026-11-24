
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const AdminChart = ({
  data = [],
  period = 'Last 6 Months',
  onPeriodChange = () => {}
}) => {

  // Calculate dynamic Y-axis based on actual data
  const maxValue = Math.max(
    0,
    ...data.map((item) =>
      Math.max(
        Number(item.reports) || 0,
        Number(item.claims) || 0
      )
    )
  );

  // Keep the chart readable even with small numbers
  const yAxisMax = Math.max(
    4,
    Math.ceil(maxValue * 1.2)
  );

  const tickStep = Math.max(
    1,
    Math.ceil(yAxisMax / 4)
  );

  const axisMaximum = tickStep * 4;

  const yAxisTicks = Array.from(
    { length: 5 },
    (_, i) => i * tickStep
  );

  return (
    <div className="custom-card h-100">
      <div className="card-header-clean">
        <h3 className="card-title-clean">
          <BarChart2 size={20} color="#1B5CE2" />
          Reports &amp; Claims Overview
        </h3>

        <div>
          <select
            className="form-select form-select-sm"
            style={{
              fontSize: '0.82rem',
              borderRadius: '8px',
              border: '1px solid #DCE5EE',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontWeight: '500'
            }}
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="d-flex align-items-center justify-content-center gap-4 mb-2">
        <div
          className="d-flex align-items-center gap-2"
          style={{ fontSize: '0.82rem' }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#1B5CE2'
            }}
          ></span>
          <span className="text-muted fw-semibold">
            Reports
          </span>
        </div>

        <div
          className="d-flex align-items-center gap-2"
          style={{ fontSize: '0.82rem' }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10B981'
            }}
          ></span>
          <span className="text-muted fw-semibold">
            Claims
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 15,
              left: -20,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient
                id="colorReports"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#1B5CE2"
                  stopOpacity={0.12}
                />
                <stop
                  offset="95%"
                  stopColor="#1B5CE2"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="colorClaims"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#10B981"
                  stopOpacity={0.12}
                />
                <stop
                  offset="95%"
                  stopColor="#10B981"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#EDF2F7"
            />

            <XAxis
              dataKey="period"
              stroke="#8C9CAE"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />

            <YAxis
              stroke="#8C9CAE"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, axisMaximum]}
              ticks={yAxisTicks}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0F1E36',
                borderRadius: '8px',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.82rem'
              }}
            />

            <Area
              type="monotone"
              dataKey="reports"
              stroke="#1B5CE2"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorReports)"
              dot={{
                r: 4,
                fill: '#FFFFFF',
                stroke: '#1B5CE2',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: '#1B5CE2'
              }}
            />

            <Area
              type="monotone"
              dataKey="claims"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorClaims)"
              dot={{
                r: 4,
                fill: '#FFFFFF',
                stroke: '#10B981',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: '#10B981'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminChart;
