import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("/api/v1/Pokemons");
        setPokemons(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const loadMore = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/v1/Pokemons", {
        params: { offset: pokemons.length }
      });
      setPokemons([...pokemons, ...response.data]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Pokedex</h1>
      <div className="pokemon-list">
        {pokemons.map((pokemon) => (
          <Pokemon key={pokemon._id} name={pokemon.name} id={pokemon.id} />
        ))}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <button className="load-more-button" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
}

function Pokemon(props) {
  const { name, id } = props;
  const POKE_IMG_URL = `/api/v1/Pokemons/${id}/image`;

  return (
    <div className="pokemon">
      <img src={POKE_IMG_URL} alt={name} />
      <div className="pokemon-name">{name}</div>
    </div>
  );
}

export default App;
