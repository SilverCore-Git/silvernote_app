import { ref, watch } from 'vue';
import { editor } from '../../Editor';
import { SearchAndReplace } from './searchAndReplace';
import SearchBar from './SearchBar.vue';
export * from './searchAndReplace';

const searchTerm = ref<string>('');
const _searchBar = ref<boolean>(false);

const setSearch = (term: string): void => {
    editor.value?.commands.setSearchTerm(term);
}

const showSearchBar = (): void => {
    _searchBar.value = true;
}

window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        _searchBar.value = !_searchBar.value;
    }
})


watch(() => searchTerm.value, () => {
    setSearch(searchTerm.value);
});


export {
    searchTerm,
    _searchBar,

    SearchBar,
    SearchAndReplace,

    setSearch,
    showSearchBar
}