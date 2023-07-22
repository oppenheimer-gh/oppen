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
import { Comment } from "./interface";
import { AiFillDelete } from "react-icons/ai";

export const PostSheet: React.FC = () => {
  const { user, zaxios } = useAuthContext();
  const { openPostSheet, setOpenPostSheet, post } = useHomeContext();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[] | null>(null);

  const findMentor = async () => {};

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
      getCommentsByPostId();
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
      getCommentsByPostId();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while deleting comment",
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
              <span>
                {post?.user.username} is from somewhere and is now is somewhere.
              </span>

              <div className="flex flex-col gap-1">
                <span>Here is {post?.user.username}&apos;s story:</span>
                <span>{post?.message}</span>
              </div>

              <Separator />
              <div className="flex flex-col gap-4">
                <span className="font-medium">Comments</span>
                {comments?.map(
                  ({ id, created_at, message, user: commentMaker }, index) => {
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
                                  src={commentMaker.profile_photo_url}
                                />
                                <AvatarFallback>PC</AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col gap-1">
                                <CardTitle>{commentMaker.username}</CardTitle>
                                <CardDescription>
                                  {new Date(created_at).toDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            {commentMaker.id === user?.id ? (
                              <AiFillDelete
                                size={20}
                                onClick={() => deleteComment(id)}
                                className="hover:cursor-pointer hover:scale-105 hover:rotate-6 duration-75 transition hover:text-red-500"
                              />
                            ) : null}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <span>{message}</span>
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
              <span>
                You have not been matched with any mentors. Click the button
                below to be guided to learn your region language! It&apos;s
                worth the shot.
              </span>

              <Button onClick={findMentor}>Find me a mentor!</Button>
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
                <span>Know about {post?.user.username} more!</span>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mentees">
            <div className="flex flex-col gap-4">
              <span>
                You have not been matched with any mentees. You will be
                automatically matched with any mentees until you choose not to
                be available. You can toggle the setting anytime!
              </span>
              <div className="flex items-center gap-2">
                <Switch /> <span>Open to Accept Mentees</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
