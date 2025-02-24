import { Search } from "lucide-react";
import { useIntl } from "react-intl"; // Use react-intl's hook

const SearchBar = () => {

    const intl = useIntl(); return (
        <div className="flex-1 flex items-center gap-1 xs:gap-2 h-8 xs:h-10  w-full max-w-[600px] px-2 bg-white rounded-full">
            <button>
                <Search height={20} width={20} color="gray" />
            </button>
            <input type="text" placeholder={intl.formatMessage({ id: "search-for-products" })}
                className="w-full focus:outline-none text-sm xs:text-md text-gray-900 placeholder:text-gray-400" />
        </div>
    );
}

export default SearchBar;