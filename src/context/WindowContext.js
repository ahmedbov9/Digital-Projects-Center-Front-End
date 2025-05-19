import { createContext, useEffect, useState } from 'react';

export const WindowContext = createContext();

export function WindowProvider({ children }) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowContext.Provider value={windowSize}>
      {children}
    </WindowContext.Provider>
  );
}
