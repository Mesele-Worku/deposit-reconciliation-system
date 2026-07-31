const dashboardEventService = require("../services/dashboardEventService");

const subscribe = (req, res) => {
    console.log("Dashboard client connected");

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Important for CORS/proxies
    res.setHeader("X-Accel-Buffering", "no");

    // Send initial connection message
    res.write(
        `event: connected\ndata: ${JSON.stringify({
            message: "Dashboard event connection established",
        })}\n\n`,
    );

    // Register client
    dashboardEventService.addClient(res);

    // Remove client when browser disconnects
    req.on("close", () => {
        console.log("Dashboard client disconnected");

        dashboardEventService.removeClient(res);
    });
};

module.exports = {
    subscribe,
};