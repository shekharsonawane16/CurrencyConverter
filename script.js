// Supported currencies
const currencyList = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "JPY",
    "CNY",
    "AUD",
    "CAD",
    "CHF",
    "SGD",
    "ZAR"
];

// Get HTML elements
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from-currency");
const toSelect = document.getElementById("to-currency");
const convertButton = document.getElementById("convert-btn");
const resultDiv = document.getElementById("result");
const rateInfo = document.getElementById("rate-info");

// Populate currency dropdowns
currencyList.forEach((currency) => {

    const fromOption = document.createElement("option");
    fromOption.value = currency;
    fromOption.textContent = currency;
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement("option");
    toOption.value = currency;
    toOption.textContent = currency;
    toSelect.appendChild(toOption);

});

// Default currencies
fromSelect.value = "USD";
toSelect.value = "INR";


// Convert currency
async function convertCurrency() {

    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        resultDiv.textContent = "Please enter a valid amount greater than 0.";
        rateInfo.textContent = "";
        return;
    }

    // Same currency
    if (from === to) {

        resultDiv.textContent =
            `${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}`;

        rateInfo.textContent = `Exchange rate: 1 ${from} = 1 ${to}`;

        return;
    }

    // Loading message
    resultDiv.textContent = "Converting...";
    rateInfo.textContent = "";

    try {

        // Frankfurter API
        const apiUrl =
            `https://api.frankfurter.dev/v2/rate/${from}/${to}`;

        const response = await fetch(apiUrl);

        // Check HTTP response
        if (!response.ok) {
            throw new Error("Unable to fetch exchange rate.");
        }

        const data = await response.json();

        // Get exchange rate
        const rate = data.rate;

        if (!rate) {
            throw new Error("Exchange rate not available.");
        }

        // Calculate converted amount
        const convertedAmount = amount * rate;

        // Display result
        resultDiv.textContent =
            `${amount.toFixed(2)} ${from} = ${convertedAmount.toFixed(2)} ${to}`;

        // Display exchange rate
        rateInfo.textContent =
            `Exchange rate: 1 ${from} = ${rate.toFixed(4)} ${to}`;

    } catch (error) {

        console.error(error);

        resultDiv.textContent =
            "Unable to fetch exchange rate. Please try again.";

        rateInfo.textContent = "";
    }
}


// Button click
convertButton.addEventListener("click", convertCurrency);


// Press Enter to convert
amountInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        convertCurrency();
    }

});
