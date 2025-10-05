"use client";

import React, { useState } from "react";
import { AlertTriangle, Target, Info, Flame, Waves, Wind } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NeoObject } from "@/app/types";

interface AsteroidCalculatorProps {
  data: NeoObject;
}

const DENSITY_PRESETS = [
  {
    label: "Ice (Comet)",
    value: 0.92,
    description: "Frozen water/comet material",
  },
  {
    label: "Porous Rock (Pumice)",
    value: 1.5,
    description: "Low density volcanic",
  },
  {
    label: "Carbon (Graphite)",
    value: 2.1,
    description: "Carbonaceous asteroid",
  },
  {
    label: "Stony (Silicate)",
    value: 2.5,
    description: "Most common asteroids",
  },
  { label: "Dense Rock (Basalt)", value: 2.9, description: "Volcanic rock" },
  { label: "Iron", value: 7.8, description: "Metallic asteroid" },
  { label: "Nickel-Iron", value: 8.0, description: "Dense metallic core" },
];

const AsteroidImpactCalculator = ({ data }: AsteroidCalculatorProps) => {
  const [asteroidData, setAsteroidData] = useState(null);
  const [impactAnalysis, setImpactAnalysis] = useState(null);
  const [densityAssumption, setDensityAssumption] = useState(2.5);
  const [impactAngle, setImpactAngle] = useState(45);
  const [distanceKm, setDistanceKm] = useState(200);

  console.log("data", data);

  // const sampleData = {
  //   name: "(2015 KT120)",
  //   estimated_diameter: {
  //     kilometers: {
  //       estimated_diameter_min: 0.0253837029,
  //       estimated_diameter_max: 0.0567596853,
  //     },
  //   },
  //   close_approach_data: [
  //     {
  //       close_approach_date_full: "2025-Oct-03 04:07",
  //       relative_velocity: { kilometers_per_second: "11.569203976" },
  //       miss_distance: {
  //         astronomical: "0.266230725",
  //         kilometers: "39827549.38855575",
  //       },
  //     },
  //   ],
  //   absolute_magnitude_h: 25.1,
  // };

  const calculateImpactScenario = (
    data: NeoObject,
    density,
    angle,
    distance,
  ) => {
    console.log("data", data);

    // Constants
    const G_EARTH = 9.81; // m/s²
    const R_EARTH = 6371000; // m
    const H_SCALE = 8000; // m (atmospheric scale height)
    const RHO_0 = 1.0; // kg/m³ (surface atmospheric density)
    const C_D = 2.0; // drag coefficient

    // Get diameter in meters
    const diameterMin =
      data.estimated_diameter.kilometers.estimated_diameter_min * 1000;
    const diameterMax =
      data.estimated_diameter.kilometers.estimated_diameter_max * 1000;
    const L0 = (diameterMin + diameterMax) / 2; // L₀

    // Get velocity
    const v0_kmps = parseFloat(
      data.close_approach_data[0].relative_velocity.kilometers_per_second,
    );
    const v0 = v0_kmps * 1000; // m/s

    // Convert angle to radians
    const theta = (angle * Math.PI) / 180;

    // Target density (assumed crystalline rock)
    const rho_t = 2750; // kg/m³
    const rho_i = density * 1000; // kg/m³

    // Equation 1*: Impact energy before atmospheric entry
    const E_joules = (Math.PI / 12) * rho_i * Math.pow(L0, 3) * Math.pow(v0, 2);
    const E_megatons = E_joules / 4.184e15;

    // Equation 3*: Recurrence interval
    const T_RE = 109 * Math.pow(E_megatons, 0.78);

    // Equation 9*: Impactor strength (empirical)
    const Y_i = Math.pow(10, 2.107 + 0.0624 * rho_i); // Pa

    // Equation 12*: Breakup parameter
    const I_f =
      (4.07 * C_D * H_SCALE * Y_i) /
      (rho_i * L0 * Math.pow(v0, 2) * Math.sin(theta));

    let atmosphericEntry = {};
    const L_impact = L0;
    const v_impact = v0;

    if (I_f < 1 && L0 < 1000) {
      // Breakup occurs - Equation 11*
      const z_star =
        -H_SCALE *
        Math.log(Y_i / (RHO_0 * Math.pow(v0, 2))) *
        (1.308 + 0.314 * I_f - 1.303 * (1 - I_f));

      // Equation 16*: Dispersion length scale
      const l =
        L0 *
        Math.sin(theta) *
        Math.sqrt(rho_i / (C_D * RHO_0 * Math.exp(-z_star / H_SCALE)));

      // Equation 18*: Airburst altitude
      const f_p = 7; // pancake factor
      const z_b =
        z_star -
        2 *
          H_SCALE *
          Math.log(1 + (l / (2 * H_SCALE)) * (Math.pow(f_p, 2) - 1));

      atmosphericEntry = {
        breakupOccurs: true,
        breakupAltitude: z_star,
        airburstAltitude: z_b > 0 ? z_b : null,
        formsCreater: z_b <= 0,
      };

      if (z_b > 0) {
        // Airburst - no crater
        return {
          ...atmosphericEntry,
          energy: { joules: E_joules, megatonsTNT: E_megatons },
          recurrenceInterval: T_RE,
          severity: "Airburst",
          description: "Asteroid breaks up in atmosphere, no crater formed",
        };
      }
    } else {
      atmosphericEntry = {
        breakupOccurs: false,
        formsCreater: true,
        penetratesAtmosphere: "Object reaches surface intact",
      };
    }

    // Equation 21*: Transient crater diameter
    const D_tc =
      1.161 *
      Math.pow(rho_i / rho_t, 1 / 3) *
      Math.pow(L_impact, 0.78) *
      Math.pow(v_impact, 0.44) *
      Math.pow(G_EARTH, -0.22) *
      Math.pow(Math.sin(theta), 1 / 3);

    // Equation 25*: Transient crater depth
    const d_tc = D_tc / (2 * Math.sqrt(2));

    // Determine if simple or complex crater
    const isComplex = D_tc > 2.56;
    let D_fr, d_fr;

    if (isComplex) {
      // Equation 27*: Complex crater final diameter
      const D_c = 3.2; // transition diameter in km
      const D_tc_km = D_tc / 1000;
      D_fr = (1.17 * Math.pow(D_tc_km, 1.13)) / Math.pow(D_c, 0.13);
      D_fr = D_fr * 1000; // convert back to meters

      // Equation 28*: Complex crater depth
      d_fr = 0.4 * Math.pow(D_fr / 1000, 0.3) * 1000;
    } else {
      // Equation 22*: Simple crater final diameter
      D_fr = 1.25 * D_tc;

      // Equation 23*: Breccia lens volume
      const V_br = 0.032 * Math.pow(D_fr, 3);

      // Equation 48*: Final rim height
      const h_fr = (0.07 * Math.pow(D_tc, 4)) / Math.pow(D_fr, 3);

      // Equation 24*: Breccia lens thickness
      const t_br =
        (2.8 * V_br * (d_tc + h_fr)) / (d_tc * Math.pow(D_fr / 2, 2));

      // Equation 26*: Final crater depth
      d_fr = d_tc + h_fr - t_br;
    }

    // Equation 30*: Impact melt volume
    const V_m = 8.9e-12 * E_joules * Math.sin(theta);

    // Equation 31*: Melt thickness
    const t_m = (4 * V_m) / (Math.PI * Math.pow(D_tc, 2));

    // THERMAL RADIATION (if velocity > 15 km/s)
    let thermalEffects = null;
    if (v0_kmps > 15) {
      // Equation 32*: Fireball radius
      const R_f = 0.002 * Math.pow(E_joules, 1 / 3);

      // Equation 33*: Time of maximum radiation
      const T_t = R_f / v_impact;

      const r = distance * 1000; // convert to meters
      const epicentralAngle = r / R_EARTH;

      // Check if fireball is visible
      const h = (1 - Math.cos(epicentralAngle)) * R_EARTH;
      let f = 1;

      if (h > 0 && h < R_f) {
        const gamma = Math.acos(h / R_f);
        f = (2 / Math.PI) * (gamma - (h / R_f) * Math.sin(gamma));
      } else if (h >= R_f) {
        f = 0;
      }

      // Equation 34*: Thermal exposure
      const kappa = 3e-3; // luminous efficiency
      const theta_exposure =
        (kappa * E_joules) / (2 * Math.PI * Math.pow(r, 2));
      const corrected_exposure = f * theta_exposure;

      // Equation 35*: Duration of irradiation
      const sigma = 5.67e-8;
      const T_star = 3000;
      const tau_t =
        (kappa * E_joules) /
        (2 * Math.PI * Math.pow(R_f, 2) * sigma * Math.pow(T_star, 4));

      // Equation 39*: Ignition thresholds (scaled by energy)
      const ignitionThresholds = {
        thirdDegreeBurns: 0.42 * Math.pow(E_megatons, 1 / 6),
        secondDegreeBurns: 0.25 * Math.pow(E_megatons, 1 / 6),
        firstDegreeBurns: 0.13 * Math.pow(E_megatons, 1 / 6),
        clothing: 1.0 * Math.pow(E_megatons, 1 / 6),
        deciduousTrees: 0.25 * Math.pow(E_megatons, 1 / 6),
        grass: 0.38 * Math.pow(E_megatons, 1 / 6),
      };

      thermalEffects = {
        fireballRadius: R_f,
        exposureMJm2: corrected_exposure / 1e6,
        duration: tau_t,
        ignitionThresholds,
        burns:
          corrected_exposure / 1e6 > ignitionThresholds.thirdDegreeBurns
            ? "Third degree"
            : corrected_exposure / 1e6 > ignitionThresholds.secondDegreeBurns
              ? "Second degree"
              : corrected_exposure / 1e6 > ignitionThresholds.firstDegreeBurns
                ? "First degree"
                : "None",
        ignition: corrected_exposure / 1e6 > ignitionThresholds.deciduousTrees,
      };
    }

    // SEISMIC EFFECTS
    // Equation 40*: Seismic magnitude
    const M = 0.67 * Math.log10(E_joules) - 5.87;

    const r_km = distance;
    let M_eff;

    // Equation 41*: Effective seismic magnitude
    if (r_km < 60) {
      M_eff = M - 0.0238 * r_km;
    } else if (r_km < 700) {
      M_eff = M - 0.0048 * r_km - 1.1644;
    } else {
      M_eff = M - 1.66 * Math.log10(r_km / R_EARTH) - 6.399;
    }

    // Equation 42*: Seismic arrival time
    const T_s = r_km / 5;

    // EJECTA
    // Equation 47*: Ejecta thickness
    const r_m = distance * 1000;
    const t_e = Math.pow(D_tc, 4) / (112 * Math.pow(r_m, 3));

    // Equation 52*: Ejection velocity (simplified)
    const epicentral = r_m / R_EARTH;
    const v_e = Math.sqrt(
      (2 * G_EARTH * R_EARTH * Math.tan(epicentral / 2)) /
        (1 + Math.tan(epicentral / 2)),
    );

    // AIR BLAST
    // Equation 57*: Scaled distance for 1 kt
    const E_kt = E_megatons * 1000;
    const r_1 = r_m / Math.pow(E_kt, 1 / 3);

    // Equation 54*: Peak overpressure
    const p_x = 75000;
    const r_x = 290;
    const p =
      p_x * (Math.pow(r_x / (4 * r_1), 1) * (1 + 3 * Math.pow(r_x / r_1, 1.3)));

    // Equation 59*: Maximum wind velocity
    const P_0 = 1e5;
    const c_0 = 330;
    const u =
      ((5 * p) / (7 * P_0)) * c_0 * Math.sqrt(1 / (1 + (6 * p) / (7 * P_0)));

    // Equation 64*: Blast arrival time
    const T_b = r_m / c_0;

    let severity, description;
    if (E_megatons < 0.01) {
      severity = "Minimal";
      description = "Airburst or surface impact with minimal effects";
    } else if (E_megatons < 1) {
      severity = "Local";
      description = "Significant local destruction";
    } else if (E_megatons < 100) {
      severity = "Regional";
      description = "Major regional catastrophe";
    } else if (E_megatons < 10000) {
      severity = "Continental";
      description = "Continental-scale devastation";
    } else {
      severity = "Global";
      description = "Mass extinction event";
    }

    return {
      diameter: { min: diameterMin, max: diameterMax, average: L0 },
      velocity: { kmPerSec: v0_kmps, mPerSec: v0 },
      angle: angle,
      density: density,
      energy: { joules: E_joules, megatonsTNT: E_megatons },
      recurrenceInterval: T_RE,
      atmosphericEntry,
      crater: {
        transientDiameter: D_tc,
        finalDiameter: D_fr,
        depth: d_fr,
        type: isComplex ? "Complex" : "Simple",
        meltVolume: V_m,
        meltThickness: t_m,
      },
      thermalEffects,
      seismic: {
        magnitude: M,
        effectiveMagnitude: M_eff,
        arrivalTime: T_s,
        mercalliIntensity:
          M_eff < 2
            ? "I"
            : M_eff < 3
              ? "I-II"
              : M_eff < 4
                ? "III-IV"
                : M_eff < 5
                  ? "IV-V"
                  : M_eff < 6
                    ? "VI-VII"
                    : M_eff < 7
                      ? "VII-VIII"
                      : M_eff < 8
                        ? "IX-X"
                        : M_eff < 9
                          ? "X-XI"
                          : "XII",
      },
      ejecta: {
        thickness: t_e,
        ejectionVelocity: v_e,
      },
      airBlast: {
        overpressure: p,
        overpressureBars: p / 1e5,
        windSpeed: u,
        arrivalTime: T_b,
      },
      severity,
      description,
      distanceKm: distance,
    };
  };

  const handleCalculate = () => {
    setAsteroidData(data);
    const analysis = calculateImpactScenario(
      data,
      densityAssumption,
      impactAngle,
      distanceKm,
    );
    setImpactAnalysis(analysis);
  };

  const getSeverityVariant = (severity) => {
    const variants = {
      Minimal: "default",
      Local: "secondary",
      Regional: "outline",
      Continental: "destructive",
      Global: "destructive",
      Airburst: "default",
    };
    return variants[severity] || "default";
  };

  const DataPoint = ({ label, value, subtext, variant = "default" }) => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`text-2xl font-bold ${
          variant === "primary"
            ? "text-primary"
            : variant === "destructive"
              ? "text-destructive"
              : variant === "warning"
                ? "text-yellow-600 dark:text-yellow-500"
                : ""
        }`}
      >
        {value.toFixed ? value.toFixed(2) : value}
      </p>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </div>
  );

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4">
        <CardHeader className="px-4 py-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <CardTitle className="text-xl">
                Scientific Impact Calculator
              </CardTitle>
              <CardDescription>
                Based on Earth Impact Effects Program equations{" "}
                <a
                  target="_blank"
                  href="https://impact.ese.ic.ac.uk/ImpactEarth/ImpactEffects/effects.pdf"
                >
                  <Button className="!px-1 !py-1" variant="link">
                    (link to the paper)
                  </Button>
                </a>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <Label htmlFor="density">Asteroid Density</Label>
                  <Select
                    value={densityAssumption.toString()}
                    onValueChange={(value) =>
                      setDensityAssumption(parseFloat(value))
                    }
                  >
                    <SelectTrigger id="density">
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DENSITY_PRESETS.map((preset) => (
                        <SelectItem
                          key={preset.label}
                          value={preset.value.toString()}
                        >
                          <div className="flex items-start flex-col">
                            <span className="font-medium">{preset.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {preset.value} g/cm³ - {preset.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="angle">
                    Impact Angle (degrees from horizontal)
                  </Label>
                  <Input
                    id="angle"
                    type="number"
                    min="0"
                    max="90"
                    value={impactAngle}
                    onChange={(e) => setImpactAngle(parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance from Impact (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="1"
                    max="10000"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full" size="lg">
                Calculate Impact Effects
              </Button>
            </CardContent>
          </Card>

          {impactAnalysis && (
            <div className="space-y-6">
              <Alert
                variant={
                  getSeverityVariant(impactAnalysis.severity) === "destructive"
                    ? "destructive"
                    : "default"
                }
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-xl">
                  {impactAnalysis.severity} Impact Event
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-base">{impactAnalysis.description}</p>
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="physical" className="w-full">
                <TabsList className="grid w-full h-full grid-cols-2 lg:grid-cols-5">
                  <TabsTrigger value="physical">
                    <Target className="h-4 w-4 mr-2" />
                    Physical
                  </TabsTrigger>
                  <TabsTrigger value="crater">Crater</TabsTrigger>
                  <TabsTrigger value="thermal">
                    <Flame className="h-4 w-4 mr-2" />
                    Thermal
                  </TabsTrigger>
                  <TabsTrigger value="seismic">
                    <Waves className="h-4 w-4 mr-2" />
                    Seismic
                  </TabsTrigger>
                  <TabsTrigger value="blast">
                    <Wind className="h-4 w-4 mr-2" />
                    Air Blast
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="physical" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Physical Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <DataPoint
                          label="Diameter"
                          value={`${impactAnalysis.diameter.average.toFixed(1)} m`}
                          subtext={`Range: ${impactAnalysis.diameter.min.toFixed(1)} - ${impactAnalysis.diameter.max.toFixed(1)} m`}
                          variant="primary"
                        />
                        <DataPoint
                          label="Mass"
                          value={`${(((Math.PI / 6) * impactAnalysis.density * 1000 * Math.pow(impactAnalysis.diameter.average, 3)) / 1e9).toFixed(2)} M kg`}
                          subtext={`${((Math.PI / 6) * impactAnalysis.density * 1000 * Math.pow(impactAnalysis.diameter.average, 3)).toExponential(2)} kg`}
                          variant="primary"
                        />
                        <DataPoint
                          label="Impact Velocity"
                          value={`${impactAnalysis.velocity.kmPerSec.toFixed(2)} km/s`}
                          subtext={`${impactAnalysis.velocity.mPerSec.toLocaleString()} m/s`}
                          variant="warning"
                        />
                        <DataPoint
                          label="Kinetic Energy"
                          value={`${impactAnalysis.energy.megatonsTNT.toFixed(2)} Mt`}
                          subtext={`${impactAnalysis.energy.joules.toExponential(2)} Joules`}
                          variant="destructive"
                        />
                        <DataPoint
                          label="Impact Angle"
                          value={`${impactAnalysis.angle}°`}
                          subtext="from horizontal"
                        />
                        <DataPoint
                          label="Density"
                          value={`${impactAnalysis.density} g/cm³`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="crater" className="space-y-4">
                  {impactAnalysis.crater ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Crater Formation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          <DataPoint
                            label="Crater Type"
                            value={impactAnalysis.crater.type}
                          />
                          <DataPoint
                            label="Final Diameter"
                            value={`${(impactAnalysis.crater.finalDiameter / 1000).toFixed(2)} km`}
                            variant="primary"
                          />
                          <DataPoint
                            label="Crater Depth"
                            value={`${impactAnalysis.crater.depth.toFixed(0)} m`}
                          />
                          <DataPoint
                            label="Melt Volume"
                            value={impactAnalysis.crater.meltVolume.toExponential(
                              2,
                            )}
                            subtext="m³"
                          />
                          <DataPoint
                            label="Melt Thickness"
                            value={`${impactAnalysis.crater.meltThickness.toFixed(2)} m`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Crater Formed</AlertTitle>
                      <AlertDescription>
                        This impact scenario results in an airburst with no
                        crater formation.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="thermal" className="space-y-4">
                  {impactAnalysis.thermalEffects ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Flame className="h-5 w-5" />
                          Thermal Radiation at {impactAnalysis.distanceKm} km
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          <DataPoint
                            label="Fireball Radius"
                            value={`${(impactAnalysis.thermalEffects.fireballRadius / 1000).toFixed(2)} km`}
                            variant="warning"
                          />
                          <DataPoint
                            label="Thermal Exposure"
                            value={`${impactAnalysis.thermalEffects.exposureMJm2.toFixed(2)} MJ/m²`}
                          />
                          <DataPoint
                            label="Burns"
                            value={impactAnalysis.thermalEffects.burns}
                            variant={
                              impactAnalysis.thermalEffects.burns !== "None"
                                ? "destructive"
                                : "default"
                            }
                          />
                          <DataPoint
                            label="Ignition"
                            value={
                              impactAnalysis.thermalEffects.ignition
                                ? "Trees/grass ignite"
                                : "No ignition"
                            }
                            variant={
                              impactAnalysis.thermalEffects.ignition
                                ? "destructive"
                                : "default"
                            }
                          />
                          <DataPoint
                            label="Duration"
                            value={`${impactAnalysis.thermalEffects.duration.toFixed(1)} s`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Thermal Effects</AlertTitle>
                      <AlertDescription>
                        Thermal radiation effects only occur for velocities
                        above 15 km/s.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="seismic" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Waves className="h-5 w-5" />
                        Seismic Effects at {impactAnalysis.distanceKm} km
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <DataPoint
                          label="Richter Magnitude"
                          value={impactAnalysis.seismic.magnitude.toFixed(1)}
                          variant="warning"
                        />
                        <DataPoint
                          label="Effective Magnitude"
                          value={impactAnalysis.seismic.effectiveMagnitude.toFixed(
                            1,
                          )}
                        />
                        <DataPoint
                          label="Mercalli Intensity"
                          value={impactAnalysis.seismic.mercalliIntensity}
                          variant="destructive"
                        />
                        <DataPoint
                          label="Arrival Time"
                          value={`${impactAnalysis.seismic.arrivalTime.toFixed(1)} s`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blast" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5" />
                        Air Blast at {impactAnalysis.distanceKm} km
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <DataPoint
                          label="Peak Overpressure"
                          value={`${impactAnalysis.airBlast.overpressureBars.toFixed(3)} bars`}
                          subtext={`${impactAnalysis.airBlast.overpressure.toFixed(0)} Pa`}
                          variant="destructive"
                        />
                        <DataPoint
                          label="Max Wind Speed"
                          value={`${impactAnalysis.airBlast.windSpeed.toFixed(0)} m/s`}
                          variant="warning"
                        />
                        <DataPoint
                          label="Arrival Time"
                          value={`${impactAnalysis.airBlast.arrivalTime.toFixed(0)} s`}
                        />
                        <div className="md:col-span-2 lg:col-span-3">
                          <Badge
                            variant={
                              impactAnalysis.airBlast.overpressureBars > 0.27
                                ? "destructive"
                                : impactAnalysis.airBlast.overpressureBars > 0.1
                                  ? "outline"
                                  : "secondary"
                            }
                            className="text-base py-2 px-4"
                          >
                            {impactAnalysis.airBlast.overpressureBars > 0.8
                              ? "Buildings collapse"
                              : impactAnalysis.airBlast.overpressureBars > 0.27
                                ? "Severe structural damage"
                                : impactAnalysis.airBlast.overpressureBars > 0.1
                                  ? "Moderate damage"
                                  : impactAnalysis.airBlast.overpressureBars >
                                      0.007
                                    ? "Windows shatter"
                                    : "Minimal damage"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>
                  Based on Earth Impact Effects Program equations
                  <a
                    target="_blank"
                    href="https://impact.ese.ic.ac.uk/ImpactEarth/ImpactEffects/effects.pdf"
                  >
                    <Button className="!px-1 !py-1" variant="link">
                      (link to the paper)
                    </Button>
                  </a>
                </AlertTitle>
                <AlertDescription>
                  All calculations use published equations from the Earth Impact
                  Effects Program. Equations marked with * in the paper are
                  directly implemented. Results are first-order approximations -
                  actual effects depend on local geology, construction quality,
                  and atmospheric conditions.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default AsteroidImpactCalculator;
