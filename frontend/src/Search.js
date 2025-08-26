import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/search/?q=${query}`);
      setResults(res.data.results);
    } catch (err) {
      setError("Failed to fetch articles. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Scholarly Article Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "8px", width: "70%" }}
        />
        <button type="submit" style={{ padding: "8px 12px", marginLeft: "5px" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((item, idx) => (
          <li key={idx} style={{ margin: "15px 0", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <h3>{item.title}</h3>
            <p>
              <b>Year:</b> {item.year || "N/A"}  
              <br />
              <b>Authors:</b> {item.authors.join(", ") || "N/A"}
            </p>
            <a href={item.url} target="_blank" rel="noreferrer">
              View Paper
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
