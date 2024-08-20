import { useEffect, useRef, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

export default function Navbar({ username }) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // const handleClickOutside = (event) => {
    //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //         setDropdownOpen(false);
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     }
    // }, []);

    const handleClearData = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div className=" w-full h-12 bg-[#e7e6e6] flex justify-between items-center px-5">

            <div className=" text-center">
                <h1 className=" text-xl font-bold">My Games</h1>
            </div>

            <div className=" text-center flex gap-1">
                <h1 className=" text-lg">{username ? username : 'User'}</h1>

                <IoIosArrowDropdownCircle
                    size={28}
                    className= {`cursor-pointer transform transition-transform duration-300 ${dropdownOpen ? 'rotate-180': 'rotate-0'}`}
                    onClick={toggleDropdown}
                />
            </div>

            {dropdownOpen && (
                <div className=" absolute top-14 right-5 w-48 bg-[#eee] shadow-lg rounded-md">
                    <ul className=" py-2">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold">
                            <button onClick={handleClearData}>
                                Clear Data
                            </button>
                        </li>
                    </ul>
                </div>
            )}

        </div>
    );
}