const Connections = () => {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0 }}>
      <defs>
        <marker
          id="symbol-1-right"
          viewBox="0 0 40 40"
          markerHeight={40}
          markerWidth={40}
          refX={-5}
          refY={5}
        >
          <path d="M0,0 L0,10" stroke="#b2b2b4" strokeWidth="2" fill="white" />
        </marker>
        <marker
          id="symbol-1-left"
          viewBox="0 0 40 40"
          markerHeight={40}
          markerWidth={40}
          refX={5}
          refY={5}
        >
          <path d="M0,0 L0,10" stroke="#b2b2b4" strokeWidth="2" fill="white" />
        </marker>
        <marker
          id="symbol-n-left"
          viewBox="-1 -1 40 40"
          markerHeight={40}
          markerWidth={40}
          refX="10" // Przesunięcie od końca krawędzi, aby strzałka była umieszczona na linii
          refY="5" // Przesunięcie w pionie, aby strzałka była umieszczona na linii

          // Automatyczna orientacja strzałki wzdłuż krawędzi
        >
          {/* Lewa skośna linia strzałki */}
          <line x1="10" y1="0" x2="0" y2="5" stroke="#b2b2b4" strokeWidth="1" />
          {/* Prawa skośna linia strzałki */}
          <line
            x1="0"
            y1="5"
            x2="10"
            y2="10"
            stroke="#b2b2b4"
            strokeWidth="1"
          />
        </marker>
        <marker
          id="symbol-n-right"
          viewBox="-1 -1 40 40"
          markerHeight={40}
          markerWidth={40}
          refX="0" // Przesunięcie od końca krawędzi, aby strzałka była umieszczona na linii
          refY="5" // Przesunięcie w pionie, aby strzałka była umieszczona na linii
        >
          {/* Lewa skośna linia strzałki */}
          <line x1="0" y1="0" x2="10" y2="5" stroke="#b2b2b4" strokeWidth="1" />
          {/* Prawa skośna linia strzałki */}
          <line
            x1="0"
            y1="10"
            x2="10"
            y2="5"
            stroke="#b2b2b4"
            strokeWidth="1"
          />
        </marker>
      </defs>
    </svg>
  );
};

export default Connections;
