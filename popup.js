document.addEventListener("DOMContentLoaded", function() {
    const productsContainer = document.getElementById("products");
    const categoryButtonsContainer = document.getElementById("categoryButtons");
    


    function showHome(category = "All") {
        resetActiveButtons();
        if (category === "All") {
            resetActiveCatButtons();
            document.getElementById("allBtn").classList.add("active");
        } else if (category === "Amazon") {
            resetActiveCatButtons();
            document.getElementById("amazonBtn").classList.add("active");
        } else if (category === "Flipkart") {
            resetActiveCatButtons();
            document.getElementById("flipkartBtn").classList.add("active");
        } else if (category === "Myntra") {
            resetActiveCatButtons();
            document.getElementById("myntraBtn").classList.add("active");
        } else if (category === "Meesho") {
            resetActiveCatButtons();
            document.getElementById("meeshoBtn").classList.add("active");
        }
        function resetActiveCatButtons() {
            document.querySelectorAll("#categoryButtons button").forEach(button => button.classList.remove("active"));
        }

        document.getElementById("homeBtn").classList.add("active");
        document.getElementById("downloadBtn").style.display = "block";
        document.getElementById("amazonBtn").addEventListener("click", () => {
            document.getElementById("downloadBtn").style.display = "none";
        });
        document.getElementById("flipkartBtn").addEventListener("click", () => {
            document.getElementById("downloadBtn").style.display = "none";
        });
        document.getElementById("myntraBtn").addEventListener("click", () => {
            document.getElementById("downloadBtn").style.display = "none";
        });
        document.getElementById("meeshoBtn").addEventListener("click", () => {
            document.getElementById("downloadBtn").style.display = "none";
        });

        categoryButtonsContainer.style.display = 'block';

        productsContainer.style.display = 'block';
    
        productsContainer.innerHTML = '';
    

        chrome.storage.local.get({ products: [] }, (result) => {
            const products = result.products;

            const filteredProducts = category === "All" ? products : products.filter(product => {
                const url = new URL(product.url);
                return url.hostname.includes(category.toLowerCase());
            });

            if (filteredProducts.length === 0) {
                productsContainer.innerHTML = '<img src="/No-items.gif" style="width:300px; margin-left:130px">';
            } 
            else{
            filteredProducts.forEach(product => {
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

                const buttonContainer = document.createElement("div");
                buttonContainer.className = "product-buttons";

                const removeButton = document.createElement("button");
                removeButton.innerText = "Remove";
                removeButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    removeProduct(product);
                });
                buttonContainer.appendChild(removeButton);


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
        }
        });
    }
    

    function resetActiveButtons() {
        document.querySelectorAll("#navbar button").forEach(button => button.classList.remove("active"));
    }

    function showWishlist() {
        resetActiveButtons();

    document.getElementById("wishlistBtn").classList.add("active");
    document.getElementById("downloadBtn").style.display = "none";

        productsContainer.style.display = 'block';
        productsContainer.innerHTML = '';

        chrome.storage.local.get({ wishlist: [] }, (result) => {
            const wishlist = result.wishlist;

            if (wishlist.length === 0) {
                productsContainer.innerHTML = '<img src="/No-items.gif" style="width:300px; margin-left:130px; margin-top:50px">';
            }
            else{
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
        }
        });
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


    function wishlistProduct(product) {
        chrome.storage.local.get({ wishlist: [] }, (result) => {
            const wishlist = result.wishlist;
            wishlist.push(product);
            chrome.storage.local.set({ wishlist }, () => {
                alert("Product added to Wishlist!");
            });
        });
    }

    function downloadProducts(products) {
        let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Product List</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                .product {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    padding: 10px;
                }
                .product img {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }
                .product .info {
                    display: flex;
                    flex-direction: column;
                }
                .product .info div {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>ShopEase Product List</h1>
            <div id="products">
        `;
    
        products.forEach(product => {
            htmlContent += `
            <div class="product">
                <a href="${product.url}" target="_blank"><img src="${product.image}" alt="Product Image"></a>
                <div class="info">
                    <div><a href="${product.url}" target="_blank">${product.name}</a></div>
                    <br>
                    <div><span> Price- </span>${product.price}</div>
                </div>
                <br>
            </div>
            `;
        });
    
        htmlContent += `
            </div>
        </body>
        </html>
        `;
    
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.html';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    document.getElementById("downloadBtn").addEventListener("click", () => {
        chrome.storage.local.get({ products: [] }, (result) => {
            downloadProducts(result.products);
        });
    });

    document.getElementById("allBtn").addEventListener("click", () => {
        document.getElementById("downloadBtn").style.display = "block";
    });

   


    document.getElementById("homeBtn").addEventListener("click", () => showHome("All"));
    document.getElementById("allBtn").addEventListener("click", () => showHome("All"));
    document.getElementById("amazonBtn").addEventListener("click", () => showHome("Amazon"));
    document.getElementById("flipkartBtn").addEventListener("click", () => showHome("Flipkart"));
    document.getElementById("myntraBtn").addEventListener("click", () => showHome("Myntra"));
    document.getElementById("meeshoBtn").addEventListener("click", () => showHome("Meesho"));
    document.getElementById("wishlistBtn").addEventListener("click", () => {
        categoryButtonsContainer.style.display = 'none';
        showWishlist();
    });
  

    // Default view
    showHome();
});

