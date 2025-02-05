"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWebsiteStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PreviewPage() {
  const router = useRouter();
  const { title, imageUrl, content, footer } = useWebsiteStore();

  return (
    <div className="container mx-auto p-8">
      <Button onClick={() => router.back()} variant="outline" className="mb-8">
        Back to Editor
      </Button>

      <Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            {imageUrl && (
              <div className="flex justify-center">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
          </div>

          <div className="prose mx-auto">
            <div className="whitespace-pre-wrap">{content}</div>
          </div>

          <footer className="text-center text-gray-500 text-sm border-t pt-4 mt-8">
            {footer}
          </footer>
        </div>
      </Card>
    </div>
  );
}
