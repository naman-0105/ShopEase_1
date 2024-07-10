function addButton() {
    const productImageContainer = document.querySelector("div.imgTagWrapper");
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
      const productImage = document.getElementById("landingImage").src;
      const productName = document.getElementById("productTitle").innerText;
      const productPrice = document.querySelector(".a-price .a-offscreen").innerText;
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