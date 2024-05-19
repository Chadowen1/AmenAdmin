import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from "recharts";

const HorizontalBarChart = ({ data, year }) => {
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
            <CartesianGrid strokeDasharray="3 3" fill='white'/>
            <Tooltip />
            <Legend />
            <Bar dataKey="2024" fill="#1d7723" barSize={12} radius={[0, 10, 10, 0]}/>
            <Bar dataKey="2023" fill="#093d90" barSize={12} radius={[0, 10, 10, 0]}/>
        </BarChart>
    );
};

export default HorizontalBarChart;