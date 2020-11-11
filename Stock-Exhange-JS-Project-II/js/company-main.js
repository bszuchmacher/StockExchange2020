const apiKey = "677d82babfc3032477773a62e748b021";

let urlParams = new URLSearchParams(window.location.search);
let symbols = urlParams.get("symbol");
let companyInfo = new Company(
  document.getElementById("companiesToCompare"),
  symbols
);
companyInfo.loadCompanyInfo();
