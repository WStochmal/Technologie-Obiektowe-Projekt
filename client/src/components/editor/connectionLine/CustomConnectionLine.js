import React from "react";

const CustomConnectionLine = ({ points, connection }) => {
  const [firstPoint, secondPoint] = points;

  // Obliczamy punkty połączenia, uwzględniając pozycje węzłów
  const midPointX = (firstPoint.x + secondPoint.x) / 2;
  const firstConnectX =
    midPointX < firstPoint.x ? firstPoint.x - 20 : firstPoint.x + 20;
  const secondConnectX =
    midPointX < secondPoint.x ? secondPoint.x - 20 : secondPoint.x + 20;

  const linePoints = [
    { x: firstConnectX, y: firstPoint.y },
    { x: secondConnectX, y: secondPoint.y },
  ];

  return (
    <>
      <path
        d={`M${linePoints[0].x},${linePoints[0].y} ${linePoints[1].x},${linePoints[1].y}`}
        strokeWidth={7}
        stroke="green"
        fill="none"
      />
    </>
  );
};

export default CustomConnectionLine;
