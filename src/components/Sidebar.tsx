import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Shield,
  Globe,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAsteroid } from "@/components/AsteroidContext";
import AsteroidImpactCalculator from "@/components/AsteroidImpactCalculator";

interface MitigationStrategy {
  name: string;
  description: string;
}

interface SidebarProps {
  asteroidData?: {
    diameter?: number;
    velocity?: number;
    closestApproach?: string;
    missDistance?: number;
    hazardous?: boolean;
  };
  impactLinks?: {
    usgs?: string;
    impactEarth?: string;
  };
  mitigationStrategies?: MitigationStrategy[];
  recommendedStrategy?: string;
  author?: string;
}

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2 font-medium">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function Sidebar({
  asteroidData = {
    diameter: 250,
    velocity: 18.5,
    closestApproach: "2025-12-15, 14:30 UTC",
    missDistance: 0.002,
    hazardous: true,
  },
  impactLinks = {
    usgs: "https://www.usgs.gov/products/data-and-tools",
    impactEarth: "https://impact.ese.ic.ac.uk/ImpactEarth/cgi-bin/impact.cgi",
  },
  mitigationStrategies = [
    {
      name: "Kinetic Impactor Mission",
      description: "Launch window: 2028-2030",
    },
    {
      name: "Gravity Tractor",
      description: "Required lead time: 10+ years",
    },
    {
      name: "Nuclear Deflection",
      description: "Last resort option",
    },
  ],
  recommendedStrategy = "Kinetic impactor with 94% success probability. Mission cost: $2.5B USD",
  author = "Mariia Kryvokhata",
}: SidebarProps) {
  const { setIsSidebarOpen, selectedNaoReferenceId, allSelectedAsteroidData } =
    useAsteroid();

  const neoObject = Object.entries(
    allSelectedAsteroidData?.near_earth_objects,
  )[0][1].find((obj) => obj.neo_reference_id === selectedNaoReferenceId);

  return (
    <div className="absolute left-3 top-10 w-[464px] z-10 max-h-[calc(100vh-6rem)]">
      <div className="flex justify-end -translate-y-6">
        <Button onClick={() => setIsSidebarOpen(false)} variant="ghost">
          <X></X>
        </Button>
      </div>

      <div className="bg-background max-h-[80vh] overflow-y-auto border rounded-lg shadow-lg">
        <CollapsibleSection title="Asteroid Data">
          <div className="space-y-2 text-sm">
            <div className="space-y-1">
              <p>
                <span className="font-medium">Diameter:</span>{" "}
                {asteroidData.diameter} m
              </p>
              <p>
                <span className="font-medium">Velocity:</span>{" "}
                {asteroidData.velocity} km/s
              </p>
              <p>
                <span className="font-medium">Closest Approach:</span>{" "}
                {asteroidData.closestApproach}
              </p>
              <p>
                <span className="font-medium">Miss Distance:</span>{" "}
                {asteroidData.missDistance} AU
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Hazardous:</span>
                <Badge
                  variant={asteroidData.hazardous ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {asteroidData.hazardous ? "Yes" : "No"}
                </Badge>
              </p>
            </div>
          </div>
        </CollapsibleSection>
        {/* Impact Section */}
        <CollapsibleSection title="Impact" icon={<Globe className="w-4 h-4" />}>
          <AsteroidImpactCalculator data={neoObject} />
        </CollapsibleSection>
        {/* Mitigation Section */}
        <CollapsibleSection
          title="Mitigation"
          icon={<Shield className="w-4 h-4" />}
        >
          <div className="space-y-3 text-sm">
            <div className="space-y-2">
              {mitigationStrategies.map((strategy, index) => (
                <div key={index} className="p-2 border rounded">
                  <p className="font-medium">{strategy.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {strategy.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs font-medium">Recommended Strategy:</p>
              <p className="text-xs text-muted-foreground mt-1">
                {recommendedStrategy}
              </p>
            </div>
            <p className="text-xs text-muted-foreground pt-2">{author}</p>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
