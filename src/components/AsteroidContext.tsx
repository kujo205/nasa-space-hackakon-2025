"use client";
// Provider component
import { createContext, useContext, useState } from "react";
import { fetchAllDayData } from "../lib/nasaApi";
import { NeoFeedResponseEnhanced } from "../app/types";

// Create the context
const AsteroidContext = createContext({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  selectedAsteroidData: {},
  setSelectedAsteroidData: () => {},
  fetchAsteroids: () => {},
});

// Provider component
export function AsteroidProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAsteroidData, setSelectedAsteroidData] =
    useState<NeoFeedResponseEnhanced>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleSidebar = () => {
    setIsSidebarOpen((p) => !p);
  };

  async function fetchAsteroids() {
    const data = await fetchAllDayData(selectedDate);
    console.log("fetchTodayAsteroids data:", data);
    setSelectedAsteroidData(data);
  }

  console.log("isSidebarOpen:", isSidebarOpen);

  const value = {
    toggleSidebar,
    selectedDate,
    setSelectedDate,
    isSidebarOpen,
    setIsSidebarOpen,
    selectedAsteroidData,
    setSelectedAsteroidData,
    fetchAsteroids,
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
