import { ref } from "vue";

const selectedFilter = ref<number>();

export default function
()
{

    function toggleFilter(id: number)
    {
        if (isSelected(id)) {
            removeFilter(id);
        } else {
            setFilter(id);
        }
    }


    function setFilter(id: number)
    {
        selectedFilter.value = (id);
    }

    function removeFilter(id: number)
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