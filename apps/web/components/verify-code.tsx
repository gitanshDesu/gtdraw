"use client";
import { MailType } from "@gtdraw/common/types/";
import { Button } from "@gtdraw/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gtdraw/ui/components/dialog";
import { Input } from "@gtdraw/ui/components/input";
import { Label } from "@gtdraw/ui/components/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function VerifyCode({
  type = MailType.VERIFY,
  open,
  onOpenChange,
}: {
  type?: MailType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {type === MailType.VERIFY ? (
        <VerifyEmail onOpenChange={onOpenChange} />
      ) : (
        <ResetPassword />
      )}
    </Dialog>
  );
}

function VerifyEmail({
  className,
  onOpenChange,
}: {
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const InputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleVerify = async () => {
    const verificationCode = InputRef.current?.value;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email`,
        { verificationCode: verificationCode },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(true);
      if (response.data.success) {
        onOpenChange!(false);
        toast.success("Email Verified Successfully!", { duration: 2000 });
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.log(
        "Error Occurred while sending Verification Code to Verify Email: ",
        error
      );
    }
  };
  return (
    <div className={className}>
      <>
        <DialogTrigger></DialogTrigger>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Enter Verification Code</DialogTitle>
            <DialogDescription>
              Enter Verification Code to Verify Your Email!
            </DialogDescription>
          </DialogHeader>
          <div>
            <div>
              <Label className="mb-2" htmlFor="code">
                Verification Code
              </Label>
              <Input id="code" ref={InputRef} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={loading}
              type="submit"
              onClick={handleVerify}
              className="cursor-pointer"
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    </div>
  );
}

function ResetPassword({ className }: { className?: string }) {
  return (
    <div className={className}>
      <>
        <DialogTrigger></DialogTrigger>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Enter Verification Code</DialogTitle>
            <DialogDescription>
              Enter Verification Code to Reset Your Password!
            </DialogDescription>
          </DialogHeader>
          <div>
            <div>
              <Label className="mb-2" htmlFor="code">
                Verification Code
              </Label>
              <Input id="code" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className={"cursor-pointer"}>
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    </div>
  );
}
