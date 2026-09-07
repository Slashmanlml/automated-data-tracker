const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'cotizaciones.json');

async function obtenerCotizaciones() {
    console.log('📡 Consultando APIs financieras en tiempo real...');
    
    try {
        // Consultamos la API pública de CoinGecko para Bitcoin y Ethereum
        const responseCrypto = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const dataCrypto = await responseCrypto.json();

        const registro = {
            fecha: new Date().toISOString(),
            bitcoin_usd: dataCrypto.bitcoin?.usd || 0,
            ethereum_usd: dataCrypto.ethereum?.usd || 0,
            estado: 'OK'
        };

        console.log('📊 Datos obtenidos con éxito:', registro);

        // Leer historial existente o crear nuevo
        let historial = [];
        if (fs.existsSync(DATA_FILE)) {
            const contenido = fs.readFileSync(DATA_FILE, 'utf-8');
            try {
                historial = JSON.parse(contenido);
            } catch (e) {
                historial = [];
            }
        }

        // Mantener los últimos 50 registros
        historial.unshift(registro);
        if (historial.length > 50) {
            historial = historial.slice(0, 50);
        }

        // Guardar archivo formateado
        fs.writeFileSync(DATA_FILE, JSON.stringify(historial, null, 2), 'utf-8');
        console.log(`💾 Historial actualizado en: ${DATA_FILE}`);

    } catch (error) {
        console.error('❌ Error al obtener cotizaciones:', error.message);
        process.exit(1);
    }
}

obtenerCotizaciones();
