function addButton() {
    const productNameContainer = document.querySelector("div.image-grid-col50");
    if (!productNameContainer) {
        console.error("Product name container not found");
        return;
    }
  
    const addButton = document.createElement("button");
    addButton.innerText = "Add to ShopEase";
    addButton.style.position = "absolute";
    addButton.style.top = "-40px"; 
    addButton.style.right = "0px"; 
    addButton.style.zIndex = "1000";
    addButton.style.backgroundColor = "#ff6f00";
    addButton.style.color = "#fff";
    addButton.style.border = "none";
    addButton.style.padding = "10px";
    addButton.style.cursor = "pointer";
    
    const buttonContainer = document.createElement("div");
    buttonContainer.style.position = "relative";
    buttonContainer.style.display = "inline-block";
    buttonContainer.style.width = "100%";
    buttonContainer.appendChild(addButton);
    
    productNameContainer.parentNode.insertBefore(buttonContainer, productNameContainer);
  
    addButton.addEventListener("click", () => {
      let productImage = document.querySelector("div.image-grid-image").style.backgroundImage;
      productImage = productImage.slice(5, -2); 
      const productName = document.querySelector("h1.pdp-name").innerText;
      const productPrice = document.querySelector("span.pdp-price").innerText;
      const productUrl = window.location.href;
      const productSource = "Myntra";
  
      const product = {
        image: productImage,
        name: productName,
        price: productPrice,
        url: productUrl,
        source: productSource
      };
  
      chrome.runtime.sendMessage({ action: "saveProduct", product }, (response) => {
        if (response.status === "success") {
          alert("Product added to ShopEase!");
        }
      });
    });
  }
  
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const productNameContainer = document.querySelector("h1.pdp-name");
                if (productNameContainer && !document.querySelector("button.add-to-hushh")) {
                    addButton();
                    observer.disconnect();
                }
            }
        });
    });
  
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    observeDOM();
  });
 
  window.onload = function() {
    console.log("Window loaded");
    observeDOM();
  };

  console.log("Content script running");
  
