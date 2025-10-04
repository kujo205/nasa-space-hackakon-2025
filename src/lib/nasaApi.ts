import {
  SBDBResponse,
  NeoFeedResponse,
  NeoFeedResponseEnhanced,
} from "../app/types";
import PQueue from "p-queue";

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

export async function fetchAllDayData(data: Date) {
  const dayData = await fetchDayData(data);
  const response: NeoFeedResponseEnhanced = dayData;
  response.final_data = [];

  const formattedDate = formatData(data);

  const queue = new PQueue({ concurrency: 3 });

  for (const item of dayData.near_earth_objects[formattedDate]) {
    queue.add(async () => {
      const res = await fetchSBDBData(item.neo_reference_id);

      res.neo_reference_id = item.neo_reference_id;

      item.nasa_jpl_data = res;

      response.final_data.push(res);
    });
  }

  await queue.onIdle();

  console.log("result", response);

  return response;
}

async function fetchDayData(date: Date) {
  const apiKey = NASA_API_KEY;
  const formattedDate = formatData(date);
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedDate}&end_date=${formattedDate}&api_key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  const data = await response.json();
  return data as NeoFeedResponse;
}

async function fetchSBDBData(sstr: string) {
  const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?alt-des=1&alt-orbits=1&ca-data=1&ca-time=both&ca-tunc=both&cd-epoch=1&cd-tp=1&discovery=1&full-prec=1&nv-fmt=both&orbit-defs=1&phys-par=1&r-notes=1&r-observer=1&radar-obs=1&sat=1&sstr=${sstr}&vi-data=1&www=1`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  const data = await response.json();
  return data as SBDBResponse;
}

function formatData(date: Date) {
  return date.toISOString().split("T")[0];
}

export function getNasaJplDataArray(response: NeoFeedResponseEnhanced): any[] {
  const nasaJplDataArray: any[] = [];

  if (
    response.near_earth_objects &&
    typeof response.near_earth_objects === "object"
  ) {
    const firstKey = Object.keys(response.near_earth_objects)[0]; // Get the first key

    if (response.near_earth_objects[firstKey]) {
      for (const item of response.near_earth_objects[firstKey]) {
        if (item.nasa_jpl_data) {
          nasaJplDataArray.push(item.nasa_jpl_data);
        }
      }
    }
  }

  return nasaJplDataArray;
}
