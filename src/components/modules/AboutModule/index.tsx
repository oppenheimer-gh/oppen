import { Badge } from "@/components/ui/badge";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";

export const AboutModule = () => {
  return (
    <section className="flex flex-col gap-6 items-center justify-center px-16 py-8">
      <h1 className="font-semibold text-xl">
        <span className="font-semibold text-xl flex items-center gap-1">
          connect <div className="rounded-full bg-slate-400 p-1" />
          <div className="rounded-full bg-slate-600 p-1" /> two
        </span>
        socializing and learning done in a new way, carefully brewed for
        students studying abroad.
      </h1>

      <div className="w-full flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col gap-2 w-1/3 rounded-lg p-4">
          <h2 className="text-lg font-medium text-center">
            <div className="flex flex-col">
              <span>Share your unique stories while studying abroad</span>
            </div>
          </h2>
          <Card className="hover:shadow-md hover:scale-[101%] hover:-rotate-1 duration-75 transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                  <Avatar
                    className={
                      "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                    }
                  >
                    <AvatarImage src={"https://i.imgur.com/bbL3WR6.png  "} />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2">
                      Sita
                    </CardTitle>
                    <CardDescription>Sat 22 Jul 2023</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>
                Living in the Netherlands has been one of the best decisions I
                have made. Other than the great ambience, the environment helps
                me grow better and better. I love it here!
              </span>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-2 w-1/3 rounded-lg p-4">
          <h2 className="text-lg font-medium text-center">
            <div className="flex flex-col">
              <span>Meet new friends who are near your area</span>
              <span className="text-sm italic">
                p.s: in a more interesting format!
              </span>
            </div>
          </h2>
          <Card className="hover:shadow-md hover:scale-[101%] hover:-rotate-1 duration-75 transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                  <Avatar
                    className={
                      "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                    }
                  >
                    <AvatarImage src={"https://i.imgur.com/5pAPOeg.png"} />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2">
                      Doni
                    </CardTitle>
                    <CardDescription>Sat 22 Jul 2023</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>
                Hey, Sita! Do you want to meet up at the Square? From one
                Indonesian to another in the Netherlands!
              </span>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-2 w-1/3 rounded-lg p-4">
          <h2 className="text-lg font-medium text-center">
            Learn new languages from highly relatable mentors
          </h2>
          <Card className="hover:shadow-md hover:scale-[101%] hover:-rotate-1 duration-75 transition">
            <CardHeader>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <Avatar
                    className={
                      "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                    }
                  >
                    <AvatarImage src={"https://i.imgur.com/C47absm.png"} />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <CardTitle>George</CardTitle>
                    <CardDescription>george@email.com</CardDescription>
                  </div>
                </div>

                <Badge variant={"outline"}>Number of Mentees: 5</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4">
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 px-4 py-2 justify-between"
                >
                  <Label>From</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Image
                          src={`https://flagcdn.com/48x36/fr.png`}
                          width={50}
                          height={50}
                          alt={`France flag`}
                          quality={100}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>France</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 px-4 py-2 justify-between"
                >
                  <Label>Now in</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Image
                          src={`https://flagcdn.com/48x36/jp.png`}
                          width={50}
                          height={50}
                          alt={`Japan flag`}
                          quality={100}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Japan</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={"/register"} className="w-full">
                <Button variant={"outline"} className="w-full">
                  Choose
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col gap-2 w-1/3 rounded-lg p-4">
          <h2 className="text-lg font-medium text-center">
            Mentors can share their stories abroad, too!
          </h2>

          <Card className="hover:shadow-md hover:scale-[101%] hover:-rotate-1 duration-75 transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                  <Avatar
                    className={
                      "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                    }
                  >
                    <AvatarImage src={"https://i.imgur.com/1J6PjHe.png"} />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <CardTitle className="flex items-center gap-2">
                      Claire
                    </CardTitle>
                    <CardDescription>Sat 23 Jul 2023</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>
                Hello, Indonesian folks in Belgium! Hope everyone are doing
                okay!
              </span>
            </CardContent>
          </Card>
        </div>

        <div></div>
      </div>
    </section>
  );
};
