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
import { useAuthContext, useHomeContext } from "@/components/contexts";
import { SelectRegionAlert } from "./module-elements/SelectRegionAlert";
import { CountryInterface } from "./interface";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/components/schemas/create-post.schema";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PostSheet } from "./module-elements";

export const HomeModule = () => {
  const { toast } = useToast();
  const [source, setSource] = useState<CountryInterface | null>(null);
  const [destination, setDestination] = useState<CountryInterface | null>(null);
  const {
    pinpointType,
    setPinpointType,
    openSheet,
    setOpenSheet,
    posts,
    getPosts,
    dataisReady,
    setOpenPostSheet,
    setPost,
  } = useHomeContext();
  const { zaxios, user, getUser } = useAuthContext();

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

    map.loadImage("https://img.icons8.com/?size=512&id=13800&format=png", (error, image) => {
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

    if (!map.getLayer("measure-line")) {
      map.addLayer({
        id: "measure-line",
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
    }

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

    posts?.map((post) => {
      const destinationPoint = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [post.destination_longitude, post.destination_latitude],
        },
        properties: {
          id: String(new Date().getTime()),
          userId: post.user.id,
          postId: post.id,
          isUserPost: post.user.id === user?.id,
        },
      };

      geojsonRef.current.features.push(destinationPoint);

      const source = map.getSource("geojson") as GeoJSONSource;
      source.setData(geojsonRef.current);
    });
  };

  const addOrRemovePinpoint = (e: MapLayerMouseEvent) => {
    if (!user?.has_posted) {
      const map = e.target;

      const features = map.queryRenderedFeatures(e.point as PointLike, {
        layers: ["measure-points"],
      });

      // check if a point is being added or removed
      const addingPoint = features.length === 0;

      if (addingPoint && pinpointType !== "done") {
        setCountryByCoordinates(e);

        const point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          },
          properties: {
            id: String(new Date().getTime()),
            userId: user?.id,
            type: pinpointType,
          },
        };

        geojsonRef.current.features.push(point);

        // If the type is 'dest', add a linestring feature between the source and destination points.
        if (pinpointType === "dest") {
          const srcPoint = geojsonRef.current.features.find(
              (feat: any) => feat.properties && feat.properties.type === "src"
          );

          if (!srcPoint) {
            toast({
              title: "Error",
              description: "Source point is missing. Please reselect the source point before choosing the destination.",
              variant: "destructive",
            });
            return;
          }

          linestringRef.current.geometry.coordinates = [
            srcPoint.geometry.coordinates,
            [e.lngLat.lng, e.lngLat.lat],
          ];

          geojsonRef.current.features.push(linestringRef.current);
        }

        // cycle between 'src', 'dest', and 'done'
        setPinpointType(pinpointType === "src" ? "dest" : "done");
      } else {
        // Reset points and linestring if either source or destination point is clicked.
        if (features[0]?.properties?.userId === user?.id) {
          geojsonRef.current.features = geojsonRef.current.features.filter(
              (point: any) =>
                  point.properties?.userId !== user?.id
          );

          linestringRef.current.geometry.coordinates = [];
          setPinpointType("src");
        }
      }

      const source = map.getSource("geojson") as GeoJSONSource;
      source.setData(geojsonRef.current);
    }
  };

  const getPostById = async (postId: string) => {
    try {
      const {
        data: { post },
      } = await zaxios({ method: "get", url: `/post/${postId}/` });
      setPost(post);
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while getting post",
        variant: "destructive",
      });
    }
  };

  const handleOpenPost = async (e: MapLayerMouseEvent) => {
    const map = e.target;
    const features = map.queryRenderedFeatures(e.point as PointLike, {
      layers: ["measure-points"],
    });
    const postId = features[0]?.properties?.postId;
    if (!!postId) {
      setOpenPostSheet(true);
      await getPostById(postId);
    }
  };

  const onMapClick = async (e: MapLayerMouseEvent) => {
    addOrRemovePinpoint(e);
    handleOpenPost(e);
  };

  const setCountryByCoordinates = async (e: MapLayerMouseEvent) => {
    try {
      const { lng: longitude, lat: latitude } = e.lngLat;
      const response = await axios({
        method: "GET",
        url: `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPEN_CAGE_DATA_API_KEY}`,
      });
      const { country, country_code } = response.data.results[0].components;
      if (!country) {
        toast({
          title: "Error!",
          description: "You can't pick regions of the ocean.",
          variant: "destructive",
        });

        // Reset points and linestring if the user clicked in the ocean.
        geojsonRef.current.features = geojsonRef.current.features.filter(
            (point: any) =>
                point.properties?.userId !== user?.id
        );

        linestringRef.current.geometry.coordinates = [];
        setPinpointType("src");

        // Reset map data
        const map = e.target;
        const source = map.getSource("geojson") as GeoJSONSource;
        source.setData(geojsonRef.current);

      } else {
        if (pinpointType === "src") {
          setSource({
            name: country,
            code: country_code,
            longitude,
            latitude,
          });
        } else {
          setDestination({
            name: country,
            code: country_code,
            longitude,
            latitude,
          });
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

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit = async (values: z.infer<typeof createPostSchema>) => {
    const finalValues = {
      ...values,
      source_latitude: source?.latitude,
      source_longitude: source?.longitude,
      destination_latitude: destination?.latitude,
      destination_longitude: destination?.longitude,
      source_country: source?.name,
      source_country_code: source?.code,
      destination_country: destination?.name,
      destination_country_code: destination?.code,
    };

    await createPost(finalValues);
  };

  const createPost = async (data: any) => {
    try {
      await zaxios({ method: "POST", url: "/post/add/", data }, true);
      setOpenSheet(false);
      toast({
        title: "Success!",
        description: "Successfully created post.",
      });
      setPinpointType("src");
      await getUser();
      await getPosts();
    } catch (err) {
      toast({
        title: "Error!",
        description: "Error while creating post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (dataisReady)
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

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                      <span className="font-[500]">{source?.name}</span>
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
                      <span className="font-[500]">{destination?.name}</span>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end">
                  <Button type="submit" disabled={!form.formState.isValid}>
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>

        <PostSheet />
      </div>
    );

  return <div>Loading...</div>;
};
