import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { calculateRealTimeHours, formatHours } from "../utils/fn";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminStatsChart = ({ records, viewMode }) => {
    const now = new Date();
    let delayed = false;

    const dataByEmployee = {};

    records.forEach(rec => {
        const name = rec.employee?.name || "Unknown";

        let hours = parseFloat(rec.workHours);

        // If today mode and no workHours, calculate real time
        if (viewMode === "today" && (isNaN(hours) || !hours)) {
            hours = calculateRealTimeHours(rec.checkInTime, now);
        }

        if (!dataByEmployee[name]) dataByEmployee[name] = 0;
        dataByEmployee[name] += isNaN(hours) ? 0 : hours;
    });

    const labels = Object.entries(dataByEmployee).map(([name, hrs]) =>
        `${name} (${formatHours(hrs)})`
    );

    const data = Object.values(dataByEmployee);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Work Hours",
                data,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderWidth: 2,
                borderRadius: 5,

            },
        ],
    };

    const options = {
        indexAxis: 'y', 
        scales: {
            y: {
                beginAtZero: true,
                max: viewMode === "today" ? 24 : undefined,
                title: {
                    display: true,
                    text: "Employees",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Hours",
                },
            },
        },
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
            },
        },

    };

    return (
        <Bar data={chartData} options={options} />
    );
};

export default AdminStatsChart;
