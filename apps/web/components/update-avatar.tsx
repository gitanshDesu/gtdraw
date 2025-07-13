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
import { Form } from "@gtdraw/ui/components/form";
import { Input } from "@gtdraw/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction } from "react";
import { Label } from "@gtdraw/ui/components/label";

export default function UpdateAvatar({
  open,
  onOpenChange,
  setShowUpdateAvatar,
  showUpdateAvatar,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setShowUpdateAvatar: Dispatch<SetStateAction<boolean>>;
  showUpdateAvatar: boolean;
}) {
  const updateAvatarSchema = z.object({
    avatar: z
      .any()
      .refine(
        (file: FileList | undefined) => {
          return !file || file.length <= 1; // either undefined or single file
        },
        { message: "You can only upload one file" }
      )
      .optional(),
  });
  const form = useForm<z.infer<typeof updateAvatarSchema>>({
    resolver: zodResolver(updateAvatarSchema),
  });

  const onSubmitHandler = (data: z.infer<typeof updateAvatarSchema>) => {
    // console.log(data);
    const avatarFileList = form.getValues("avatar");
    const avatarFile = avatarFileList?.[0]; // Optional chaining ensures no error if undefined

    const formData = new FormData();
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Append only if provided
    } else {
      throw Error("Please Upload Avatar File");
    }

    //send data to backend
    // axios.post("http://localhost:4000/api/v1/update-avatar", data); //use tanstack query here
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Your Avatar</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <Form {...form}>
                <form>
                  <div className="pb-4 flex flex-col justify-center">
                    <Label htmlFor="picture" className="font-semibold pb-2">
                      Avatar
                    </Label>
                    <Input
                      id="picture"
                      type="file"
                      {...form.register("avatar")}
                    ></Input>
                  </div>
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
