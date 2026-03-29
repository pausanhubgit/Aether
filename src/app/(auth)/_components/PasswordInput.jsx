"use client";

import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const  PasswordInput = (props)=>{
    const[showPassword, setShowPassword] = useState(false);

    return(
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                 className="border w-full my-1 rounded p-2"
                {...props}
            />
            <button
                type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition"
                onClick={() => setShowPassword(!showPassword)}
            >
               {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
        </div>
    )
}

export default PasswordInput;