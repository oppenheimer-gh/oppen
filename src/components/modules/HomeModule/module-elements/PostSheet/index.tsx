import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { useAuthContext, useHomeContext } from "@/components/contexts";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PostSheet: React.FC = () => {
  const { user } = useAuthContext();
  const { openPostSheet, setOpenPostSheet, post } = useHomeContext();

  return (
    <Sheet
      open={openPostSheet}
      onOpenChange={() => {
        setOpenPostSheet(!openPostSheet);
      }}
    >
      <SheetContent
        side={"right"}
        className="flex flex-col gap-4 overflow-y-scroll"
      >
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Avatar
              className={
                "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
              }
            >
              <AvatarImage src={post?.user.profile_photo_url} />
              <AvatarFallback>PC</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <SheetTitle>{post?.user.username}</SheetTitle>
              <SheetDescription>
                {new Date(post?.created_at ?? "1980/01/01").toDateString()}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Tabs defaultValue="story">
          <TabsList>
            <TabsTrigger value="story">Story</TabsTrigger>
            {post?.user.id === user?.id ? (
              <TabsTrigger value="mentor">Mentor</TabsTrigger>
            ) : (
              <TabsTrigger value="profile">Profile</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="story">
            <div className="flex flex-col gap-2">
              <span>
                {post?.user.username} is from somewhere and is now is somewhere.
              </span>

              <div className="flex flex-col gap-1">
                <span>Here is {post?.user.username}'s story:</span>
                <span>{post?.message}</span>
              </div>

              <Separator />
              <div className="flex flex-col gap-4">
                <span className="font-medium">Comments</span>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Avatar
                        className={
                          "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                        }
                      >
                        <AvatarImage src={""} />
                        <AvatarFallback>PC</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <span>Card Content</span>
                  </CardContent>
                </Card>

                <Separator />

                <Textarea
                  placeholder={`Reach ${post?.user.username} out... `}
                  rows={6}
                />

                <Button>Submit</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="mentor">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar
                    className={
                      "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                    }
                  >
                    <AvatarImage src={""} />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <span>Card Content</span>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar
                    className={
                      "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                    }
                  >
                    <AvatarImage src={post?.user.profile_photo_url} />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <CardTitle>{post?.user.username}</CardTitle>
                    <CardDescription>{post?.user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <span>Know about {post?.user.username} more!</span>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
