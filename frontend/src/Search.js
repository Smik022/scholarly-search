import React, { useState } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/search/?q=${query}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Scholarly Search</h1>

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search scholarly articles..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && (
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      <div className="results">
        {results.map((item, index) => (
          <div key={index} className="card fade-in">
            <h2>{item.title}</h2>
            <p className="authors">
              {item.authors.length > 0
                ? item.authors.join(", ")
                : "Unknown authors"}
            </p>
            <p className="year">{item.year || "Unknown year"}</p>
            <p className="source">{item.source || "Unknown source"}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              View Article
            </a>
          </div>
        ))}
      </div>

      <div className="footer">
        Made by{" "}
        <a
          href="https://github.com/smik022"
          target="_blank"
          rel="noopener noreferrer"
        >
          Smik
        </a>
      </div>
    </div>
  );
};

export default SearchPage;
