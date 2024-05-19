import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from "recharts";

const data = [
    {
        subject: "Professionnel",
        A: 100,
        B: 110,
        fullMark: 150
    },
    {
        subject: "Retraité",
        A: 120,
        B: 130,
        fullMark: 150
    },
    {
        subject: "Salarié",
        A: 86,
        B: 130,
        fullMark: 150
    },
    {
        subject: "Etudiant",
        A: 30,
        B: 40,
        fullMark: 150
    },
    {
        subject: "Elève",
        A: 30,
        B: 25,
        fullMark: 150
    },
    {
        subject: "Profession Libérale",
        A: 65,
        B: 85,
        fullMark: 150
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
                stroke="#093d90"
                fill="#1d7723"
                fillOpacity={0.6}
            />
        </RadarChart>
    );
}
