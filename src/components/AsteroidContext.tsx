"use client";
// Provider component
import { createContext, ReactNode, useContext, useState } from "react";
import { fetchAllDayData } from "../lib/nasaApi";
import { NeoFeedResponseEnhanced } from "../app/types";

// Create the context
const AsteroidContext = createContext({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  selectedAsteroidData: {},

  setAllSelectedAsteroidData: () => {},
  allSelectedAsteroidData: {},

  // fetches asteroids according to the data
  fetchAsteroids: () => {},

  // selected Date
  selectedDate: Date,
  setSelectedDate: (date: Date) => {},

  // selected neo_reference_id
  selectedNaoReferenceId: undefined,
  setSelectedNaoReferenceId: (id: string) => {},
});

type AsteroidProviderProps = {
  children: ReactNode;
};
// Provider component
export function AsteroidProvider({ children }: AsteroidProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allSelectedAsteroidData, setAllSelectedAsteroidData] =
    useState<NeoFeedResponseEnhanced | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedNaoReferenceId, setSelectedNaoReferenceId] = useState<
    string | undefined
  >(undefined);

  // Add a state for selectedAsteroidData
  const [selectedAsteroidData, setSelectedAsteroidData] = useState({});

  const toggleSidebar = () => {
    setIsSidebarOpen((p) => !p);
  };

  async function fetchAsteroids() {
    const data = await fetchAllDayData(selectedDate);
    setAllSelectedAsteroidData(data);
  }

  const value = {
    toggleSidebar,
    selectedDate,
    setSelectedDate,
    isSidebarOpen,
    setIsSidebarOpen,
    allSelectedAsteroidData,
    setAllSelectedAsteroidData,
    fetchAsteroids,
    selectedNaoReferenceId,
    setSelectedNaoReferenceId,
    selectedAsteroidData, // Add this property
    setSelectedAsteroidData: () => {}, // Add a no-op function for now
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
