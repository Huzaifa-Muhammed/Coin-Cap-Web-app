const allCoinsDataApi = "https://api.coincap.io/v2/assets";

const cryptoList = document.getElementById("crypto-list");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const themeToggle = document.getElementById("themeToggle");

let allCoins = [];


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("light-mode")) {
    themeToggle.textContent = "🌙";
  } else {
    themeToggle.textContent = "☀️";
  }
});

// Function to generate a random color for each symbol
function getColor(symbol) {
  const colors = [
    "#ffcc00",
    "#ff5733",
    "#33ff57",
    "#3399ff",
    "#cc33ff",
    "#ff3366",
    "#66ccff",
    "#ff9933",
  ];
  let index = symbol.charCodeAt(0) % colors.length;
  return colors[index];
}

// Function to display crypto cards
function addCryptoCards(coins) {
  cryptoList.innerHTML = "";

  coins.forEach((coin) => {
    const card = document.createElement("div");
    card.classList.add("crypto-card");

    // Set the inner HTML for the card
    card.innerHTML = `
            <div class="crypto-symbol" style="background-color:${getColor(
              coin.symbol
            )};">
                ${coin.symbol}
            </div>
            <h3>${coin.name} (#${coin.rank})</h3>
            <p>Price: $${parseFloat(coin.priceUsd).toFixed(2)}</p>
            <p>Market Cap: $${(parseFloat(coin.marketCapUsd) / 1e9).toFixed(
              2
            )}B</p>
            <p>24h Change: <span style="color:${
              coin.changePercent24Hr >= 0 ? "green" : "red"
            }">
                ${parseFloat(coin.changePercent24Hr).toFixed(2)}%
            </span></p>
            <a href="${coin.explorer}" target="_blank">🔗 Explorer</a>
        `;

    cryptoList.appendChild(card);
  });
}

// Fetch all crypto data from API
async function getAllCryptoData() {
  try {
    const response = await fetch(allCoinsDataApi);
    const data = await response.json();

    if (data.data) {
      allCoins = data.data.slice(0, 100); 
      addCryptoCards(allCoins);
    } else {
      console.error("No data received.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Search Functionality
searchInput.addEventListener("input", (event) => {
  const searchValue = event.target.value.toLowerCase();
  const filteredCoins = allCoins.filter((coin) =>
    coin.name.toLowerCase().includes(searchValue)
  );
  addCryptoCards(filteredCoins);
});

// Sorting Functionality
filterSelect.addEventListener("change", (event) => {
  let sortedCoins = [...allCoins];

  switch (event.target.value) {
    case "price":
      sortedCoins.sort(
        (a, b) => parseFloat(a.priceUsd) - parseFloat(b.priceUsd)
      );
      break;
    case "change":
      sortedCoins.sort(
        (a, b) =>
          parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr)
      );
      break;
    case "marketCap":
      sortedCoins.sort(
        (a, b) => parseFloat(b.marketCapUsd) - parseFloat(a.marketCapUsd)
      );
      break;
    default:
      break;
  }

  addCryptoCards(sortedCoins);
});

// Call the function on page load
getAllCryptoData();
