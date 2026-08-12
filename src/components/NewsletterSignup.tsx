import { useId, useState, type SubmitEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      <div className="max-w-3xl mx-auto px-6 py-16 flex justify-center bg-black">
        <Alert>
          <AlertTitle>You&apos;re on the list!</AlertTitle>
          <AlertDescription>
            We&apos;ll email {email} when we have news to share.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 flex justify-center bg-black">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Subscribe to our email list
        </h2>
        <p className="mb-4 leading-relaxed text-white/70">
          Stay up to date on upcoming films and events!
        </p>
        {status === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              We couldn&apos;t sign you up. Please try again.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="max-w-sm">
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldLabel htmlFor={emailId} className="sr-only">
                Email
              </FieldLabel>
              <Input
                id={emailId}
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={status === "submitting"}
              />
              <Button
                type="submit"
                size="icon"
                disabled={status === "submitting"}
                aria-label={
                  status === "submitting" ? "Signing up..." : "Subscribe"
                }
              >
                <ArrowRight />
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
