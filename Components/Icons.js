import React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

export const NotificationIcon = (props) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#prefix__clip0)" fill="#4775f2">
      <Path d="M20 10V8A8 8 0 0 0 4 8v2a4.441 4.441 0 0 1-1.547 3.193A4.183 4.183 0 0 0 1 16c0 2.5 4.112 4 11 4s11-1.5 11-4a4.183 4.183 0 0 0-1.453-2.807A4.44 4.44 0 0 1 20 10zM9.145 21.9a2.992 2.992 0 0 0 5.71 0c-.894.066-1.844.1-2.855.1s-1.961-.032-2.855-.1z" />
    </G>
    <Defs>
      <ClipPath id="prefix__clip0">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const PlayIcon = (props) => (
  <Svg height={38.15} width={38.15} {...props}>
    <Path
      opacity={1}
      d="M8.153 14.585c-1.73-1.703-.825-4.649 1.563-5.087l19.148-3.516c2.072-.38 3.88 1.436 3.49 3.506L28.8 28.364c-.444 2.36-3.343 3.267-5.053 1.582L8.153 14.586z"
      fill="#33CEFF"
      transform="rotate(45 19.075 19.075)"
    />
  </Svg>
);

export const DeliveredIcon = (props) => (
  <svg height={24} viewBox="0 0 24 24" width={24} {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M17.3 6.3a.996.996 0 00-1.41 0l-5.64 5.64 1.41 1.41L17.3 7.7c.38-.38.38-1.02 0-1.4zm4.24-.01l-9.88 9.88-3.48-3.47a.996.996 0 10-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L22.95 7.71a.996.996 0 000-1.41h-.01a.975.975 0 00-1.4-.01zM1.12 14.12L5.3 18.3c.39.39 1.02.39 1.41 0l.7-.7-4.88-4.9a.996.996 0 00-1.41 0c-.39.39-.39 1.03 0 1.42z" />
  </svg>
);
