class Marquee {
  constructor(element) {
    this.marquee = element;
    this.marqueeContainer = document.createElement("div");
    this.marqueeContainer.classList.add("marquee-container");
  }

  async load() {
    let stockResults = await this.getStockResultsForAllCompanies();
    this.createMarquee(stockResults);
  }

  async getStockResultsForAllCompanies() {
    this.marquee.append(this.marqueeContainer);
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/stock/real-time-price?apikey=${apiKey}`
    );
    let data = await response.json();
    return data;
  }

  createMarquee(stockResults) {
    for (let i = 0; i < 100; i++) {
      let symbol = document.createElement("span");
      symbol.textContent = stockResults.stockList[i].symbol;
      let price = document.createElement("span");
      price.classList.add("stock-up");
      price.textContent = `$${stockResults.stockList[i].price}`;
      let divWithStockAndPrice = document.createElement("div");
      divWithStockAndPrice.classList.add("marquee-item");
      divWithStockAndPrice.append(symbol, price);
      this.marqueeContainer.append(divWithStockAndPrice);
    }
  }
}
