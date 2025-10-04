import Bg from "@/components/Bg";
import Form from "../components/Form";
import { MapProvider } from "./maps/mapProvider";
import { EarthScene } from "@/components/Earth";
// <MapProvider>
{
  /*<Form />*/
}
{
  /*<Bg />*/
}
// </MapProvider>
export default function Home() {
  return (
    <div>
      <EarthScene />
    </div>
  );
}
