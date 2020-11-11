class SearchForm {
  constructor(searchContainer, searchResults, spinner) {
    this.searchContainer = searchContainer;
    this.searchResults = searchResults;
    this.spinner = spinner;
    this.spinner.classList.add("spinner-border");
    this.urlParams = new URLSearchParams(window.location.search);
  }

  createSearchBar() {
    this.searchBar = document.createElement("input");
    this.searchBar.classList.add("form-control");
    this.searchBar.placeholder = "search";
    this.zeroResultsAlert = document.createElement("div");
    this.zeroResultsAlert.classList.add(
      "alert",
      "alert-danger",
      "hide-element"
    );
    this.zeroResultsAlert.textContent = "Your search returned 0 results";
    this.searchContainer.append(this.searchBar, this.zeroResultsAlert);
  }

  onSearch(callback) {
    this.searchBar.onkeyup = this.debounce(async () => {
      this.searchQuery = this.searchBar.value;
      if (this.searchQuery.length == 0) {
        this.hideSearchAlert();
        this.clearPreviousSearchResults();
        this.deleteURLParameters();
      } else {
        this.prepareForSearch();
        let searchResults = await this.search();
        let listOfCompanyProfiles = await this.getCompanyProfiles(
          searchResults
        );
        callback(listOfCompanyProfiles, this.searchQuery);
      }
    }, 400);
  }

  prepareForSearch() {
    this.hideSearchAlert();
    this.showSpinner();
    this.clearPreviousSearchResults();
    this.addSearchQueryAsURLParameter();
  }

  async search() {
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${this.searchQuery}&limit=10&exchange=NASDAQ&apikey=${apiKey}`
    );
    let searchResults = await response.json();
    if (searchResults.length === 0) {
      this.showSearchAlert();
      this.hideSpinner();
    } else {
      let listOfCompanySymbols = searchResults.map((company) => {
        return company.symbol;
      });
      return listOfCompanySymbols;
    }
  }

  async getCompanyProfiles(listOfCompanySymbols) {
    let arrayOfFetchRequests = [];
    let companiesForFetchRequest = [];
    let finalIndexPosition = 2;
    for (let i = 0; i < listOfCompanySymbols.length; i++) {
      if (i <= finalIndexPosition) {
        companiesForFetchRequest.push(listOfCompanySymbols[i]);
      } else {
        companiesForFetchRequest = [listOfCompanySymbols[i]];
        finalIndexPosition += 3;
      }
      if (
        companiesForFetchRequest.length === 3 ||
        i === listOfCompanySymbols.length - 1
      ) {
        arrayOfFetchRequests.push(
          `https://financialmodelingprep.com/api/v3/company/profile/${companiesForFetchRequest[0]},
          ${companiesForFetchRequest[1]},
          ${companiesForFetchRequest[2]}?apikey=${apiKey}`
        );
      }
    }
    let listOfCompanyProfiles = Promise.all(
      arrayOfFetchRequests.map((url) =>
        fetch(url).then((response) => response.json())
      )
    ).then((data) => {
      let flattenedListOfCompanyProfiles = [];
      for (let i = 0; i < data.length; i++) {
        flattenedListOfCompanyProfiles.push(...data[i].companyProfiles);
      }
      return flattenedListOfCompanyProfiles;
    });
    return listOfCompanyProfiles;
  }

  showSpinner() {
    this.spinner.classList.remove("hide-element");
    this.spinner.classList.add("display-element");
  }

  hideSpinner() {
    this.spinner.classList.remove("display-element");
    this.spinner.classList.add("hide-element");
  }

  showSearchAlert() {
    this.zeroResultsAlert.classList.remove("hide-element");
    this.zeroResultsAlert.classList.add("display-element");
  }

  hideSearchAlert() {
    this.zeroResultsAlert.classList.remove("display-element");
    this.zeroResultsAlert.classList.add("hide-element");
  }

  clearPreviousSearchResults() {
    this.searchResults.textContent = "";
  }

  addSearchQueryAsURLParameter() {
    this.urlParams.set("symbol", this.searchQuery);
    let url = window.location.href.split("?")[0] + "?" + this.urlParams;
    window.history.pushState({ path: url }, "", url);
  }

  deleteURLParameters() {
    let urlPath = window.location.href.split("?")[0];
    window.history.pushState({ path: urlPath }, "", urlPath);
  }

  debounce(cb, interval, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) cb.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, interval);
      if (callNow) cb.apply(context, args);
    };
  }

  async searchIfSymbolInURL(callback) {
    this.symbol = this.urlParams.get("symbol");
    this.searchQuery = this.symbol;
    if (this.symbol !== null) {
      let searchResults = await this.search();
      let listOfCompanyProfiles = await this.getCompanyProfiles(searchResults);
      callback(listOfCompanyProfiles, this.searchQuery);
      this.searchBar.value = this.symbol;
    }
  }
}
