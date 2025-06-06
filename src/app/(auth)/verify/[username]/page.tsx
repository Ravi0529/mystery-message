"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>(); // for taking the username from the parameter

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.message("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in signup of user: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.message("Signup failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 md:space-y-8 bg-white rounded-xl shadow-2xl mx-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-black mb-4">
            Verify Your Account
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Enter the verification code sent to your email
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        placeholder="Enter verification code"
                        {...field}
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2.5 transition-colors duration-200"
            >
              Verify Account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
