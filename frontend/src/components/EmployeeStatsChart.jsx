import { Bar } from "react-chartjs-2";
import { formatHours } from "../utils/fn";

const EmployeeStatsChart = ({ records }) => {
    const labels = records.map(r => r.date.slice(-2));
    const data = records.map(r => {
        if (r.workHours) return r.workHours;
        if (!r.checkInTime) {
            return 0;
        }
        if (!r.checkOutTime) {
            const [h1, m1, s1] = r.checkInTime.split(":").map(Number);
            const t1 = h1 * 3600 + m1 * 60 + s1;
            const now = new Date();
            const t2 = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            return ((t2 - t1) / 3600).toFixed(2);
        }
        return 0;
    });

    const chartData = {
        labels,
        datasets: [{
            label: "Work Hours",
            data,
            backgroundColor: "rgba(235, 54, 181, 0.5)",
            borderColor: "rgba(235, 54, 181, 1)",
            borderWidth: 1
        }]
    };

    const options = {
        indexAxis: 'x',
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${formatHours(ctx.raw)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 15,
                title: {
                    display: true,
                    text: "Hours",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Days Of Month",
                },
            }
        },
        animation: {
            duration: 1000,
            delay: (context) => context.dataIndex * 100
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default EmployeeStatsChart;
