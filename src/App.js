import Header from "./components/Header.js";
import PokemonList from "./components/PokemonList.js";
import { getPokemonList } from "./modules/api.js";

export default function App($app) {
  const getSearchWord = () => {
    if (window.location.search.includes("search=")) {
      return window.location.search.split("search=")[1];
    }
    return "";
  };

  this.state = {
    type: "",
    pokemonList: [],
    searchWord: getSearchWord(),
    currentPage: window.location.pathname,
  };

  const header = new Header({
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
    //'돋보기 모양'을 누르면 검색 결과를 나타내고, "(기존 url)/?search=searchWord"로 url을 변경하세요.
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

  const pokemonList = new PokemonList({
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

  this.setState = (newState) => {
    this.state = newState;
    header.setState({
      currentPage: this.state.currentPage,
      searchWord: this.state.searchWord,
    });
    pokemonList.setState(this.state.pokemonList);
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
    });
  });

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
