document.addEventListener("DOMContentLoaded", function() {
    const productsContainer = document.getElementById("products");
    const enlargedProductContainer = document.getElementById("enlarged-product");


    function showHome() {
        resetActiveButtons();
        document.getElementById("homeBtn").classList.add("active");

        productsContainer.style.display = 'block';
        enlargedProductContainer.style.display = 'none';
        trendPage.style.display = 'none';
        productsContainer.innerHTML = '';
        enlargedProductContainer.innerHTML = '';

        chrome.storage.local.get({ products: [] }, (result) => {
            const products = result.products;

            products.forEach(product => {
                const productElement = document.createElement("div");
                productElement.className = "product";

                const productImage = document.createElement("img");
                productImage.src = product.image;
                productElement.appendChild(productImage);

                const productInfo = document.createElement("div");
                productInfo.className = "info";
                productElement.appendChild(productInfo);

                const productName = document.createElement("div");
                productName.innerText = product.name;
                productInfo.appendChild(productName);

                const productPrice = document.createElement("div");
                productPrice.innerText = product.price;
                productInfo.appendChild(productPrice);

                // Create buttons
                const buttonContainer = document.createElement("div");
                buttonContainer.className = "product-buttons";

                const removeButton = document.createElement("button");
                removeButton.innerText = "Remove";
                removeButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    removeProduct(product);
                });
                buttonContainer.appendChild(removeButton);

                const trackButton = document.createElement("button");
                trackButton.innerText = "Track";
                trackButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    trackProduct(product);
                });
                buttonContainer.appendChild(trackButton);

                const wishlistButton = document.createElement("button");
                wishlistButton.innerText = "Wishlist";
                wishlistButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    wishlistProduct(product);
                });
                buttonContainer.appendChild(wishlistButton);

                productElement.appendChild(buttonContainer);

                productElement.addEventListener("click", () => {
                    window.open(product.url);
                });

                productsContainer.appendChild(productElement);
            });
        });
    }

    function showWishlist() {
        resetActiveButtons();

    document.getElementById("wishlistBtn").classList.add("active");

        productsContainer.style.display = 'block';
        enlargedProductContainer.style.display = 'none';
        trendPage.style.display = 'none';
        productsContainer.innerHTML = '';
        enlargedProductContainer.innerHTML = '';

        chrome.storage.local.get({ wishlist: [] }, (result) => {
            const wishlist = result.wishlist;

            wishlist.forEach(product => {
                const productElement = document.createElement("div");
                productElement.className = "product";

                const productImage = document.createElement("img");
                productImage.src = product.image;
                productElement.appendChild(productImage);

                const productInfo = document.createElement("div");
                productInfo.className = "info";
                productElement.appendChild(productInfo);

                const productName = document.createElement("div");
                productName.innerText = product.name;
                productInfo.appendChild(productName);

                const productPrice = document.createElement("div");
                productPrice.innerText = product.price;
                productInfo.appendChild(productPrice);

                
                const removeButton = document.createElement("button");
                removeButton.innerText = "Remove";
                removeButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    removeWishlistProduct(product);
                });
                productElement.appendChild(removeButton);

                productElement.addEventListener("click", () => {
                    window.open(product.url);
                });

                productsContainer.appendChild(productElement);
            });
        });
    }

    function showTrack() {
        resetActiveButtons();

    
    document.getElementById("trackBtn").classList.add("active");

        productsContainer.style.display = 'block';
        enlargedProductContainer.style.display = 'none';
        trendPage.style.display = 'none';
        productsContainer.innerHTML = '';
        enlargedProductContainer.innerHTML = '';

        chrome.storage.local.get({ track: [] }, (result) => {
            const track = result.track;

            track.forEach(product => {
                const productElement = document.createElement("div");
                productElement.className = "product";

                const productImage = document.createElement("img");
                productImage.src = product.image;
                productElement.appendChild(productImage);

                const productInfo = document.createElement("div");
                productInfo.className = "info";
                productElement.appendChild(productInfo);

                const productName = document.createElement("div");
                productName.innerText = product.name;
                productInfo.appendChild(productName);

                const productPrice = document.createElement("div");
                productPrice.innerText = product.price;
                productInfo.appendChild(productPrice);

                // Create buttons
                const buttonContainer = document.createElement("div");
                buttonContainer.className = "product-buttons";

                const removeButton = document.createElement("button");
                removeButton.innerText = "Remove";
                removeButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    removeTrackProduct(product);
                });
                buttonContainer.appendChild(removeButton);

                const moreButton = document.createElement("button");
                moreButton.innerText = "More";
                moreButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    showEnlargedProduct(product);
                });
                buttonContainer.appendChild(moreButton);

                productElement.appendChild(buttonContainer);

                productElement.addEventListener("click", () => {
                    window.open(product.url);
                });

                productsContainer.appendChild(productElement);
            });
        });
    }

    function showTrend() {
        resetActiveButtons();


    document.getElementById("trendBtn").classList.add("active");


        productsContainer.style.display = 'none';
        enlargedProductContainer.style.display = 'none';
        trendPage.style.display = 'block';
    }

    function resetActiveButtons() {
      
        const buttons = document.querySelectorAll("#navbar button");
        buttons.forEach(button => {
            button.classList.remove("active");
        });
    }

    function removeProduct(product) {
        chrome.storage.local.get({ products: [] }, (result) => {
            const products = result.products.filter(p => p.url !== product.url);
            chrome.storage.local.set({ products }, () => {
                showHome();
            });
        });
    }

    function removeWishlistProduct(product) {
        chrome.storage.local.get({ wishlist: [] }, (result) => {
            const wishlist = result.wishlist.filter(p => p.url !== product.url);
            chrome.storage.local.set({ wishlist }, () => {
                showWishlist();
            });
        });
    }

    function removeTrackProduct(product) {
        chrome.storage.local.get({ track: [] }, (result) => {
            const track = result.track.filter(p => p.url !== product.url);
            chrome.storage.local.set({ track }, () => {
                showTrack();
            });

            // Stop recording history for this product
            chrome.runtime.sendMessage({ action: 'stopTracking', productUrl: product.url });
        });
    }

    function trackProduct(product) {
        chrome.storage.local.get({ track: [] }, (result) => {
            const track = result.track;
            track.push(product);
            chrome.storage.local.set({ track }, () => {
                alert("Product added to Track!");
            });

            chrome.runtime.sendMessage({ action: 'startTracking', product: product }, (response) => {
                console.log(response.status);
            });
        });
    }

    function wishlistProduct(product) {
        chrome.storage.local.get({ wishlist: [] }, (result) => {
            const wishlist = result.wishlist;
            wishlist.push(product);
            chrome.storage.local.set({ wishlist }, () => {
                alert("Product added to Wishlist!");
            });
        });
    }

    function showEnlargedProduct(product) {
        productsContainer.style.display = 'none';
        enlargedProductContainer.style.display = 'block';

        enlargedProductContainer.innerHTML = '';

        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.addEventListener("click", () => {
            showTrack();
        });
        enlargedProductContainer.appendChild(closeButton);

        const productElement = document.createElement("div");
        productElement.className = "product-enlarged";

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productElement.appendChild(productImage);

        const productInfo = document.createElement("div");
        productInfo.className = "info";

        const productName = document.createElement("div");
        productName.innerText = product.name;
        productInfo.appendChild(productName);

        const productPrice = document.createElement("div");
        productPrice.innerText = product.price;
        productInfo.appendChild(productPrice);

        productElement.appendChild(productInfo);
        enlargedProductContainer.appendChild(productElement);

        const historyButton = document.createElement("button");
        historyButton.innerText = "History";
        historyButton.addEventListener("click", () => {
            showHistoryTable(product.url);
        });
        enlargedProductContainer.appendChild(historyButton);
    }

    function showHistoryTable(productUrl) {
        const table = document.createElement("table");
        table.style.border = "1px solid black";
        table.style.width = "100%";
        table.style.marginTop = "20px";

        const headerRow = document.createElement("tr");
        const priceHeader = document.createElement("th");
        priceHeader.innerText = "Price";
        headerRow.appendChild(priceHeader);
        const timeHeader = document.createElement("th");
        timeHeader.innerText = "Time";
        headerRow.appendChild(timeHeader);
        const dateHeader = document.createElement("th");
        dateHeader.innerText = "Date";
        headerRow.appendChild(dateHeader);
        table.appendChild(headerRow);

        chrome.storage.local.get({ trackHistory: {} }, (result) => {
            const trackHistory = result.trackHistory || {};
            const history = trackHistory[productUrl] || [];

            history.forEach(entry => {
                const newRow = document.createElement("tr");
                const priceCell = document.createElement("td");
                priceCell.innerText = entry.price;
                newRow.appendChild(priceCell);
                const timeCell = document.createElement("td");
                timeCell.innerText = entry.time;
                newRow.appendChild(timeCell);
                const dateCell = document.createElement("td");
                dateCell.innerText = entry.date;
                newRow.appendChild(dateCell);
                table.appendChild(newRow);
            });

            enlargedProductContainer.appendChild(table);

            const closeButton = document.createElement("button");
            closeButton.innerText = "Close History";
            closeButton.addEventListener("click", () => {
                enlargedProductContainer.removeChild(table);
                enlargedProductContainer.removeChild(closeButton);
            });
            enlargedProductContainer.appendChild(closeButton);
        });

        const historyInterval = setInterval(() => {
            chrome.storage.local.get({ trackHistory: {} }, (result) => {
                const trackHistory = result.trackHistory || {};
                const history = trackHistory[productUrl] || [];

                // Clear table and recreate header
                table.innerHTML = '';
                table.appendChild(headerRow);

                history.forEach(entry => {
                    const newRow = document.createElement("tr");
                    const priceCell = document.createElement("td");
                    priceCell.innerText = entry.price;
                    newRow.appendChild(priceCell);
                    const timeCell = document.createElement("td");
                    timeCell.innerText = entry.time;
                    newRow.appendChild(timeCell);
                    const dateCell = document.createElement("td");
                    dateCell.innerText = entry.date;
                    newRow.appendChild(dateCell);
                    table.appendChild(newRow);
                });
            });
        }, 10000); 
        enlargedProductContainer.historyInterval = historyInterval;
    }


    document.getElementById("homeBtn").addEventListener("click", showHome);
    document.getElementById("wishlistBtn").addEventListener("click", showWishlist);
    document.getElementById("trackBtn").addEventListener("click", showTrack);
    document.getElementById("trendBtn").addEventListener("click", showTrend);

    // Default view
    showHome();
});
