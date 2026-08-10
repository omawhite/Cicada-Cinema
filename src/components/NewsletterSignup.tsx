import { useId, useState, type SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Status = "idle" | "submitting" | "submitted" | "error";

// No newsletter provider is chosen yet, so this simulates a submission
// rather than calling a real API. Swap this default in once one exists.
function fakeSubscribe(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

interface NewsletterSignupProps {
  onSubscribe?: (email: string) => Promise<void>;
}

export function NewsletterSignup({
  onSubscribe = fakeSubscribe,
}: NewsletterSignupProps) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      await onSubscribe(email);
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  }

  if (status === "submitted") {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent>
          <Alert>
            <AlertTitle>You&apos;re on the list!</AlertTitle>
            <AlertDescription>
              We&apos;ll email {email} when we have news to share.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Join the newsletter</CardTitle>
        <CardDescription>
          Get updates on upcoming screenings and events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              We couldn&apos;t sign you up. Please try again.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={emailId}>Email</FieldLabel>
              <Input
                id={emailId}
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={status === "submitting"}
              />
            </Field>
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Signing up..." : "Sign up"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
