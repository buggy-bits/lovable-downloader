import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Instructions = () => {
  useEffect(() => {
    document.title = "Instructions | Lovable Downloader";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-muted/50">
  <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold tracking-tight">Instructions</h1>
    </div>
  </header>

  <main className="flex-1">
    <section className="container mx-auto py-12">
      <Card className="mx-auto max-w-3xl shadow-lg rounded-xl p-6 bg-white dark:bg-background">
        <CardHeader className="mb-6">
          <CardTitle className="text-2xl font-semibold">Start here</CardTitle>
          <CardDescription>
            If you're here, you're likely familiar with development and debugging.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Step 1: Log In to Lovable.dev</h3>
            <p className="text-sm text-muted-foreground">
              Open your browser and ensure you're logged into <strong>Lovable.dev</strong>. If not, log in or create an account.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Step 2: Open Your Project</h3>
            <p className="text-sm text-muted-foreground">
              After successful authentication, open your Lovable project. Wait for the project to load fully and for the preview window to become active.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Step 3: Open Developer Tools</h3>
            <p className="text-sm text-muted-foreground">
              Open your browser's Developer Tools → Network Tab. Enable the <strong>Fetch/XHR</strong> filter to narrow down request types.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Step 4: Trigger the Source Code Request</h3>
            <p className="text-sm text-muted-foreground">
              Toggle the code/preview button in your project. This triggers a request to the server. You’ll see a request named <strong>"source-code"</strong> to this endpoint: <br />
              <u>https://lovable-api.com/projects/&lt;your-project-id&gt;/source-code</u><br />
              If you don't see it, try toggling the button again.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Step 5: Copy the Response JSON Object</h3>
            <p className="text-sm text-muted-foreground">
              Copy the response JSON from the request. Paste it into this site's input to generate a downloadable ZIP of your project.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  </main>

  <footer className="border-t bg-background/80 mt-auto">
    <div className="container mx-auto py-6 text-sm text-muted-foreground text-center">
      Made with Lovable.
    </div>
  </footer>
</div>

  );
};

export default Instructions;
