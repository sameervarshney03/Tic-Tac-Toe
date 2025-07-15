import React from "react";
interface BlockProps{
    value?: string|null;
    onClick?: () =>void;
    className?: string;
}

const Block: React.FC<BlockProps> = (props) =>{
    return(<div onClick={props.onClick} className={props.className ? `block ${props.className}` : "block"}>{props.value}</div>);
}


export default Block