import React from 'react';

// Yeh component 'progress' (0 se 100) ke adhaar par SVG ko draw karega
const Plant = ({ progress }) => {
  // Har path ki total length (yeh pehle se calculate ki gayi hai)
  const TANA_LENGTH = 300;
  const BRANCH1_LENGTH = 150;
  const BRANCH2_LENGTH = 150;
  const LEAF1_LENGTH = 50;
  const LEAF2_LENGTH = 50;

  // Progress ke hisaab se 'stroke-dashoffset' ko animate karna
  // Jab progress 0 hai, offset = length (line chupi hai)
  // Jab progress 100 hai, offset = 0 (line poori dikh rahi hai)

  // Tana (Stem) 0-30% progress me grow karega
  const tanaProgress = Math.max(0, Math.min(progress / 30, 1));
  const tanaOffset = TANA_LENGTH * (1 - tanaProgress);

  // Branch 1 30-60% me grow karega
  const branch1Progress = Math.max(0, Math.min((progress - 30) / 30, 1));
  const branch1Offset = BRANCH1_LENGTH * (1 - branch1Progress);

  // Branch 2 40-70% me grow karega
  const branch2Progress = Math.max(0, Math.min((progress - 40) / 30, 1));
  const branch2Offset = BRANCH2_LENGTH * (1 - branch2Progress);

  // Leaves 60-100% me grow karenge
  const leafProgress = Math.max(0, Math.min((progress - 60) / 40, 1));
  const leafOffset = LEAF1_LENGTH * (1 - leafProgress);

  return (
    <svg
      viewBox="0 0 200 400"
      width="200"
      height="400"
      className="max-h-[60vh] lg:max-h-[80vh] w-auto transition-all duration-1000 ease-out"
      style={{
        // Progress ke 100% hote hi paudha thoda "glow" karega
        filter: progress > 95 ? 'drop-shadow(0 0 10px #4ade80)' : 'none',
       
      }}
    >
      <g transform="translate(100 400) scale(1 -1)">
        {/* Tana (Stem) */}
        <path
          d="M0 0 Q 5 50, 0 100 Q -5 150, 0 200 Q 5 250, 0 300"
          stroke="#059669" // Dark Green059669
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={TANA_LENGTH}
          strokeDashoffset={tanaOffset}
          className="transition-all duration-1000 ease-linear"
        />

        {/* Branch 1 (Right) */}
        <path
          d="M0 100 C 20 110, 80 130, 100 180"
          stroke="#10B981" // Medium Green10B981
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={BRANCH1_LENGTH}
          strokeDashoffset={branch1Offset}
          className="transition-all duration-1000 ease-linear"
        />

        {/* Branch 2 (Left) */}
        <path
          d="M0 180 C -20 190, -80 210, -100 260"
          stroke="#10B981"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={BRANCH2_LENGTH}
          strokeDashoffset={branch2Offset}
          className="transition-all duration-1000 ease-linear"
        />

        {/* Leaves */}
        <g stroke="#34D399" strokeWidth="2" fill="none">
          {/* Leaf 1 (on Branch 1) */}
          <path
            d="M100 180 q 10 10, 20 0 q -10 10, -20 0"
            strokeDasharray={LEAF1_LENGTH}
            strokeDashoffset={leafOffset}
            className="transition-all duration-500 ease-linear"
          />
          {/* Leaf 2 (on Branch 2) */}
          <path
            d="M-100 260 q -10 10, -20 0 q 10 10, 20 0"
            strokeDasharray={LEAF2_LENGTH}
            strokeDashoffset={leafOffset}
            className="transition-all duration-500 ease-linear"
          />
          {/* Top Leaves */}
          <path
            d="M0 300 q 10 10, 20 0 q -10 10, -20 0"
            strokeDasharray={LEAF1_LENGTH}
            strokeDashoffset={tanaOffset} // Tana ke saath grow karega
          />
          <path
            d="M0 300 q -10 10, -20 0 q 10 10, 20 0"
            strokeDasharray={LEAF2_LENGTH}
            strokeDashoffset={tanaOffset} // Tana ke saath grow karega
          />
        </g>
      </g>
    </svg>
  );
};

export default Plant;