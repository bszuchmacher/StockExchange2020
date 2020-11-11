class Company {
  constructor(element, symbols) {
    this.divForPage = element;
    this.symbols = symbols.split(",");
  }

  loadCompanyInfo() {
    this.symbols.map(async (companySymbol) => {
      let divForCompany = this.createDivForCompanyInfo();
      let header = this.createHeader(divForCompany);
      let companyProfile = await this.getCompanyProfile(companySymbol);
      this.setHeaderInfo(header, companyProfile);
      let divForMainContent = this.createDivForInfoBelowHeader(divForCompany);
      this.setStockPrice(divForMainContent, companyProfile);
      this.setDescription(divForMainContent, companyProfile);
      let stockHistoryOfCompany = await this.getStockPriceHistory(
        companySymbol
      );
      this.createGraph(divForMainContent, stockHistoryOfCompany);
    });
  }

  createDivForCompanyInfo() {
    if (this.symbols.length > 1) {
      let companyNumber = document.createElement("h1");
      if (this.divForPage.childElementCount === 0) {
        companyNumber.textContent = "Company 1:";
      } else if (this.divForPage.childElementCount === 1) {
        companyNumber.textContent = "Company 3:";
      } else {
        companyNumber.textContent = "Company 2:";
      }
      this.divForPage.append(companyNumber);
    }
    let divContainingCompanyInfo = document.createElement("div");
    divContainingCompanyInfo.classList.add("main");
    this.divForPage.append(divContainingCompanyInfo);
    return divContainingCompanyInfo;
  }

  async getCompanyProfile(symbol) {
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/company/profile/${symbol}?apikey=${apiKey}`
    );
    let companyInfo = await response.json();
    return companyInfo;
  }

  createHeader(divForCompany) {
    let header = document.createElement("div");
    header.classList.add("header");
    divForCompany.prepend(header);
    return header;
  }

  setHeaderInfo(header, companyInfo) {
    let { image, companyName, industry, website } = companyInfo.profile;
    let row = document.createElement("div");
    row.classList.add("row");
    let firstColumn = document.createElement("div");
    firstColumn.classList.add("col-3");
    let secondColumn = document.createElement("div");
    secondColumn.classList.add("col-6");
    let thirdColumn = document.createElement("div");
    thirdColumn.classList.add("col-3");
    let logo = document.createElement("img");
    logo.classList.add("company-logo");
    logo.src = image;
    let name = document.createElement("h1");
    name.classList.add("company-name");
    name.textContent = companyName;
    let industryPar = document.createElement("p");
    industryPar.textContent = `(${industry})`;
    let websiteLink = document.createElement("a");
    websiteLink.classList.add("website");
    websiteLink.textContent = website;
    websiteLink.href = website;
    websiteLink.target = "_blank";
    header.append(row);
    row.append(firstColumn, secondColumn, thirdColumn);
    firstColumn.append(logo);
    secondColumn.append(name);
    thirdColumn.append(industry);
    header.append(website);
  }

  createDivForInfoBelowHeader(divForCompany) {
    let divForMainCompanyInfo = document.createElement("div");
    divForMainCompanyInfo.classList.add("main-content");
    divForCompany.append(divForMainCompanyInfo);
    return divForMainCompanyInfo;
  }

  setStockPrice(divForMainContent, companyInfo) {
    let { price, changesPercentage } = companyInfo.profile;
    let companyStockContainer = document.createElement("div");
    companyStockContainer.classList.add("stock-info");
    let priceHeader = document.createElement("h3");
    priceHeader.classList.add("stock-price");
    priceHeader.textContent = `Stock Price: $${price}`;
    let stockUpOrDown = document.createElement("span");
    stockUpOrDown.textContent = `${changesPercentage}`;
    if (changesPercentage.includes("+") === true) {
      stockUpOrDown.classList.add("stock-up");
    } else {
      stockUpOrDown.classList.add("stock-down");
    }
    companyStockContainer.append(priceHeader, stockUpOrDown);
    divForMainContent.append(companyStockContainer);
  }

  setDescription(divForMainContent, companyInfo) {
    let { description } = companyInfo.profile;
    let descriptionPar = document.createElement("p");
    descriptionPar.classList.add("description");
    descriptionPar.textContent = description;
    divForMainContent.append(descriptionPar);
  }

  async getStockPriceHistory(companySymbol) {
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${companySymbol}?serietype=line&apikey=${apiKey}`
    );
    let stockHistory = await response.json();
    stockHistory.historical = stockHistory.historical.reverse();
    return stockHistory;
  }

  createGraph(divForMainContent, stockHistory) {
    let ctx = document.createElement("canvas");
    ctx.classList.add("chart");
    divForMainContent.append(ctx);
    let chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Stock Price History",
            backgroundColor: "rgb(72, 179, 212)",
            borderColor: "rgb(72, 179, 212)",
            data: [],
          },
        ],
      },
      options: {},
    });
    let year = 2005;
    let startDateOfStock = stockHistory.historical[0].date.slice(0, 4);
    console.log(startDateOfStock);
    if (startDateOfStock > year.toString()) {
      year = parseInt(startDateOfStock);
    }
    for (let i = 0; i < stockHistory.historical.length; i++) {
      if (stockHistory.historical[i].date.slice(0, 4) === year.toString()) {
        chart.data.labels.push(year);
        chart.data.datasets[0].data.push(stockHistory.historical[i].close);
        console.log(chart.data.datasets[0].data);
        console.log(chart.data.labels);
        year += 1;
      }
    }
    chart.update();
  }
}
