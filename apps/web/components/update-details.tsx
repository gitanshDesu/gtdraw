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
import { Dispatch, SetStateAction } from "react";
import { cn } from "@gtdraw/ui/lib/utils";
import axios from "axios";
import { useUserStore } from "@/providers/user-store-provider";

//TODO: Fix logic after I successfully add JS Logic in Dashboard (deferred right now)
export default function UpdateUser({
  open,
  onOpenChange,
  setShowUpdateAcc,
  showUpdateAcc,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setShowUpdateAcc: Dispatch<SetStateAction<boolean>>;
  showUpdateAcc: boolean;
}) {
  const updateAccountSchema = z.object({
    username: z.string().min(2, "username field is required!"),
    fullName: z.string().min(2, "Full Name field is required!"),
  });
  const form = useForm<z.infer<typeof updateAccountSchema>>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      username: "",
      fullName: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const {
    formState: { errors },
  } = form;

  const { username, fullName, setUser } = useUserStore((state) => state);

  const onSubmitHandler = async (data: z.infer<typeof updateAccountSchema>) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-account`,
        data,
        { withCredentials: true }
      );
      if (response.data.success) {
        setUser({
          username: response.data.data.username,
          fullName: response.data.data.fullName,
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.log(
        "Error Occurred while Sending Payload to update user account details! ",
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
            <DialogTitle>Update Your Account Details</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <Form {...form}>
                <form
                  id="updateAccountDetailsForm"
                  onSubmit={form.handleSubmit(onSubmitHandler)}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="pb-4">
                        <FormLabel className="font-semibold">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@jhondoe"
                            {...field}
                            autoFocus
                            autoComplete="on"
                            autoCorrect="on"
                            autoSave="on"
                            className={cn(
                              "w-full",
                              errors.username &&
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
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            autoFocus
                            autoComplete="on"
                            autoCorrect="on"
                            autoSave="on"
                            className={cn(
                              "w-full",
                              errors.fullName &&
                                "border-destructive ring-1 ring-destructive/50 focus:ring-destructive"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
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
              form="updateAccountDetailsForm"
              type="submit"
              className="cursor-pointer"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
