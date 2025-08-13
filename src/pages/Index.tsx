import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateZipFromJson, randomFileName, JsonInput } from "@/utils/zip";

const SAMPLE_JSON = `{
  "files": [
    {
      "name": ".gitignore",
      "contents": "..... .... ... ...",
      "binary": false
    },
    {
      "name": ".. ... ..",
      "contents": "... .... .... .....",
      "binary": false
    },
    {
      "name": ".. ... ..",
      "contents": "... .... .... .....",
      "binary": false
    },
    {
      "name": ".. ... ..",
      "contents": "... .... .... .....",
      "binary": false
    }
  ]
}`;

const Index = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [stats, setStats] = useState<{ added: number; skipped: number; size?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [zipName, setZipName] = useState("");

  const placeholder = useMemo(() => SAMPLE_JSON.trim(), []);

  async function onGenerate() {
    setError(null);
    setWarnings([]);
    setStats(null);
    setLoading(true);
    try {
      if (!input.trim()) {
        throw new Error("Please paste valid JSON or use the placeholder as a guide.");
      }
      let parsed: JsonInput;
      try {
        parsed = JSON.parse(input);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your input.");
      }
      if (!parsed || !Array.isArray(parsed.files)) {
        throw new Error("Input JSON must contain a `files` array.");
      }

      const { blob, added, skipped, warnings: warns } = await generateZipFromJson(parsed);
      setWarnings(warns);
      setStats({ added, skipped, size: blob.size });

      const sanitizeName = (raw: string) => raw.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
      let name = zipName.trim();
      if (!name) {
        name = randomFileName("archive");
      } else {
        name = sanitizeName(name);
        if (!name.toLowerCase().endsWith(".zip")) name += ".zip";
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({
        title: "ZIP ready",
        description: `${added} added, ${skipped} skipped. Download started.`,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Lovable Project Downloader</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Turn a JSON description of files into a downloadable Project.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/instructions" aria-label="View instructions">Instructions</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-10">
          <Card className="mx-auto max-w-4xl">
            <CardHeader>
              <CardTitle>Paste your JSON</CardTitle>
              <CardDescription>Use the placeholder as a template. Ensure each file has name, contents, and binary fields.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="min-h-[300px] md:min-h-[360px]"
                aria-label="JSON input textarea"
              />
              <div className="mt-4 grid gap-2 max-w-md">
                <Label htmlFor="zipName">ZIP filename (optional)</Label>
                <Input
                  id="zipName"
                  value={zipName}
                  onChange={(e) => setZipName(e.target.value)}
                  placeholder="my-archive.zip"
                  aria-label="ZIP filename"
                />
                <p className="text-xs text-muted-foreground">We'll append .zip if it's missing.</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button onClick={onGenerate} disabled={loading} size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating ZIP...
                    </>
                  ) : (
                    "Generate and Download ZIP"
                  )}
                </Button>
                {stats && !error && (
                  <div className="flex items-center text-sm text-muted-foreground gap-1" aria-live="polite">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      {stats.added} added, {stats.skipped} skipped{typeof stats.size === "number" ? ` • ${(stats.size / 1024).toFixed(1)} KB` : ""}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4" role="alert" aria-live="assertive">
                  <AlertTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {warnings.length > 0 && !error && (
                <Alert className="mt-4" role="status" aria-live="polite">
                  <AlertTitle>Completed with warnings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 space-y-1">
                      {warnings.map((w, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{w}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto py-6 text-sm text-muted-foreground">
          Tip: For binary files, set binary: true and provide base64 contents.
        </div>
      </footer>
    </div>
  );
};

export default Index;
