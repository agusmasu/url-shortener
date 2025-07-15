"use client"

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <GlassCard className="p-10 max-w-lg w-full text-center">
        <h1 className="text-6xl font-extrabold gradient-text mb-4">404</h1>
        <p className="text-2xl font-bold mb-2 text-muted-foreground">Page Not Found</p>
        <p className="mb-8 text-muted-foreground">
          The short URL you are looking for does not exist or may have expired.
        </p>
        <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Create your new Short Link for free
          </Link>
        </Button>
      </GlassCard>
    </div>
  );
}
