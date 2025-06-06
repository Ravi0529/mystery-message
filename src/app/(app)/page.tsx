"use client";

import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-8 md:py-16">
        <section className="text-center mb-8 md:mb-16 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-black mb-4 md:mb-6">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl">
            True Feedback - Where your identity remains a secret
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl lg:max-w-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2 md:p-4">
                <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl md:text-2xl font-bold text-black">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start gap-4">
                    <Mail className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="text-gray-700 text-sm md:text-base">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 bg-white border-t border-gray-200">
        <p className="text-sm md:text-base text-gray-600">
          © 2024 True Feedback. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
