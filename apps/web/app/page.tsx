"use client";
import { toast } from "sonner";
import { Button } from "@gtdraw/ui/components/button";
import VerifyCode from "@/components/verify-code";
import { useState } from "react";

export default function Page() {
  const [showVerify, setShowVerify] = useState(false);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button
          onClick={() => {
            toast("Event has been created", {
              description: "Test Description",
              action: {
                label: "Verify",
                onClick: () => setShowVerify(true),
              },
            });
          }}
          size="sm"
        >
          Button
        </Button>
        {showVerify ? (
          <VerifyCode open={showVerify} onOpenChange={setShowVerify} />
        ) : null}
      </div>
    </div>
  );
}
