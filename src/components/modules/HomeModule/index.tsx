import React, { useRef, useState } from "react";
import Map, { MapLayerMouseEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { GeoJSONSource, PointLike } from "mapbox-gl";
import { useHomeContext } from "@/components/contexts";
import { SelectRegionAlert } from "./module-elements/SelectRegionAlert";
import { CountryInterface } from "./interface";
import { Textarea } from "@/components/ui/textarea";

export const HomeModule = () => {
  const { toast } = useToast();
  const [source, setSource] = useState<CountryInterface | null>(null);
  const [destination, setDestination] = useState<CountryInterface | null>(null);
  const { pinpointType, setPinpointType, openSheet, setOpenSheet } =
    useHomeContext();

  const geojsonRef = useRef({
    type: "FeatureCollection" as any,
    features: [] as any,
  });

  const linestringRef = useRef({
    type: "Feature",
    geometry: {
      type: "LineString" as any,
      coordinates: [] as any,
    },
  });

  const onMapLoad = (e: MapLayerMouseEvent) => {
    const map = e.target;

    map.addSource("geojson", {
      type: "geojson",
      data: geojsonRef.current,
    });

    map.loadImage("https://i.imgur.com/kpYlg0p.png", (error, image) => {
      if (error || !image) throw error;
      const imageId = new Date().getTime();
      map.addImage(`custom-marker-${imageId}`, image);
      map.addLayer({
        id: "measure-points",
        type: "symbol",
        source: "geojson",
        layout: {
          "icon-image": `custom-marker-${imageId}`,
          "icon-size": 0.04,
          "icon-allow-overlap": true,
        },
        filter: ["in", "$type", "Point"],
      });
    });

    map.addLayer({
      id: "measure-lines",
      type: "line",
      source: "geojson",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#000",
        "line-width": 2.5,
      },
      filter: ["in", "$type", "LineString"],
    });
  };

  const addOrRemovePinpoint = (e: MapLayerMouseEvent) => {
    const map = e.target;

    const features = map.queryRenderedFeatures(e.point as PointLike, {
      layers: ["measure-points"],
    });

    if (geojsonRef.current.features.length > 1)
      geojsonRef.current.features.pop();

    if (features.length) {
      const id = features[0]?.properties?.id;
      geojsonRef.current.features = geojsonRef.current.features.filter(
        (point: any) => point?.properties?.id !== id
      );
    } else {
      const point = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        },
        properties: {
          id: String(new Date().getTime()),
        },
      };

      geojsonRef.current.features.push(point);
    }

    if (geojsonRef.current.features.length > 1) {
      linestringRef.current.geometry.coordinates =
        geojsonRef.current.features.map(
          (point: any) => point.geometry.coordinates
        );

      geojsonRef.current.features.push(linestringRef.current);
    }

    const source = map.getSource("geojson") as GeoJSONSource;

    source.setData(geojsonRef.current);

    const pointCount = geojsonRef.current.features.filter((feature: any) => {
      return feature.geometry.type === "Point";
    }).length;

    if (pointCount === 1) {
      setPinpointType("dest");
    }
    if (pointCount === 2) {
      setPinpointType("done");
    }
  };

  const onMapClick = async (e: MapLayerMouseEvent) => {
    addOrRemovePinpoint(e);
    getCountryByCoordinates(e);
  };

  const getCountryByCoordinates = async (e: MapLayerMouseEvent) => {
    try {
      const response = await axios({
        method: "GET",
        url: `https://api.opencagedata.com/geocode/v1/json?q=${e.lngLat.lat}+${e.lngLat.lng}&key=${process.env.NEXT_PUBLIC_OPEN_CAGE_DATA_API_KEY}`,
      });
      const { country, country_code } = response.data.results[0].components;
      if (!country) {
        toast({
          title: "Error!",
          description: "You can't pick regions of the ocean.",
          variant: "destructive",
        });
      } else {
        if (pinpointType === "src") {
          setSource({ name: country, code: country_code });
        } else {
          setDestination({ name: country, code: country_code });
        }
        toast({
          title: `Setting ${
            pinpointType === "src" ? "source" : "destination"
          } country:`,
          description: country,
          action: (
            <Image
              src={`https://flagcdn.com/48x36/${country_code}.png`}
              width={50}
              height={50}
              alt={`${country} flag`}
              quality={100}
            />
          ),
        });
      }
    } catch (err) {}
  };

  return (
    <div>
      <SelectRegionAlert />
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_API_KEY}
        initialViewState={{
          longitude: -100,
          zoom: 0,
          latitude: 40,
        }}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={(e) => {
          onMapClick(e);
        }}
        onLoad={(e) => {
          onMapLoad(e as any);
        }}
      />

      <Sheet
        open={openSheet}
        onOpenChange={() => {
          setOpenSheet(!openSheet);
        }}
      >
        <SheetContent side={"bottom"} className="flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle>Almost done...</SheetTitle>
            <SheetDescription>
              Tell your unique stories living abroad. Feel free to express
              yourself!
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col text-sm gap-3">
            <div className="flex flex-col gap-1">
              <span>You are from</span>
              <div className="flex items-center gap-2">
                <Image
                  src={`https://flagcdn.com/48x36/${source?.code}.png`}
                  width={40}
                  height={40}
                  alt={`${source?.name} flag`}
                  quality={100}
                />
                <span className="font-medium">{source?.name}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span>You are abroad in</span>
              <div className="flex items-center gap-2">
                <Image
                  src={`https://flagcdn.com/48x36/${destination?.code}.png`}
                  width={40}
                  height={40}
                  alt={`${destination?.name} flag`}
                  quality={100}
                />
                <span className="font-medium">{destination?.name}</span>
              </div>
            </div>
          </div>

          <Textarea placeholder="Type your message here." rows={10} />
        </SheetContent>
      </Sheet>
    </div>
  );
};
