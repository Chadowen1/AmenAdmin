import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from "recharts";

const HorizontalBarChart = ({ data }) => {
    return (
        <BarChart
            width={500}
            height={340}
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 25, left: 40 , bottom: 5 }}
        >
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="segment" fontSize={'0.7rem'} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="2024" fill="#8884d8" />
            {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
    );
};

export default HorizontalBarChart;