import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";
import "./App.css";

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
      )
      .then((res) => {
        setCoins(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Stop loading even if error
      });
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "app dark-mode" : "app light-mode"}>
      <div className="container">
        <header>
          <h1>Crypto<span className="accent">Tracker</span></h1>
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </header>

        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Bitcoin, Ethereum..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading live prices...</div>
        ) : (
          <div className="coin-table">
            <div className="table-header">
              <p>Coin</p>
              <p>Symbol</p>
              <p>Price</p>
              <p>24h Change</p>
            </div>
            
            {filteredCoins.map((coin) => {
              // SAFETY CHECK: If data is missing, use defaults
              const priceChange = coin.price_change_percentage_24h || 0;
              const currentPrice = coin.current_price || 0;
              
              return (
                <div key={coin.id} className="coin-row">
                  <div className="coin-name">
                    <img src={coin.image} alt={coin.name} />
                    <p>{coin.name}</p>
                  </div>
                  <p className="coin-symbol">{coin.symbol.toUpperCase()}</p>
                  <p className="coin-price">${currentPrice.toLocaleString()}</p>
                  
                  <p className={priceChange < 0 ? "red" : "green"}>
                    {priceChange.toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;