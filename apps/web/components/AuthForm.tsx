"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@gtdraw/ui/components/form";
import { Input } from "@gtdraw/ui/components/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema, LoginUserType } from "@gtdraw/common/loginUser";
import { Button } from "@gtdraw/ui/components/button";
import { useUserStore } from "@/providers/user-store-provider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Label } from "@gtdraw/ui/components/label";
import { toast } from "sonner";
import { useState } from "react";
import VerifyCode from "./verify-code";
import { MailType } from "@gtdraw/common/types";
import ResetPass from "./reset-password";

export function RegisterForm() {
  const router = useRouter();
  const registerSchema = z.object({
    username: z.string({ message: "User Name field is required" }).trim(),
    fullName: z.string({ message: "Full Name field is required!" }).trim(),
    email: z
      .string()
      .email({ message: "Send Valid Email As Input" })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .trim()
      .min(6, "Password should be at least 6 characters long!")
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
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
  type RegisterUserType = z.infer<typeof registerSchema>;
  const form = useForm<RegisterUserType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });
  const [showVerify, setShowVerify] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const { username, fullName, email, password, registerUser } = useUserStore(
    (state) => state
  );

  const onSubmitRegisterHanlder = (data: RegisterUserType) => {
    // console.log(data);
    const avatarFileList = form.getValues("avatar");
    const avatarFile = avatarFileList?.[0]; // Optional chaining ensures no error if undefined

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Append only if provided
    }
    //update state
    registerUser(data);

    //send data to backend
    // axios.post("http://localhost:4000/api/v1/register", data); //use tanstack query here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center  dark:text-white md:min-w-[20rem] max-h-full py-4 px-8 rounded-md">
        <Form {...form}>
          <div>
            <div className="w-full max-w-sm flex items-center">
              <div className="sm:grid sm:grid-cols-10">
                <div className="font-semibold text-center sm:col-span-10 sm:text-left sm:pl-3">
                  Sign Up to your account
                </div>
                <div className="sm:col-span-9 sm:pl-3">
                  Enter your details below to register your account
                </div>
              </div>

              <Button
                className="hidden sm:block font-semibold text-[1rem] cursor-pointer dark:text-white relative bottom-7"
                onClick={() => router.push("/login")}
                variant="link"
              >
                Log In
              </Button>
            </div>
            <form
              className="py-4 flex flex-col items-center min-w-full"
              onSubmit={form.handleSubmit(onSubmitRegisterHanlder)}
            >
              <div className="min-w-[20rem] sm:min-w-[22rem]">
                <div className="pb-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="john_doe" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pb-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="johndoe@gmail.com"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pb-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Enter Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pb-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel
                            className="font-semibold"
                            htmlFor="password"
                          >
                            Password
                          </FormLabel>
                          <Button
                            onClick={() => setShowForgotPass(true)}
                            variant="link"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                          >
                            Forgot your password?
                          </Button>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="johnDoe@123456"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
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
              </div>
              <div className="flex flex-col items-center justify-center min-w-[15rem] sm:min-w-[22rem]">
                <Button
                  className="mb-4 min-w-full col-span-6 cursor-pointer"
                  type="submit"
                  onClick={() => {
                    toast(
                      "Verification Code To Verify Email Sent Successfully!",
                      {
                        description:
                          "An Email with a Verification Code has been sent on User's Email!",
                        action: {
                          label: "Verify",
                          onClick: () => setShowVerify(true),
                        },
                      }
                    );
                  }}
                >
                  Submit
                </Button>
                <div className="min-w-full px-4 flex items-center gap-4 mb-3">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <span className="text-sm text-gray-500">or</span>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center">
                  <Button
                    variant="outline"
                    className="block sm:hidden min-w-full col-span-2 cursor-pointer"
                  >
                    Login with Email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full col-span-2 sm:min-w-[22rem] cursor-pointer"
                  >
                    Login with Google
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Form>
        {showVerify ? (
          <VerifyCode
            type={MailType.VERIFY}
            open={showVerify}
            onOpenChange={setShowVerify}
          />
        ) : null}
        {showForgotPass ? (
          <ResetPass open={showForgotPass} onOpenChange={setShowForgotPass} />
        ) : null}
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const loginSchema = loginUserSchema;
  const form = useForm<LoginUserType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const { username, email, password, loginUser } = useUserStore(
    (state) => state
  );

  const onSubmitLoginHandler = (data: LoginUserType) => {
    //update state
    loginUser(data);

    //send data to backend
  };
  const [showForgotPass, setShowForgotPass] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center  dark:text-white md:min-w-[20rem] max-h-full py-4 px-8 rounded-md">
        <Form {...form}>
          <div>
            <div className="w-full max-w-sm flex items-center">
              <div className="sm:grid sm:grid-cols-10">
                <div className="sm:pl-3 font-semibold text-center sm:col-span-10 sm:text-left">
                  Log In to your account
                </div>
                <div className="sm:pl-3 sm:col-span-9">
                  Enter your details below to log in to your account
                </div>
              </div>

              <Button
                className="hidden sm:block font-semibold text-[1rem] cursor-pointer dark:text-white relative bottom-7"
                onClick={() => router.push("/register")}
                variant="link"
              >
                Register?
              </Button>
            </div>
            <form
              className="py-4 flex flex-col items-center min-w-full"
              onSubmit={form.handleSubmit(onSubmitLoginHandler)}
            >
              <div className="min-w-[20rem] sm:min-w-[22rem]">
                <div className="pb-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="john_doe" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pb-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="johndoe@gmail.com"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pb-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel
                            className="font-semibold"
                            htmlFor="password"
                          >
                            Password
                          </FormLabel>
                          <Button
                            onClick={() => setShowForgotPass(true)}
                            variant="link"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                          >
                            Forgot your password?
                          </Button>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="johnDoe@123456"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center min-w-[15rem] sm:min-w-[22rem]">
                <Button
                  className="mb-4 min-w-full col-span-6 cursor-pointer"
                  type="submit"
                >
                  Submit
                </Button>
                <div className="min-w-full px-4 flex items-center gap-4 mb-3">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <span className="text-sm text-gray-500">or</span>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center">
                  <Button
                    variant="outline"
                    className="block sm:hidden min-w-full col-span-2 cursor-pointer"
                  >
                    Register with Email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full col-span-2 sm:min-w-[22rem] cursor-pointer"
                  >
                    Login with Google
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Form>
      </div>
      {showForgotPass ? (
        <ResetPass open={showForgotPass} onOpenChange={setShowForgotPass} />
      ) : null}
    </div>
  );
}
