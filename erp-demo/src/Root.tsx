import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, VH, VW, W} from './theme';
import {Main, TOTAL_DURATION} from './Main';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ERPDemo"
      component={Main}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="ERPDemoVertical"
      component={Main}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={VW}
      height={VH}
    />
  </>
);
