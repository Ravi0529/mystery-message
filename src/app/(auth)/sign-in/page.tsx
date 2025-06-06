"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import * as z from "zod";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result);

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Login Failed");
        toast.error("Incorrect username or password");
      } else {
        toast.error("Error");
        toast.error(result.error);
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <>
      <Toaster expand={true} />
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-6 md:p-8 space-y-6 md:space-y-8 bg-white rounded-xl shadow-2xl mx-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-black mb-4">
              Welcome Back to Mystery Message
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Sign in to continue your secret conversations
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Email/Username
                    </FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        placeholder="Enter your email or username"
                        {...field}
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2.5 transition-colors duration-200"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Not a member yet?{" "}
              <Link
                href="/sign-up"
                className="text-black hover:text-gray-700 font-medium underline-offset-4 hover:underline transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
