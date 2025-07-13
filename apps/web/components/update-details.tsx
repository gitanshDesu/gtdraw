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
import { Dispatch, SetStateAction } from "react";

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
    username: z.string(),
    fullName: z.string(),
  });
  const form = useForm<z.infer<typeof updateAccountSchema>>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      username: "",
      fullName: "",
    },
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Your Account Details</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <Form {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="pb-4">
                        <FormLabel className="font-semibold">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="@johndoe" {...field} />
                        </FormControl>
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
                            type="password"
                            placeholder="Enter Full Name"
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
              }}
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
