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
import { useAuthContext } from "@/components/contexts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const RegisterModule = () => {
  const { register } = useAuthContext();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      is_mentor: "false",
    },
  });

  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { confirmPassword, is_mentor, ...rest } = values;
    const finalValues = {
      ...rest,
      profile_photo_url: profilePhotoUrl,
      is_mentor: is_mentor === "true" ? true : false,
    };
    await register(finalValues);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center py-8">
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="arkanalexei@gmail.com" {...field} />
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
                    onClick={() => setProfilePhotoUrl(url)}
                    key={index}
                    className={`w-[70px] h-[70px] hover:shadow-lg transition duration-75 cursor-pointer ${
                      profilePhotoUrl === url && "opacity-30 shadow-xl"
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

          <FormField
            control={form.control}
            name="is_mentor"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>I am registering as a...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Mentee</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Mentor</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={!form.formState.isValid || profilePhotoUrl === ""}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
