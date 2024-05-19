import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from "recharts";

const data = [
    {
        subject: "SMS PUSH",
        A: 120,
        B: 110,
        fullMark: 150
    },
    {
        subject: "AMEN NET",
        A: 98,
        B: 130,
        fullMark: 150
    },
    {
        subject: "SMS INTERACTIF",
        A: 86,
        B: 130,
        fullMark: 150
    },
    {
        subject: "AMEN MAIL",
        A: 99,
        B: 100,
        fullMark: 150
    },
    {
        subject: "Amen Mobile",
        A: 50,
        B: 40,
        fullMark: 70
    },
    {
        subject: "Amen Pay",
        A: 40,
        B: 85,
        fullMark: 80
    }
];

export default function SimpleRadarChart() {
    return (
        <RadarChart
            cx={250}
            cy={200}
            outerRadius={110}
            width={400}
            height={400}
            data={data}
        >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
                name="Mike"
                dataKey="A"
                stroke="#1d7723"
                fill="#093d90"
                fillOpacity={0.6}
            />
        </RadarChart>
    );
}
