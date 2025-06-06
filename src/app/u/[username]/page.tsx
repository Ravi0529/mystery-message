"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="container mx-auto my-4 sm:my-6 md:my-8 p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg max-w-4xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-4 sm:mb-6 text-center">
        Send Anonymous Message
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base sm:text-lg font-medium text-gray-900">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here..."
                    className="resize-none min-h-[120px] p-3 sm:p-4 border-gray-200 focus:border-black focus:ring-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button
                disabled
                className="w-full sm:w-auto px-6 py-2.5 bg-black text-white hover:bg-gray-900 transition-colors duration-200"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="w-full sm:w-auto px-6 py-2.5 bg-black text-white hover:bg-gray-900 transition-colors duration-200"
              >
                Send Message
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 sm:space-y-6 my-6 sm:my-8">
        <div className="space-y-2 sm:space-y-3">
          <Button
            onClick={fetchSuggestedMessages}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors duration-200"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Get Message Suggestions
          </Button>
          <p className="text-sm text-gray-600">
            Click on any message below to use it.
          </p>
        </div>
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Suggested Messages
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2 sm:space-y-3">
            {error ? (
              <p className="text-red-500 text-sm">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start hover:bg-gray-50 transition-colors duration-200 border-gray-200"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 sm:my-8" />

      <div className="text-center space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Want Your Own Message Board?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Create an account to receive anonymous messages from others.
        </p>
        <Link href="/sign-up">
          <Button className="bg-black text-white hover:bg-gray-900 transition-colors duration-200 px-6 py-2.5">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
