"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // Optimalistic UI ---> Instantly changes the UI only, not the on the server or DB
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages"); // Continueously moniter the value of "acceptMessages"

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessages", response.data.isAcceptingMessage ?? true); // if server sends that user is accepting the messages then On else Off, not manually toggling
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings.",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(response.data.messages || []);

        if (refresh) {
          toast.message("Refreshed Messages", {
            description: "Showing latest messages.",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.message("Error", {
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings.",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages); // Manually toggling the switch value stored in "setValue"
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings.",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 sm:px-6 lg:px-8">
        <LogIn className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-800 mb-2">
          You are not logged in
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md">
          Please log in to access your dashboard and manage your messages.
        </p>
      </div>
    );
  }

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.message("URL copied", {
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-2 sm:my-4 md:my-6 mx-2 sm:mx-4 md:mx-6 lg:mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg w-full max-w-6xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-3 sm:mb-4 md:mb-6">
        User Dashboard
      </h1>

      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
          Copy Your Unique Link
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-1 p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent truncate"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-black text-white hover:bg-gray-900 transition-colors duration-200 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-sm sm:text-base whitespace-nowrap"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-sm sm:text-base text-gray-700 font-medium">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator className="mb-3 sm:mb-4 md:mb-6" />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Your Messages
        </h2>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="border-gray-200 hover:bg-gray-50 transition-colors duration-200 w-full sm:w-auto py-2 sm:py-2.5"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-4 sm:py-6 md:py-8">
            <p className="text-sm sm:text-base text-gray-600">
              No messages to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
