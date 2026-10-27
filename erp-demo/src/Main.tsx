import React from 'react';
import {Sequence} from 'remotion';
import {DURATION as D1, Hero} from './scenes/Hero';
import {DURATION as D2, Stack} from './scenes/Stack';
import {DURATION as D3, Modules} from './scenes/Modules';
import {DURATION as D4, PosDemo} from './scenes/PosDemo';
import {DURATION as D5, Dashboard} from './scenes/Dashboard';
import {DURATION as D6, Fiscal} from './scenes/Fiscal';
import {DURATION as D7, Deploy} from './scenes/Deploy';
import {DURATION as D8, Outro} from './scenes/Outro';

export const TOTAL_DURATION = D1 + D2 + D3 + D4 + D5 + D6 + D7 + D8; // 1830f = 61s @30fps

/** Película completa: 8 escenas encadenadas */
export const Main: React.FC = () => {
  const durs = [D1, D2, D3, D4, D5, D6, D7, D8];
  const scenes = [Hero, Stack, Modules, PosDemo, Dashboard, Fiscal, Deploy, Outro];
  let acc = 0;
  return (
    <>
      {scenes.map((Scene, i) => {
        const from = acc;
        acc += durs[i];
        return (
          <Sequence key={i} from={from} durationInFrames={durs[i]}>
            <Scene />
          </Sequence>
        );
      })}
    </>
  );
};
