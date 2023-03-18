import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
} from 'chart.js'

export default function PolarChart() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        RadialLinearScale,
        ArcElement,
        Title,
        Tooltip,
        Legend
    )


    const data = {
        labels: ['Coding', 'Gaming', 'Circuits and Robotics', 'Business and Management', 'Brainstorming', 'Misc'],
        datasets: [
            {
                data: [0, 0, 1, 3, 1, 1],
                backgroundColor: [
                    '#29b6f6',
                    '#00e676',
                    '#ffee58',
                    '#1a237e',
                    '#e91e63',
                    '#ab47bc',
                    '#ff5722'
                ],
                borderColor: [
                    '#29b6f6',
                    '#00e676',
                    '#ffee58',
                    '#1a237e',
                    '#e91e63',
                    '#ab47bc'
                ],
                label: 'Srijan 23 Events',
            },
        ]
    }

    const options = {
        
        plugins:{
            responsive:false,
            maintainAspectRatio:false,
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontSize: 10,
                    color: 'white',
                    fontFamily: 'Jura'
                },
            },
        },
        maintainAspectRatio: false,
    }


  return (
    <>
      <Doughnut data={data} options={options}/>
    </>
  );
}
