import { registerSchema } from "@/components/schemas/register.schema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { PROFILE_PICTURE_OPTIONS } from "./constants";

export const RegisterModule = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");

  function onSubmit(values: z.infer<typeof registerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { confirmPassword, ...rest } = values;
    const finalValues = { ...rest, profilePictureUrl };
    console.log(finalValues);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-semibold text-xl">Register</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-1/3"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="arkanalexei" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {PROFILE_PICTURE_OPTIONS.map((url, index) => {
                return (
                  <Avatar
                    onClick={() => setProfilePictureUrl(url)}
                    key={index}
                    className={`w-[70px] h-[70px] hover:shadow-lg transition duration-75 cursor-pointer ${
                      profilePictureUrl === url && "opacity-30 shadow-xl"
                    }`}
                  >
                    <AvatarImage src={url} />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          </FormItem>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={!form.formState.isValid || profilePictureUrl === ""}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
