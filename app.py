
import requests
from bs4 import BeautifulSoup
import time
import webbrowser

def find_price(URL):
    r = requests.get(URL, headers={"User-Agent": "Defined"})
    soup = BeautifulSoup(r.content, "html.parser")
    try:
        if 'amazon.in' in URL:
            price_symbol = soup.find(class_="a-price-symbol")
            price_whole = soup.find(class_="a-price-whole")
            price_fraction = soup.find(class_="a-price-fraction")
            if price_symbol and price_whole and price_fraction:
                price = f"{price_symbol.get_text().strip()}{price_whole.get_text().strip()}{price_fraction.get_text().strip()}"
                return price
        elif 'amazon.com' in URL:
            price_container = soup.find('span', {'class': 'a-price'})
            if price_container:
                price = price_container.find('span', class_='a-offscreen')
                if price:
                    return price.get_text().strip()
        elif 'flipkart' in URL:
            price = soup.find(class_='Nx9bqj CxhGGd')
            if price:
                return price.get_text().strip()
        elif 'meesho' in URL:
            price = soup.find(class_ = "biMVPh")
            if price:
                return price.get_text().strip()
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

i = 1
URL = input("Enter the URL: ")
while True:
    price = find_price(URL)
    if price is None:
        print("Invalid link")
        break
    else:
        if i < 2:
            current_price = price
        previous_price = current_price
        
        print(f"Your current price is: {price}")
        
        if i > 2:
            current_price = price
            if current_price != previous_price:
                webbrowser.open_new(URL)

        time.sleep(10)
        i += 1
