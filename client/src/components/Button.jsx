import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate} from "react-router-dom";
export default function Button(props) {
    const navigate = useNavigate();
    const handleClick = () => navigate(`${props.link}`);

    return (
        <div onClick={handleClick} className="Button">
            <p>{props.name}</p>
        </div>
    );
}
