"use client";
import React, { useEffect, useState } from 'react';

const InputComponent = ({ label, pholder, data, data1, onSelected, onChange }) => {
    const [suggestions, setSugesstions] = useState([]);
    const [suggestionsTwo, setSugesstionsTwo] = useState([]);
    const [isHideSuggs, setIsHideSuggs] = useState(false);
    const [selectedVal, setSelectedVal] = useState("");
    const handler = e => {
        setSugesstions(data);
    };

    const handleChange = e => {
        const input = e.target.value;
        setIsHideSuggs(false);
        setSelectedVal(input);
        onChange(input);
    };

    const hideSuggs = value => {
        onSelected(value);
        setSelectedVal(value);
        setIsHideSuggs(true);
    };

    useEffect(() => {
        setSugesstions(data);
        setSugesstionsTwo(data1)
    }, [suggestions, data, data1]);

    return (
        <div>
            {/* <Input placeholder={props.placeholder} my={1} onChange={changeInput} /> */}

            <div className="sugesstion-auto mb-4">
                <div className="form-control-auto">
                    <label htmlFor="tag-input">{label}</label>
                    <input
                        placeholder={pholder}
                        type="search"
                        value={selectedVal}
                        onChange={handleChange}
                        // onKeyUp={handler}
                        className="bg-gray-50 border z-50 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>

                <div
                    className="suggestions"
                    style={{ display: isHideSuggs ? "none" : "block" }}
                >
                    {data && suggestions.map((item, idx) => (
                        <div
                            key={"" + item + idx}
                            onClick={() => {
                                hideSuggs(item);
                            }}
                            className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:bg-blue-500 hover:text-white"
                        >
                            {item}
                        </div>
                    ))}

                    {data1 && suggestionsTwo.map((item, idx) => (
                        <div
                            key={"" + item + idx}
                            onClick={() => {
                                hideSuggs(item);
                            }}
                            className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:bg-blue-500 hover:text-white"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default InputComponent;