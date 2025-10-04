"use client";

import {
  AsteroidProvider,
  useAsteroid,
} from "../../src/components/AsteroidContext";
import { EarthScene } from "@/components/Earth";
import { Sidebar } from "@/components/Sidebar";
import { useEffect } from "react";

export default function Home() {
  return (
    <AsteroidProvider>
      <Content />
    </AsteroidProvider>
  );
}

function Content() {
  const { isSidebarOpen, fetchAsteroids } = useAsteroid();

  useEffect(() => {
    fetchAsteroids();
  }, []);

  return (
    <div className="relative h-screen">
      {isSidebarOpen && <Sidebar />}
      <div>
        <EarthScene />
      </div>
    </div>
  );
}
