"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Search, Save, Download, Cookie } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-background min-h-screen grid-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-white">
              About Zenith
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover how our platform makes it easier to find and manage your
              favorite images
            </p>
          </div>

          {/* Section principale */}
          <div className="space-y-16">
            {/* Section 1: Recherche */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-4 text-primary">
                  <Search className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">
                Instant Image Library
                </h2>
                <p className="text-muted-foreground">
                  Our platform gives you instant access to a vast library of
                  online images. You can also upload your own photos and GIFs
                  using a tagging and description system that helps you organize
                  them within your personal library. All your stored content can
                  be easily accessed, categorized, and of course, downloaded at
                  any time.
                </p>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Recherche d'images"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Section 2: Sauvegarde */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="https://image.shutterstock.com/image-photo/this-photo-symbol-internet-cookies-600nw-1626058816.jpg?app=peacock"
                  alt="Sauvegarde d'images"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <div className="mb-4 text-primary">
                  <Cookie className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">
                Your Images Always at Hand
                </h2>
                <p className="text-muted-foreground">
                  Your personal library is saved locally using a cookie system.
                  No registration is required, but be careful not to reset your
                  cookies or clear your browser, as this may result in the loss
                  of your saved images.
                </p>
              </div>
            </div>

            {/* Section 3: Téléchargement */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-4 text-primary">
                  <Download className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Easy download</h2>
                <p className="text-muted-foreground">
                  Download your images with just one click. Each image in your
                  collection can be instantly downloaded in its original
                  quality. Perfect for your creative projects, presentations, or
                  personal mementos.
                </p>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="https://media.istockphoto.com/id/1598005707/fr/photo/concept-de-r%C3%A9seau-de-communication-sans-fil-bureau-intelligent.jpg?s=612x612&w=0&k=20&c=L-C7qSEiz27gVFIaWgwGvBitCZ7tF4ldNA8PifhLj_8="
                  alt="Téléchargement d'images"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Section conclusion */}
            <Card className="mt-16">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  Explore and Create Your Own Collection
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our generator scours the web to suggest random images of
                  interest. Add your own photos from your computer or phone,
                  organize them with tags, and easily find them in your personal
                  library. You can view or download them again at any time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
