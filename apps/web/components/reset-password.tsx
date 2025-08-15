import { Button } from "@gtdraw/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gtdraw/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@gtdraw/ui/components/form";
import { Input } from "@gtdraw/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

export default function ResetPass({
  open,
  onOpenChange,
  setShowResetPass,
  showResetPass,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setShowResetPass: Dispatch<SetStateAction<boolean>>;
  showResetPass: boolean;
}) {
  const resetPassSchema = z.object({
    email: z.string().email(),
    oldPassword: z
      .string()
      .min(6)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
    newPassword: z
      .string()
      .min(6)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
    confirmNewPassword: z
      .string()
      .min(6)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
  });
  const form = useForm<z.infer<typeof resetPassSchema>>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger></DialogTrigger>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <Form {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="pb-4">
                        <FormLabel className="font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@gmail.com" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem className="pb-4">
                        <FormLabel className="font-semibold">
                          Old Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter Old Password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="pb-4">
                        <FormLabel className="font-semibold">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Set New Password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm New Password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => {
                onOpenChange(false);
                toast.success(
                  "Verification Code To Verify Email Sent Successfully!",
                  {
                    description:
                      "An Email with a Verification Code has been sent on User's Email!",
                    action: {
                      label: "Verify",
                      onClick: (e) => {
                        e.preventDefault();
                        setShowResetPass(true);
                      },
                    },
                    duration: 5000,
                  }
                );
              }}
              className="cursor-pointer"
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
