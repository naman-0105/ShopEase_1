
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveProduct") {
        chrome.storage.local.get({ products: [] }, (result) => {
            const products = result.products;
            products.push(request.product);
            chrome.storage.local.set({ products }, () => {
                sendResponse({ status: "success" });
            });
        });
        return true; 
    }
});


chrome.runtime.onInstalled.addListener(() => {
    console.log("Hushh extension installed.");
});

const trackIntervals = {};

function startRecordingHistory(product) {
    const interval = setInterval(() => {
        chrome.storage.local.get({ trackHistory: {} }, (result) => {
            const trackHistory = result.trackHistory || {};
            const history = trackHistory[product.url] || [];

            
            history.push({
                price: product.price,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString()
            });

            trackHistory[product.url] = history;

            chrome.storage.local.set({ trackHistory });
        });
    }, 10000); 

    trackIntervals[product.url] = interval;
}

function stopRecordingHistory(productUrl) {
    clearInterval(trackIntervals[productUrl]);
    delete trackIntervals[productUrl];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startTracking') {
        startRecordingHistory(request.product);
        sendResponse({ status: 'tracking started' });
    } else if (request.action === 'stopTracking') {
        stopRecordingHistory(request.productUrl);
        sendResponse({ status: 'tracking stopped' });
    }
});
