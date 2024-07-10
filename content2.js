
function addButton() {
    const productImageContainer = document.querySelector("div._4WELSP._6lpKCl");
    if (!productImageContainer) {
        console.error("Product image container not found");
        return;
    }
  
    const addButton = document.createElement("button");
    addButton.innerText = "Add to Hushh";
    addButton.style.position = "absolute";
    addButton.style.top = "10px";
    addButton.style.right = "10px";
    addButton.style.zIndex = "1000";
    addButton.style.backgroundColor = "#ff6f00";
    addButton.style.color = "#fff";
    addButton.style.border = "none";
    addButton.style.padding = "10px";
    addButton.style.cursor = "pointer";
    
    productImageContainer.style.position = "relative"; 
    productImageContainer.appendChild(addButton);
  
    addButton.addEventListener("click", () => {
        const productImage = document.querySelector("div._4WELSP._6lpKCl img").src;
        const productName = document.querySelector("span.VU-ZEz").innerText;
        const productPrice = document.querySelector("div.Nx9bqj.CxhGGd").innerText;
        const productUrl = window.location.href;
  
        const product = {
            image: productImage,
            name: productName,
            price: productPrice,
            url: productUrl
        };
  
        chrome.runtime.sendMessage({ action: "saveProduct", product }, (response) => {
            if (response.status === "success") {
                alert("Product added to Hushh!");
            }
        });
    });
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    addButton();
  });
  
  window.onload = function() {
    console.log("Window loaded");
    addButton();
  };
  
  console.log("Content script running");
  