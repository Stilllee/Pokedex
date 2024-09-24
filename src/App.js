import PokemonList from "./components/PokemonList.js";

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
    // 코드 작성
    handleItemClick: () => {},
    handleTypeClick: () => {},
  });

  this.setState = (newState) => {
    this.state = newState;
    // 코드 작성
  };

  const init = async () => {
    // 코드 작성
  };

  init();
}
