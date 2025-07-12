"use client";
import { MailType } from "@gtdraw/common/types/index";
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
      {type === MailType.VERIFY ? <VerifyEmail /> : <ResetPassword />}
    </Dialog>
  );
}

function VerifyEmail({ className }: { className?: string }) {
  return (
    <div className={className}>
      <>
        <DialogTrigger>Verify</DialogTrigger>
        <DialogContent>
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
              <Input id="code" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Verify</Button>
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
        <DialogTrigger>Verify</DialogTrigger>
        <DialogContent>
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
            <Button type="submit">Verify</Button>
          </DialogFooter>
        </DialogContent>
      </>
    </div>
  );
}
