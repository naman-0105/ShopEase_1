function addButton() {
  const productNameContainer = document.querySelector("span.sc-eDvSVe.fhfLdV");
  if (!productNameContainer) {
      console.error("Product name container not found");
      return;
  }

  if (document.querySelector(".add-to-hushh-button")) {
      return;
  }

  const addButton = document.createElement("button");
  addButton.innerText = "Add to ShopEase";
  addButton.className = "add-to-hushh-button";
  addButton.style.position = "absolute";
  addButton.style.top = "0px"; 
  addButton.style.left = "-150px"; 
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
      const productImageElement = document.querySelector(".ProductCard__ProductImage-sc-camkhj-4.GpHlc");
      const productImage = productImageElement ? productImageElement.src : null;
      const productName = document.querySelector("span.sc-eDvSVe.fhfLdV").innerText;
      const productPrice = document.querySelector("h4.sc-eDvSVe.biMVPh").innerText;
      const productUrl = window.location.href;
      const productSource = "Meesho";

      if (!productImage) {
          alert("Product image not found");
          return;
      }

      const product = {
          image: productImage,
          name: productName,
          price: productPrice,
          url: productUrl,
          source: productSource
      };

      chrome.runtime.sendMessage({ action: "saveProduct", product }, (response) => {
          if (response.status === "success") {
              alert("Product added to Hushh!");
          }
      });
  });
}

function observeDOM() {
  const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
              const productNameContainer = document.querySelector("span.sc-eDvSVe.fhfLdV");
              if (productNameContainer && !document.querySelector(".add-to-hushh-button")) {
                  addButton();
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
