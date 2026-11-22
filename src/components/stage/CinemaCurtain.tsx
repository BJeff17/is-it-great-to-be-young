import React from 'react';

interface CinemaCurtainProps {
  onLift: () => void;
}

export const CinemaCurtain: React.FC<CinemaCurtainProps> = ({ onLift }) => (
  <div className="cinema-curtain" onClick={onLift}>
    <div className="curtain-dot-wrap">
      <div className="curtain-halo" />
      <div className="curtain-dot" />
    </div>
    <div className="curtain-title">Is it really that great to be young?</div>
    <div className="curtain-hint">Press Space or click anywhere to begin</div>
  </div>
);
