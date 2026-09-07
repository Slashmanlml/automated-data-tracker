const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'cotizaciones.json');

async function enviarNotificacionTelegram(registro) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.log('⚠️ Variables de Telegram no configuradas, saltando notificación.');
        return;
    }

    const mensaje = `🤖 *Reporte Automático de Cotizaciones*\n\n` +
                    `🪙 *Bitcoin:* \$${registro.bitcoin_usd.toLocaleString()} USD\n` +
                    `🔷 *Ethereum:* \$${registro.ethereum_usd.toLocaleString()} USD\n\n` +
                    `⏰ *Fecha:* ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}\n` +
                    `🚀 _Notificación enviada desde GitHub Actions_`;

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: mensaje,
                parse_mode: 'Markdown'
            })
        });

        const data = await res.json();
        if (data.ok) {
            console.log('📱 Notificación de Telegram enviada con éxito!');
        } else {
            console.error('❌ Error en respuesta de Telegram:', data);
        }
    } catch (e) {
        console.error('❌ Error de red al enviar a Telegram:', e.message);
    }
}

async function obtenerCotizaciones() {
    console.log('📡 Consultando APIs financieras en tiempo real...');
    
    try {
        const responseCrypto = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const dataCrypto = await responseCrypto.json();

        const registro = {
            fecha: new Date().toISOString(),
            bitcoin_usd: dataCrypto.bitcoin?.usd || 0,
            ethereum_usd: dataCrypto.ethereum?.usd || 0,
            estado: 'OK'
        };

        console.log('📊 Datos obtenidos con éxito:', registro);

        let historial = [];
        if (fs.existsSync(DATA_FILE)) {
            const contenido = fs.readFileSync(DATA_FILE, 'utf-8');
            try {
                historial = JSON.parse(contenido);
            } catch (e) {
                historial = [];
            }
        }

        historial.unshift(registro);
        if (historial.length > 50) {
            historial = historial.slice(0, 50);
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(historial, null, 2), 'utf-8');
        console.log(`💾 Historial actualizado en: ${DATA_FILE}`);

        // Enviar alerta a Telegram
        await enviarNotificacionTelegram(registro);

    } catch (error) {
        console.error('❌ Error al obtener cotizaciones:', error.message);
        process.exit(1);
    }
}

obtenerCotizaciones();
