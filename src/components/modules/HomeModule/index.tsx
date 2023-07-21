import React, { useState } from "react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { GeoJSONSource, PointLike } from "mapbox-gl";

export const HomeModule = () => {
  const { toast } = useToast();
  const [pinpointType, setPinpointType] = useState<"src" | "dest">("src");
  const [pinpointCount, setPinpointCount] = useState<number>(0);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const geojson = {
    type: "FeatureCollection" as any,
    features: [] as any,
  };

  const linestring = {
    type: "Feature",
    geometry: {
      type: "LineString" as any,
      coordinates: [] as any,
    },
  };

  const onMapLoad = (e: MapLayerMouseEvent) => {
    const map = e.target;

    map.addSource("geojson", {
      type: "geojson",
      data: geojson,
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

    const pinpointCount = map.queryRenderedFeatures(undefined, {
      layers: ["measure-points"],
    })?.length;

    if (pinpointCount === 1) {
      setOpenSheet(true);
    }

    const features = map.queryRenderedFeatures(e.point as PointLike, {
      layers: ["measure-points"],
    });

    if (geojson.features.length > 1) geojson.features.pop();

    if (features.length) {
      const id = features[0]?.properties?.id;
      geojson.features = geojson.features.filter(
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

      geojson.features.push(point);
    }

    if (geojson.features.length > 1) {
      linestring.geometry.coordinates = geojson.features.map(
        (point: any) => point.geometry.coordinates
      );

      geojson.features.push(linestring);
    }

    const source = map.getSource("geojson") as GeoJSONSource;

    source.setData(geojson);
  };

  const onMapClick = async (e: MapLayerMouseEvent) => {
    addOrRemovePinpoint(e);

    // try {
    //   const response = await axios({
    //     method: "GET",
    //     url: `https://api.opencagedata.com/geocode/v1/json?q=${e.lngLat.lat}+${e.lngLat.lng}&key=${process.env.NEXT_PUBLIC_OPEN_CAGE_DATA_API_KEY}`,
    //   });

    //   const { country, country_code } = response.data.results[0].components;
    //   if (!country) {
    //     toast({
    //       title: "Error!",
    //       description: "You can't pick regions of the ocean.",
    //       variant: "destructive",
    //     });
    //   } else {
    //     toast({
    //       title: "Setting source country:",
    //       description: country,
    //       action: (
    //         <Image
    //           src={`https://flagcdn.com/48x36/${country_code}.png`}
    //           width={50}
    //           height={50}
    //           alt={`${country} flag`}
    //           quality={100}
    //         />
    //       ),
    //     });
    //   }
    // } catch (err) {}
  };

  return (
    <div>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_API_KEY}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 0,
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

      <Sheet open={openSheet} onOpenChange={() => setOpenSheet(!openSheet)}>
        <SheetContent side={"bottom"}>
          <SheetHeader>
            <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
