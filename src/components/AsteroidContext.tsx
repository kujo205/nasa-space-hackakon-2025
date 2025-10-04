"use client";
// Provider component
import { createContext, useContext, useState } from "react";

// Create the context
const AsteroidContext = createContext({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  selectedAsteroidData: null,
  setSelectedAsteroidData: () => {},
});

// Provider component
export function AsteroidProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAsteroidData, setSelectedAsteroidData] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((p) => !p);
  };

  console.log("isSidebarOpen:", isSidebarOpen);

  const value = {
    toggleSidebar,
    isSidebarOpen,
    setIsSidebarOpen,
    selectedAsteroidData,
    setSelectedAsteroidData,
  };

  return (
    <AsteroidContext.Provider value={value}>
      {children}
    </AsteroidContext.Provider>
  );
}

// Custom hook to use the context
export function useAsteroid() {
  const context = useContext(AsteroidContext);
  if (context === undefined) {
    throw new Error("useAsteroid must be used within an AsteroidProvider");
  }
  return context;
}

// Export the context for advanced use cases
export default AsteroidContext;
// Custom hook to use the context
