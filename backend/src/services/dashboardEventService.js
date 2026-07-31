const clients = new Set();

// =====================================================
// ADD DASHBOARD CLIENT
// =====================================================

const addClient = (res) => {
    clients.add(res);

    console.log(
        `Dashboard SSE client connected. Total clients: ${clients.size}`,
    );
};

// =====================================================
// REMOVE DASHBOARD CLIENT
// =====================================================

const removeClient = (res) => {
    clients.delete(res);

    console.log(
        `Dashboard SSE client disconnected. Total clients: ${clients.size}`,
    );
};

// =====================================================
// NOTIFY ALL DASHBOARD CLIENTS
// =====================================================

const notifyDashboardRefresh = (data = {}) => {
    console.log(
        `Sending dashboard refresh event to ${clients.size} client(s)`,
    );

    const message = `event: reconciliationCompleted\ndata: ${JSON.stringify(
        data,
    )}\n\n`;

    for (const client of clients) {
        try {
            client.write(message);
        } catch (error) {
            console.error(
                "Failed to send dashboard event:",
                error.message,
            );

            clients.delete(client);
        }
    }
};

// =====================================================
// KEEP SSE CONNECTION ALIVE
// =====================================================

const heartbeat = () => {
    for (const client of clients) {
        try {
            client.write(
                `event: heartbeat\ndata: ${JSON.stringify({
                    timestamp: new Date(),
                })}\n\n`,
            );
        } catch (error) {
            clients.delete(client);
        }
    }
};

setInterval(heartbeat, 30000);

module.exports = {
    addClient,
    removeClient,
    notifyDashboardRefresh,
};