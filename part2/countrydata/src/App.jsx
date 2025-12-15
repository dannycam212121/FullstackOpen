import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";

const CountryFilter = ({ search, setSearch }) => {
  return (
    <div>
      find countries <input value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>
  );
};

const Results = ({ countries, search, onSelectCountry }) => {
  if (search.trim() === "") {
    return <p>Please insert some characters to search between countries</p>;
  }

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredCountries.length === 0) {
    return <p>No matching countries found</p>;
  } else if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital[0]}</p>
        <p>Population: {country.population}</p>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200" />
      </div>
    );
  } else {
    return (
      <ul>
        {filteredCountries.map((country) => (
          <li key={country.cca3}>
            {country.name.common} {" "}
            <button onClick={() => onSelectCountry(country)}>show</button>
          </li>
        ))}
      </ul>
    );
  }
};

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null); // State for selected country
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://studies.cs.helsinki.fi/restcountries/api/all");
        setCountries(response.data);
      } catch (err) {
        setError("Failed to fetch countries data");
        console.error(err);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <CountryFilter search={search} setSearch={setSearch} />
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital[0]}</p>
          <p>Population: {selectedCountry.population}</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={selectedCountry.flags.png}
            alt={`Flag of ${selectedCountry.name.common}`}
            width="200"
          />
          <button onClick={() => setSelectedCountry(null)}>Back</button>
        </div>
      ) : (
        <Results countries={countries} search={search} onSelectCountry={setSelectedCountry} />
      )}
    </div>
  );
}

export default App
