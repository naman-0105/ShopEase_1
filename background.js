
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

  
