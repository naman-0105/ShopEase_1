from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
import time
import threading
from datetime import datetime
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  
price_data = []

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
            price = soup.find(class_="biMVPh")
            if price:
                return price.get_text().strip()
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def track_price(URL):
    global price_data
    while True:
        price = find_price(URL)
        if price is not None:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            price_data.append({'url': URL, 'price': price, 'timestamp': timestamp}) 
            time.sleep(10)
        else:
            break

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        URL = request.form['url']
    
        tracking_thread = threading.Thread(target=track_price, args=(URL,))
        tracking_thread.start()
        return jsonify({'status': 'success'})

@app.route('/get_price', methods=['GET'])
def get_price():
    url = request.args.get('url')
    if url:
        for item in price_data[::-1]:  
            if item.get('url') == url:
                return jsonify({'price': item['price']})
    return jsonify({'price': None})

@app.route('/get_price_history', methods=['GET'])
def get_price_history():
    return jsonify({'price_data': price_data})

if __name__ == '__main__':
    app.run(port=5501, debug=True)

