"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface PriceChartProps {
    data: {
        price: number;
        checkDate: string;
    }[];
}

export default function PriceChart({ data }: PriceChartProps) {
    const chartData = [...data]
        .sort(
            (a, b) =>
                new Date(a.checkDate).getTime() -
                new Date(b.checkDate).getTime()
        )
        .map((item) => ({
            date: new Date(item.checkDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            price: item.price,
        }));

    if (chartData.length === 0) {
        return null;
    }

    return (
        <div className="w-full h-64 bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-800 overflow-hidden relative">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickMargin={10}
                        type="category"
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(value) => `R$${value}`}
                        width={80}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #1e293b",
                            borderRadius: "6px",
                            fontSize: "12px",
                        }}
                        itemStyle={{ color: "#34d399" }}
                        labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                        formatter={(value: number) => [
                            `R$ ${value.toFixed(2)}`,
                            "Preço",
                        ]}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#34d399"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                            r: 6,
                            fill: "#34d399",
                            stroke: "#0f172a",
                            strokeWidth: 2,
                        }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
