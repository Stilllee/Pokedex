import PokemonList from "./components/PokemonList.js";
import { getPokemonList } from "./modules/api.js";

export default function App($app) {
  const getSearchWord = () => {
    if (window.location.search.includes("search=")) {
      return window.location.search.split("search-")[1];
    }
    return "";
  };

  this.state = {
    type: "",
    pokemonList: [],
    searchWord: getSearchWord(),
    currentPage: window.location.pathname,
  };

  const pokemonList = new PokemonList({
    $app,
    initialState: this.state.pokemonList,
    handleItemClick: () => {},
    handleTypeClick: () => {},
  });

  this.setState = (newState) => {
    this.state = newState;
    pokemonList.setState(this.state.pokemonList);
  };

  const init = async () => {
    try {
      const initialPokemonList = await getPokemonList();
      this.setState({
        ...this.state,
        pokemonList: initialPokemonList,
      });
    } catch (error) {
      console.log(error);
    }
  };

  init();
}
