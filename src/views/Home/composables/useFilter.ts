import router from "@/router";
import { ref } from "vue";

const selectedFilter = ref<number>();

export default function
()
{

    function toggleFilter(id: number)
    {
        router.replace({ query: {} })
        if (isSelected(id)) {
            removeFilter();
        } else {
            setFilter(id);
        }
    }


    function setFilter(id: number)
    {
        selectedFilter.value = (id);
    }

    function removeFilter()
    {
        selectedFilter.value = 0;
    }

    function isSelected(id: number)
    {
        return selectedFilter.value == (id);
    }

    return {
        setFilter,
        removeFilter,
        isSelected,
        toggleFilter,
        selectedFilter
    }

}