"use client";

import {
  AsteroidProvider,
  useAsteroid,
} from "../../src/components/AsteroidContext";
import { UniverseScene } from "@/components/UniverseScene";
import { Sidebar } from "@/components/Sidebar";
import { useEffect } from "react";
import { DaySelect } from "@/components/DaySelect";

export default function Home() {
  return (
    <AsteroidProvider>
      <Content />
    </AsteroidProvider>
  );
}

function Content() {
  const { isSidebarOpen, selectedDate, fetchAsteroids } = useAsteroid();

  useEffect(() => {
    fetchAsteroids();
  }, [selectedDate]);

  return (
    <div className="relative h-screen">
      {isSidebarOpen && <Sidebar />}
      <div>
        <UniverseScene />
      </div>

      <DaySelect />
    </div>
  );
}
