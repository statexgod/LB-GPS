const socket = new WebSocket('ws://localhost:4001');

socket.onopen = () => {
    console.log('Підключено до WebSocket сервера');
};

let satellites = [];
const distances = [];
const satelliteSpeed = 100;

socket.onmessage = (event) => {
    console.log('Отримані дані:', event.data);
    const data = JSON.parse(event.data);

    const transmissionTime = (data.receivedAt - data.sentAt) / 1000;
    const distanceToSatellite = (satelliteSpeed / 3600) * transmissionTime;

    satellites.push({ x: data.x, y: data.y });
    distances.push(distanceToSatellite);

    if (satellites.length === 3) {
        const objectPosition = trilaterate(satellites, distances);
        updateGraph(objectPosition, satellites);
        satellites.length = 0;
        distances.length = 0;
    }
};

socket.onerror = (error) => {
    console.error('Помилка WebSocket:', error);
};

function trilaterate(satellites, distances) {
    const [sat1, sat2, sat3] = satellites;
    const [d1, d2, d3] = distances;

    const A = 2 * sat2.x - 2 * sat1.x;
    const B = 2 * sat2.y - 2 * sat1.y;
    const C = d1 * d1 - d2 * d2 - sat1.x * sat1.x + sat2.x * sat2.x - sat1.y * sat1.y + sat2.y * sat2.y;
    const D = 2 * sat3.x - 2 * sat2.x;
    const E = 2 * sat3.y - 2 * sat2.y;
    const F = d2 * d2 - d3 * d3 - sat2.x * sat2.x + sat3.x * sat3.x - sat2.y * sat2.y + sat3.y * sat3.y;

    const x = (C - (B / A) * (D * F / E)) / (B - (B / A) * D);
    const y = (C - A * x) / B;

    return { x, y };
}

function updateGraph(objectPosition, satellites) {
    const traceObject = {
        x: [objectPosition.x],
        y: [objectPosition.y],
        mode: 'markers',
        type: 'scatter',
        name: 'Object',
        marker: { size: 10, color: 'blue' }
    };

    const traceSatellite = {
        x: satellites.map(sat => sat.x),
        y: satellites.map(sat => sat.y),
        mode: 'markers',
        type: 'scatter',
        name: 'Satellite',
        marker: { size: 10, color: 'red' }
    };

    const data = [traceObject, traceSatellite];

    const layout = {
        xaxis: {
            title: 'X',
            range: [-200, 200]
        },
        yaxis: {
            title: 'Y',
            range: [-200, 200]
        }
    };

    Plotly.newPlot('graph', data, layout);
}

function updateGPSConfig() {
    const satelliteSpeed = document.getElementById('satelliteSpeed').value;
    const objectSpeed  = document.getElementById('objectSpeed').value;

    const configData = {
        satelliteSpeed: parseInt(satelliteSpeed) || 100,
        objectSpeed: parseInt(objectSpeed) || 10
    };

fetch('http://localhost:4001/config', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(configData)
})
.then(response => response.json())
.then(data => console.log('Конфігурація оновлена:', data))
    .catch(error => console.error('Помилка при оновленні конфігурації:', error));
}