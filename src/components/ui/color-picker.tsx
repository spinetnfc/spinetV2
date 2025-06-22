import React, { useState, useEffect } from 'react';
import ColorOutlet from '@/components/ui/color-outlet';
import { COLOR_PALETTE } from '@/utils/constants/colors';

interface ThemeColorPickerProps {
    color: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ color, onChange, disabled }) => {
    const [isCustomColor, setIsCustomColor] = useState(false);

    // Only update isCustomColor when the color changes due to user interaction, not initial prop
    useEffect(() => {
        // Do not set isCustomColor on initial render; let it default to false
    }, [color]);

    const handleColorChange = (value: string, isCustom: boolean) => {
        onChange(value);
        setIsCustomColor(isCustom);
    };

    return (
        <div className="my-3 inline-flex w-[90%] flex-wrap flex-row items-center space-x-6">
            <div
                className={`picker h-[30px] w-[30px] rounded-full cursor-pointer ${isCustomColor ? 'border-2 border-primary' : ''}`}
                style={{
                    background: isCustomColor
                        ? color
                        : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
                }}
            >
                <input
                    title="Custom color"
                    type="color"
                    className="h-[25px] w-[25px] rounded-full border-none opacity-0 outline-none"
                    value={color}
                    onChange={(e) => handleColorChange(e.target.value, true)}
                    disabled={disabled}
                />
            </div>
            {COLOR_PALETTE.map((paletteColor) => (
                <div
                    key={paletteColor}
                    className={disabled ? 'cursor-not-allowed opacity-50' : ''}
                    onClick={disabled ? undefined : () => handleColorChange(paletteColor, false)}
                >
                    <ColorOutlet
                        color={paletteColor}
                        onUpdate={() => { }} // No-op since click is handled by wrapper
                        isChecked={color === paletteColor}
                    />
                </div>
            ))}
        </div>
    );
};

export default ThemeColorPicker;