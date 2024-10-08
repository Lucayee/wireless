let bluetoothDevice;
let bluetoothCharacteristic;

// Pulsante di connessione al Bluetooth
document.getElementById('connectBtn').addEventListener('click', async () => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['00001101-0000-1000-8000-00805f9b34fb'] }]
        });

        bluetoothDevice = device;
        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
        bluetoothCharacteristic = await service.getCharacteristic('00001101-0000-1000-8000-00805f9b34fb');
        alert('Bluetooth connesso!');

    } catch (error) {
        console.error('Errore di connessione: ', error);
    }
});

// Rilevamento movimento del trackpad
const trackpad = document.getElementById('trackpad');
trackpad.addEventListener('mousemove', (event) => {
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    // Invia le coordinate del movimento tramite Bluetooth
    sendData(`MOVE:${deltaX},${deltaY}`);
});

// Gestione input tastiera
const keyboardInput = document.getElementById('keyboardInput');
keyboardInput.addEventListener('input', () => {
    const text = keyboardInput.value;
    sendData(`TEXT:${text}`);
});

// Funzione per inviare dati tramite Bluetooth
function sendData(message) {
    if (bluetoothCharacteristic) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        bluetoothCharacteristic.writeValue(data)
            .then(() => console.log('Dati inviati:', message))
            .catch(err => console.error('Errore invio dati: ', err));
    }
}
