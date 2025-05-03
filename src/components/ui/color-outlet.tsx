import React from 'react';
import { CheckIcon } from "lucide-react";

interface Props {
    color: string;
    onUpdate: (color: string) => void;
    isChecked: boolean;
}

const ColorOutlet: React.FC<Props> = (props) => {
    return (
        <div
            style={{ background: props.color }}
            className={`flex h-[30px] w-[30px] cursor-pointer flex-col justify-center rounded-full ${props.isChecked ? "border-[2px] border-primary" : ""}`}
            onClick={() => props.onUpdate(props.color)}
        >
            {props.isChecked ? (
                <CheckIcon className="m-auto h-[15px] w-[15px] fill-white" />
            ) : null}
        </div>
    );
};

export default ColorOutlet;