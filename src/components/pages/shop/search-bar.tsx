import { Search } from "lucide-react";
const SearchBar = () => {
    return (
        <div className="flex-1 flex items-center gap-2 h-10 max-w-[600px] px-2 bg-white rounded-full">
            <button>
                <Search height={20} width={20} color="gray" />
            </button>
            <input type="text" placeholder="Search for products"
                className="w-full focus:outline-none text-md text-gray-900 placeholder:text-gray-400" />
        </div>
    );
}

export default SearchBar;