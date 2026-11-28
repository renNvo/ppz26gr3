import { Layers, Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Moje zestawy
            </h1>
            <p className="text-sm text-muted-foreground">
              Zarządzaj swoimi zestawami fiszek i rozpocznij codzienną naukę.
            </p>
          </div>

          <Button type="button" disabled>
            <Plus className="size-4" />
            <span>Utwórz nowy zestaw</span>
          </Button>
        </div>

        <Card className="border-dashed bg-card/60">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Layers className="size-7" />
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              Nie masz jeszcze żadnych zestawów fiszek
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              Utwórz swój pierwszy zestaw fiszek, aby rozpocząć naukę i wygodnie
              utrwalać materiał.
            </p>

            <Button type="button" className="mt-6" disabled>
              <Plus className="size-4" />
              <span>Utwórz nowy zestaw</span>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
