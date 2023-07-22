import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { useAuthContext, useHomeContext } from "@/components/contexts";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentSchema } from "@/components/schemas/create-comment.schema";
import * as z from "zod";
import { Comment, Mentee, Mentor } from "./interface";
import { AiFillDelete } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PostSheet: React.FC = () => {
  const { user, zaxios } = useAuthContext();
  const { openPostSheet, setOpenPostSheet, post } = useHomeContext();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [mentors, setMentors] = useState<Mentor[] | null>(null);
  const [menteeData, setMenteeData] = useState<Mentee | null>(null);
  const [mentorData, setMentorData] = useState<Mentor | null>(null);

  const findMentor = async () => {
    try {
      const { data: mentors } = await zaxios({
        method: "GET",
        url: `/post/mentors/${post?.id}/`,
      });
      setMentors(mentors);
      toast({
        title: "Success!",
        description: "We've got some mentors that might suit your needs.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while fetching comments.",
        variant: "destructive",
      });
    }
  };

  const getCommentsByPostId = async () => {
    try {
      const {
        data: { results: comments },
      } = await zaxios({
        method: "GET",
        url: `/comment/post/${post?.id}/?page=1&limit=1000000`,
      });
      setComments(comments);
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while fetching comments",
        variant: "destructive",
      });
    }
  };

  const deletePost = async () => {
    try {
      await zaxios(
        {
          method: "DELETE",
          url: `/post/delete/${post?.id}/`,
        },
        true
      );
      toast({
        title: "Success!",
        description: "Deleted post.",
      });
      window.location.reload();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while deleting post.",
        variant: "destructive",
      });
    }
  };

  const createComment = async (data: z.infer<typeof createCommentSchema>) => {
    try {
      await zaxios(
        {
          method: "POST",
          url: `/comment/post/${post?.id}/`,
          data,
        },
        true
      );
      toast({
        title: "Success!",
        description: "Comment created.",
      });
      await getCommentsByPostId();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while creating comment",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await zaxios(
        {
          method: "DELETE",
          url: `/comment/delete/${id}/`,
        },
        true
      );
      toast({
        title: "Success!",
        description: "Comment deleted.",
      });
      await getCommentsByPostId();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while deleting comment",
        variant: "destructive",
      });
    }
  };

  const chooseMentor = async (id: string) => {
    try {
      await zaxios(
        {
          method: "PATCH",
          url: `/user/mentee/update-mentor`,
          data: {
            mentor_id: id,
          },
        },
        true
      );

      toast({
        title: "Success!",
        description: "Mentor chosen.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while choosing mentor.",
        variant: "destructive",
      });
    }
  };

  const getUserMenteeData = async () => {
    try {
      const {
        data: { mentee },
      } = await zaxios(
        {
          method: "GET",
          url: `/user/mentee/get/`,
        },
        true
      );
      if (!!mentee.mentor) {
        setMenteeData(mentee);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while getting user mentee data.",
        variant: "destructive",
      });
    }
  };

  const getUserMentorData = async () => {
    try {
      const {
        data: { mentor },
      } = await zaxios(
        {
          method: "GET",
          url: `/user/mentor/get/`,
        },
        true
      );
      setMentorData(mentor);
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while getting user mentee data.",
        variant: "destructive",
      });
    }
  };

  const changeMentorAvailabilityStatus = async () => {
    try {
      await zaxios(
        {
          method: "PATCH",
          url: `/user/mentor/toggle/`,
        },
        true
      );
      toast({
        title: "Success!",
        description: "Availability status updated.",
      });
      await getUserMentorData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while updating availability status.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createCommentSchema>) => {
    form.reset();
    await createComment(values);
  };

  useEffect(() => {
    if (!!post) {
      getCommentsByPostId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  useEffect(() => {
    if (!!post && !user?.is_mentor && post.user.id === user?.id) {
      getUserMenteeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  useEffect(() => {
    if (!!post && user?.is_mentor && post.user.id === user?.id) {
      getUserMentorData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  return (
    <Sheet
      open={openPostSheet}
      onOpenChange={() => {
        setOpenPostSheet(!openPostSheet);
      }}
    >
      <SheetContent
        side={"right"}
        className="flex flex-col gap-4 overflow-y-scroll min-w-[50%] md:min-w-[35%]"
      >
        <SheetHeader>
          <div className="flex items-center justify-between pr-6">
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
                <SheetTitle className="flex items-center gap-2">
                  {post?.user.username}
                  <Badge>{post?.user.is_mentor ? "Mentor" : "Mentee"}</Badge>
                </SheetTitle>
                <SheetDescription>
                  {new Date(post?.created_at ?? "1980/01/01").toDateString()}
                </SheetDescription>
              </div>
            </div>
            {post?.user.id === user?.id ? (
              <AiFillDelete
                size={20}
                onClick={deletePost}
                className="hover:cursor-pointer hover:scale-105 hover:rotate-6 duration-75 transition hover:text-red-500"
              />
            ) : null}
          </div>
        </SheetHeader>
        <Tabs defaultValue="story">
          <TabsList>
            <TabsTrigger value="story">Story</TabsTrigger>
            {post?.user.id === user?.id && !user?.is_mentor ? (
              <TabsTrigger value="mentor">Mentor</TabsTrigger>
            ) : post?.user.id === user?.id && user?.is_mentor ? (
              <TabsTrigger value="mentees">Mentees</TabsTrigger>
            ) : (
              <TabsTrigger value="profile">Profile</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="story">
            <div className="flex flex-col gap-2">
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
                          src={`https://flagcdn.com/48x36/${post?.source_country_code}.png`}
                          width={50}
                          height={50}
                          alt={`${post?.source_country} flag`}
                          quality={100}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>{post?.source_country}</span>
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
                          src={`https://flagcdn.com/48x36/${post?.destination_country_code}.png`}
                          width={50}
                          height={50}
                          alt={`${post?.destination_country} flag`}
                          quality={100}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>{post?.destination_country}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              </div>

              <div className="flex flex-col gap-1">
                <span>Here is {post?.user.username}&apos;s story:</span>
                <span>{post?.message}</span>
              </div>

              <Separator />
              <div className="flex flex-col gap-4">
                <span className="font-medium">Comments</span>
                {!comments || comments?.length === 0 ? (
                  <span>No comments in this post yet.</span>
                ) : null}
                {comments?.map(
                  ({ id, created_at, message, user: commentMaker }, index) => {
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 w-full">
                              <Avatar
                                className={
                                  "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                                }
                              >
                                <AvatarImage
                                  src={commentMaker.profile_photo_url}
                                />
                                <AvatarFallback>PC</AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col gap-1">
                                <CardTitle className="flex items-center gap-2">
                                  {commentMaker.username}{" "}
                                </CardTitle>
                                <CardDescription>
                                  {new Date(created_at).toDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge>
                              {commentMaker.is_mentor ? "Mentor" : "Mentee"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                          <span>{message}</span>
                          {commentMaker.id === user?.id ? (
                            <AiFillDelete
                              size={20}
                              onClick={() => deleteComment(id)}
                              className="hover:cursor-pointer hover:scale-105 hover:rotate-6 duration-75 transition hover:text-red-500"
                            />
                          ) : null}
                        </CardContent>
                      </Card>
                    );
                  }
                )}

                <Separator />

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Reach {post?.user.username} out...{" "}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here..."
                              rows={6}
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
              </div>
            </div>
          </TabsContent>
          <TabsContent value="mentor">
            <div className="flex flex-col gap-4">
              {mentors?.length === 0 ? (
                <span>
                  You have not been matched with any mentors. Click the button
                  below to be guided to learn your region language! It&apos;s
                  worth the shot.
                </span>
              ) : !!menteeData ? (
                <>
                  <Card>
                    <CardHeader className="flex flex-col gap-4">
                      <span>You now have a mentor!</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar
                            className={
                              "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                            }
                          >
                            <AvatarImage
                              src={menteeData.mentor?.user?.profile_photo_url}
                            />
                            <AvatarFallback>PC</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <CardTitle>
                              {menteeData.mentor?.user?.username}
                            </CardTitle>
                            <CardDescription>
                              {menteeData.mentor?.user?.email}
                            </CardDescription>
                          </div>
                        </div>

                        <Badge variant={"outline"}>
                          Number of Mentees: {menteeData.mentor?.mentees_count}
                        </Badge>
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
                                  src={`https://flagcdn.com/48x36/${menteeData.mentor.source_country_code}.png`}
                                  width={50}
                                  height={50}
                                  alt={`${menteeData.mentor.source_country} flag`}
                                  quality={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>{menteeData.mentor.source_country}</span>
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
                                  src={`https://flagcdn.com/48x36/${menteeData.mentor.destination_country_code}.png`}
                                  width={50}
                                  height={50}
                                  alt={`${menteeData.mentor.destination_country} flag`}
                                  quality={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>
                                  {menteeData.mentor.destination_country}
                                </span>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  {mentors?.map((mentor, index) => {
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar
                                className={
                                  "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                                }
                              >
                                <AvatarImage
                                  src={mentor?.user?.profile_photo_url}
                                />
                                <AvatarFallback>PC</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-1">
                                <CardTitle>{mentor?.user?.username}</CardTitle>
                                <CardDescription>
                                  {mentor?.user?.email}
                                </CardDescription>
                              </div>
                            </div>

                            <Badge variant={"outline"}>
                              Number of Mentees: {mentor?.mentees_count}
                            </Badge>
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
                                      src={`https://flagcdn.com/48x36/${mentor.source_country_code}.png`}
                                      width={50}
                                      height={50}
                                      alt={`${mentor.source_country} flag`}
                                      quality={100}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span>{mentor.source_country}</span>
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
                                      src={`https://flagcdn.com/48x36/${mentor.destination_country_code}.png`}
                                      width={50}
                                      height={50}
                                      alt={`${mentor.destination_country} flag`}
                                      quality={100}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span>{mentor.destination_country}</span>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant={"outline"}
                            className="w-full"
                            onClick={() => {
                              chooseMentor(mentor.id);
                            }}
                          >
                            Choose
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                  <Button onClick={findMentor}>Find me a mentor!</Button>
                </>
              )}
            </div>
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
                <span>
                  Reach out to {post?.user.username}, maybe you will find a new
                  friend!
                </span>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mentees">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-end gap-2">
                <Switch
                  checked={mentorData?.is_available}
                  onClick={changeMentorAvailabilityStatus}
                />{" "}
                <span>Open to Accept Mentees</span>
              </div>
              {mentorData?.mentees_count === 0 ? (
                <span>
                  You have not been matched with any mentees. You will be
                  automatically matched with any mentees until you choose not to
                  be available. You can toggle the setting any time!
                </span>
              ) : (
                <div className="flex flex-col gap-4">
                  <span className="font-medium">You now have mentees!</span>
                  {mentorData?.mentees?.map((mentee, index) => {
                    return (
                      <Card key={index}>
                        <CardHeader className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar
                                className={
                                  "w-[40px] h-[40px] hover:shadow-lg transition duration-75 cursor-pointer"
                                }
                              >
                                <AvatarImage
                                  src={mentee?.user?.profile_photo_url}
                                />
                                <AvatarFallback>PC</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-1">
                                <CardTitle>{mentee?.user?.username}</CardTitle>
                                <CardDescription>
                                  {mentee?.user?.email}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
