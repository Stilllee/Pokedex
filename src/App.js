import { getPokemonDetail, getPokemonList } from "./modules/api.js";

import Header from "./components/Header.js";
import PokemonDetail from "./components/PokemonDetail.js";
import PokemonList from "./components/PokemonList.js";

export default function App($app) {
  const getSearchWord = () => {
    if (window.location.search.includes("search=")) {
      return window.location.search.split("search=")[1];
    }
    return "";
  };

  this.state = {
    type: window.location.pathname.replace("/", ""),
    pokemonList: [],
    searchWord: getSearchWord(),
    currentPage: window.location.pathname,
  };

  const renderHeader = () => {
    new Header({
      $app,
      initialState: {
        currentPage: this.state.currentPage,
        searchWord: this.state.searchWord,
      },
      handleClick: async () => {
        history.pushState(null, null, "/");
        const pokemonList = await getPokemonList();
        this.setState({
          ...this.state,
          pokemonList,
          type: "",
          searchWord: getSearchWord(),
          currentPage: "/",
        });
      },
      handleSearch: async (searchWord) => {
        history.pushState(null, null, `?search=${searchWord}`);
        const searchPokemonList = await getPokemonList(
          this.state.type,
          searchWord
        );
        this.setState({
          ...this.state,
          searchWord,
          pokemonList: searchPokemonList,
          currentPage: `?search=${searchWord}`,
        });
      },
    });
  };

  const renderPokemonList = () => {
    new PokemonList({
      $app,
      initialState: this.state.pokemonList,
      handleItemClick: async (id) => {
        history.pushState(null, null, `/detail/${id}`);
        this.setState({
          ...this.state,
          currentPage: `/detail/${id}`,
        });
      },
      handleTypeClick: async (type) => {
        history.pushState(null, null, `/${type}`);
        const pokemonList = await getPokemonList(type);
        this.setState({
          ...this.state,
          pokemonList,
          type,
          currentPage: `/${type}`,
        });
      },
    });
  };

  const renderPokemonDetail = async (pokemonId) => {
    try {
      const pokemonDetailData = await getPokemonDetail(pokemonId);
      new PokemonDetail({ $app, initialState: pokemonDetailData });
    } catch (error) {
      console.log(error);
    }
  };

  const render = async () => {
    const path = this.state.currentPage;
    $app.innerHTML = "";
    if (!path.startsWith("/detail")) {
      renderHeader();
      renderPokemonList();
    } else {
      const pokemonId = path.split("/detail/")[1];
      renderHeader();
      renderPokemonDetail(pokemonId);
    }
  };

  this.setState = (newState) => {
    this.state = newState;
    render();
  };

  const init = async () => {
    const path = this.state.currentPage;
    if (!path.startsWith("/detail")) {
      try {
        const initialPokemonList = await getPokemonList();
        this.setState({
          ...this.state,
          pokemonList: initialPokemonList,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      render();
    }
  };

  window.addEventListener("popstate", async () => {
    const urlPath = window.location.pathname;

    const prevType = urlPath.replace("/", "");
    const prevSearchWord = getSearchWord();
    const prevPokemonList = await getPokemonList(prevType, prevSearchWord);

    this.setState({
      ...this.state,
      type: prevType,
      searchWord: prevSearchWord,
      pokemonList: prevPokemonList,
      currentPage: urlPath,
    });
  });

  init();
}
