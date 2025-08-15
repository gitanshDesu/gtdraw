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
  FormMessage,
} from "@gtdraw/ui/components/form";
import { Input } from "@gtdraw/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useResetPassStore } from "@/providers/reset-pass-store-provider";
import { cn } from "@gtdraw/ui/lib/utils";
import { Eye, EyeOff } from "lucide-react";

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
    email: z.string().email({ message: "Provide Valid Email Id!" }),
    oldPassword: z
      .string()
      .min(6, "Password should be at least 6 characters long!")
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., !@#$%^&*)",
      }),
    newPassword: z
      .string()
      .min(6, "Password should be at least 6 characters long!")
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., !@#$%^&*)",
      }),
    confirmNewPassword: z
      .string()
      .min(6, "Password should be at least 6 characters long!")
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., !@#$%^&*)",
      }),
  });

  const form = useForm<z.infer<typeof resetPassSchema>>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const {
    formState: { errors },
  } = form;

  const { setResetPass } = useResetPassStore((state) => state);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const verifyTimerRef = useRef<NodeJS.Timeout | null>(null);

  //clean up timer after component unmounts
  useEffect(() => {
    return () => {
      if (verifyTimerRef.current) {
        clearTimeout(verifyTimerRef.current);
      }
    };
  }, []);

  const onSubmitHandler = async (data: z.infer<typeof resetPassSchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/request-reset`,
        { email: data.email },
        { withCredentials: true }
      );

      if (response.data.success) {
        onOpenChange(false);
        toast.success("Verification Code To Verify Email Sent Successfully!", {
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
        });
        //TODO: Fix the auto-open modal not auto-opening even though logic is same as in register form
        if (verifyTimerRef.current) {
          clearTimeout(verifyTimerRef.current); //prevents auto-open if clicked
        }
        //start a 6s timer to auto-open modal if user doesn't click "verify"
        verifyTimerRef.current = setTimeout(() => {
          setShowResetPass(true);
        }, 6000);
      }
      setResetPass(data);
    } catch (error) {
      console.log(
        "Error Occurred while Sending Payload to Reset Password! ",
        error
      );
    }
  };

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
                <form
                  id="resetPasswordForm"
                  onSubmit={form.handleSubmit(onSubmitHandler)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="pb-4">
                        <FormLabel className="font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johndoe@gmail.com"
                            {...field}
                            autoFocus
                            autoComplete="on"
                            autoCorrect="on"
                            autoSave="on"
                            className={cn(
                              "w-full",
                              errors.email &&
                                "border-destructive ring-1 ring-destructive/50 focus:ring-destructive"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
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
                          <div className="relative">
                            <Input
                              type={showOldPassword ? "text" : "password"}
                              placeholder="Enter Old Password"
                              {...field}
                              className={cn(
                                "w-full pr-10",
                                errors.oldPassword &&
                                  "border-destructive ring-1 ring-destructive/50 focus:ring-destructive"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowOldPassword(!showOldPassword)
                              }
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                            >
                              {showOldPassword ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeOff className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
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
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter New Password"
                              {...field}
                              className={cn(
                                "w-full pr-10",
                                errors.newPassword &&
                                  "border-destructive ring-1 ring-destructive/50 focus:ring-destructive"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                            >
                              {showNewPassword ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeOff className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
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
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm New Password"
                              {...field}
                              className={cn(
                                "w-full pr-10",
                                errors.confirmNewPassword &&
                                  "border-destructive ring-1 ring-destructive/50 focus:ring-destructive"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                            >
                              {showConfirmPassword ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeOff className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            <DialogFooter className="my-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form="resetPasswordForm"
                className="cursor-pointer"
              >
                Reset
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
