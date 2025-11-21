'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FaChartLine, FaChartBar } from 'react-icons/fa';

interface Click {
    clickedAt: string;
}

interface StatsChartProps {
    clicks: Click[];
}

export default function StatsChart({ clicks }: StatsChartProps) {
    // Process clicks data for charts
    const getLast7DaysData = () => {
        const days = 7;
        const data = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayClicks = clicks.filter(click => {
                const clickDate = new Date(click.clickedAt);
                return clickDate >= date && clickDate < nextDate;
            });

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                clicks: dayClicks.length,
            });
        }

        return data;
    };

    const getHourlyData = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const data = hours.map(hour => {
            const hourClicks = clicks.filter(click => {
                const clickDate = new Date(click.clickedAt);
                return clickDate.getHours() === hour;
            });

            return {
                hour: `${hour}:00`,
                clicks: hourClicks.length,
            };
        });

        return data.filter(d => d.clicks > 0); // Only show hours with clicks
    };

    const dailyData = getLast7DaysData();
    const hourlyData = getHourlyData();

    return (
        <div className="space-y-6">
            {/* Daily Trend Chart */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <FaChartLine className="text-primary-600 text-xl" />
                    <h3 className="text-lg font-semibold">Click Trend (Last 7 Days)</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '8px 12px',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="clicks"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ fill: '#0ea5e9', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Hourly Distribution Chart */}
            {hourlyData.length > 0 && (
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <FaChartBar className="text-accent-600 text-xl" />
                        <h3 className="text-lg font-semibold">Clicks by Hour</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={hourlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="hour"
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="clicks"
                                fill="#d946ef"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
