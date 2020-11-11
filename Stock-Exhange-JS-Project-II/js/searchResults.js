class SearchResults {
  constructor(searchResults, spinner) {
    this.searchResults = searchResults;
    this.spinner = spinner;
    this.symbolsOfCompaniesToCompare = [];
    this.linkForCompaniesToCompare = document.getElementById(
      "openCompanyComparisonPage"
    );
  }

  displaySearchResults(listOfCompanyProfiles, searchQuery) {
    this.searchQuery = searchQuery;
    listOfCompanyProfiles.map((profile) => {
      let { image, companyName, changesPercentage } = profile.profile;
      let companySymbol = profile.symbol;
      let img = this.createHTMLForCompanyImage(image);
      let name = this.createHTMLForCompanyName(companyName, companySymbol);
      let symbol = this.createHTMLForCompanySymbol(companySymbol);
      let changesInStockPrice = this.createHTMLForChangesInStockPrice(
        changesPercentage
      );
      let compareButton = this.createHTMLForCompareButton();
      let companyInfo = this.createHTMLForAllCompanyInfo(
        img,
        name,
        symbol,
        changesInStockPrice
      );
      this.createHTMLForLi();
      this.li.append(companyInfo, compareButton);
      this.searchResults.append(this.li);
      this.highlightTextMatchingQuery(name, symbol);
      this.addCompanyToCompare(profile, compareButton);
    });
    this.hideSpinner();
  }

  createHTMLForCompanyImage(companyImage) {
    let img = document.createElement("img");
    img.src = companyImage;
    img.classList.add("company-image");
    img.addEventListener("error", () => {
      img.removeAttribute("src");
    });
    return img;
  }

  createHTMLForCompanyName(companyName, companySymbol) {
    let name = document.createElement("a");
    name.href = `./company.html?symbol=${companySymbol}`;
    name.classList.add("company-name");
    name.target = "_blank";
    name.textContent = companyName;
    return name;
  }

  createHTMLForCompanySymbol(companySymbol) {
    let symbol = document.createElement("span");
    symbol.classList.add("company-symbol");
    symbol.textContent = `(${companySymbol})`;
    return symbol;
  }

  createHTMLForChangesInStockPrice(changesPercentage) {
    let stockUpOrDown = document.createElement("span");
    if (changesPercentage !== null) {
      stockUpOrDown.textContent = changesPercentage;
      if (changesPercentage.includes("+") === true) {
        stockUpOrDown.classList.add("stock-up");
      } else {
        stockUpOrDown.classList.add("stock-down");
      }
    }
    return stockUpOrDown;
  }

  createHTMLForCompareButton() {
    let compareButton = document.createElement("button");
    compareButton.classList.add("btn");
    compareButton.textContent = "Compare";
    return compareButton;
  }

  createHTMLForAllCompanyInfo(img, name, symbol, changesInStockPrice) {
    let companyInfo = document.createElement("div");
    companyInfo.classList.add("main-list-content");
    companyInfo.append(img, name, symbol, changesInStockPrice);
    return companyInfo;
  }
  createHTMLForLi() {
    this.li = document.createElement("li");
    this.li.classList.add("list-group-item");
  }

  highlightTextMatchingQuery(companyName, companySymbol) {
    let highlightName = new Mark(companyName);
    highlightName.mark(this.searchQuery);
    let highlightSymbol = new Mark(companySymbol);
    highlightSymbol.mark(this.searchQuery);
  }

  addCompanyToCompare(profile, compareButton) {
    let divForCompaniesToCompare = document.getElementById(
      "companiesToCompare"
    );
    compareButton.addEventListener("click", () => {
      if (this.symbolsOfCompaniesToCompare.length < 3) {
        let companyToCompare = this.createHTMLForCompanyToCompare(
          profile.symbol
        );
        divForCompaniesToCompare.append(companyToCompare);
        this.symbolsOfCompaniesToCompare.push(profile.symbol);
        this.removeCompanyToCompare(profile, companyToCompare);
      }
      this.createLinkForCompaniesToCompare();
    });
  }

  removeCompanyToCompare(profile, companyToCompare) {
    companyToCompare.addEventListener("click", () => {
      companyToCompare.remove();
      for (let i = 0; i < this.symbolsOfCompaniesToCompare.length; i++) {
        if (profile.symbol === this.symbolsOfCompaniesToCompare[i]) {
          this.symbolsOfCompaniesToCompare.splice(i);
        }
      }
      this.createLinkForCompaniesToCompare();
    });
  }

  createHTMLForCompanyToCompare(companySymbol) {
    let compareCompanyName = document.createElement("span");
    compareCompanyName.textContent = companySymbol;
    let cancelIcon = document.createElement("span");
    cancelIcon.classList.add("fa", "fa-close");
    let companyToCompare = document.createElement("button");
    companyToCompare.classList.add("btn");
    companyToCompare.append(compareCompanyName, cancelIcon);
    return companyToCompare;
  }

  createLinkForCompaniesToCompare() {
    this.linkForCompaniesToCompare.textContent = "";
    this.linkForCompaniesToCompare.href = `./company.html?symbol=`;
    if (this.symbolsOfCompaniesToCompare.length === 0) {
      this.linkForCompaniesToCompare.removeAttribute("href");
      this.linkForCompaniesToCompare.textContent = "Compare companies";
    } else {
      for (let i = 0; i < this.symbolsOfCompaniesToCompare.length; i++) {
        if (i === 0) {
          this.linkForCompaniesToCompare.href += `${this.symbolsOfCompaniesToCompare[i]}`;
          this.linkForCompaniesToCompare.textContent = `Compare ${this.symbolsOfCompaniesToCompare.length} company`;
        } else {
          this.linkForCompaniesToCompare.href +=
            "," + `${this.symbolsOfCompaniesToCompare[i]}`;
          this.linkForCompaniesToCompare.textContent = `Compare ${this.symbolsOfCompaniesToCompare.length} companies`;
        }
      }
    }
  }

  hideSpinner() {
    this.spinner.classList.remove("display-element");
    this.spinner.classList.add("hide-element");
  }
}
