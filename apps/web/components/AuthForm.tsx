"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@gtdraw/ui/components/form";
import { Input } from "@gtdraw/ui/components/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema, LoginUserType } from "@gtdraw/common/zod/";
import { Button } from "@gtdraw/ui/components/button";
import { useUserStore } from "@/providers/user-store-provider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Label } from "@gtdraw/ui/components/label";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import VerifyCode from "./verify-code";
import { MailType } from "@gtdraw/common/types/";
import ResetPass from "./reset-password";
import { cn } from "@gtdraw/ui/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const registerSchema = z.object({
    username: z
      .string()
      .min(1, { message: "User Name field is required!" })
      .trim(),
    fullName: z
      .string()
      .min(1, { message: "Full Name field is required!" })
      .trim(),
    email: z
      .string()
      .email({ message: "Provide Valid Email Id!" })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .trim()
      .min(6, "Password should be at least 6 characters long!")
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., !@#$%^&*)",
      }),
    avatar: z
      .any()
      .refine((file: FileList | undefined) => !file || file.length <= 1, {
        message: "You can only upload one file",
      })
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
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const {
    formState: { errors },
  } = form;

  const [showVerify, setShowVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { username, fullName, email, avatar, setUser } = useUserStore(
    (state) => state
  );

  const verifyTimerRef = useRef<NodeJS.Timeout | null>(null);

  //clean up timer after component unmounts
  useEffect(() => {
    return () => {
      if (verifyTimerRef.current) {
        clearTimeout(verifyTimerRef.current);
      }
    };
  }, []);

  const onSubmitRegisterHanlder = async (data: RegisterUserType) => {
    try {
      setLoading(true);
      const avatarFileList = form.getValues("avatar");
      const avatarFile = avatarFileList?.[0];

      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      console.log(avatarFile);
      if (avatarFile) formData.append("avatar", avatarFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/auth/register`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast("Verification Code To Verify Email Sent Successfully!", {
          description:
            "An Email with a Verification Code has been sent on User's Email!",
          action: {
            label: "Verify",
            onClick: (e) => {
              e.preventDefault();
              setShowVerify(true);
            },
          },
          duration: 5000,
        });
        if (verifyTimerRef.current) {
          clearTimeout(verifyTimerRef.current);
        }
        verifyTimerRef.current = setTimeout(() => {
          setShowVerify(true);
        }, 6000);
        setUser({
          username: response.data.data.username,
          fullName: response.data.data.fullName,
          email: response.data.data.email,
          ...(response.data.data.avatar
            ? { avatar: response.data.data.avatar }
            : {}),
        });
        setLoading(false);
      } else {
        toast.error("Sign Up Failed!", {
          description: response.data.message,
        });
      }
      console.log(response.data.data);
    } catch (error) {
      toast.error("Sign Up Failed!", {
        description: `${error}`,
      });
      console.log(
        "Axios Error Occurred while sending Register Request:\n",
        error
      );
    }
  };

  //Helped to test wheather store was updating or not by clging username, have to use useEffect because of async nature of state updates(i.e. username is still old value and haven't re-render so to check by clging username we have to use useEffect)
  // const formData = new FormData();

  // useEffect(() => {
  //   console.log("Printing User Name: ", username);
  //   console.log("Updated store: ", username);
  // }, [formData]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen px-4 overflow-auto">
      <div className="w-full max-w-md rounded-md py-6 px-4 sm:px-8 bg-white dark:bg-black">
        <Form {...form}>
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold">
                Sign Up to your account
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your details below to register your account
              </p>
              <Button
                className="hidden sm:inline-block text-sm font-semibold float-right -mt-8 cursor-pointer"
                onClick={() => router.push("/login")}
                variant="link"
              >
                Log In
              </Button>
            </div>

            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmitRegisterHanlder)}
            >
              {/** Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john_doe"
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

              {/** Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@gmail.com"
                        {...field}
                        type="email"
                        autoComplete="on"
                        autoSave="on"
                        autoCorrect="on"
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

              {/** Full Name */}
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
                        placeholder="John Doe"
                        {...field}
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

              {/** Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold">Password</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="johnDoe@123456"
                          {...field}
                          className={cn(
                            "w-full pr-10",
                            errors.password &&
                              "border-destructive ring-1 ring-destructive/50 focus:ring-destructive"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
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

              {/** Avatar */}
              <div>
                <Label htmlFor="picture" className="font-semibold">
                  Avatar
                </Label>
                <Input
                  id="picture"
                  type="file"
                  {...form.register("avatar")}
                  className="mt-1"
                />
              </div>

              {/** Submit */}
              <Button
                disabled={loading}
                type="submit"
                className="w-full cursor-pointer"
              >
                Submit
              </Button>

              {/** Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-sm text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              {/** Login Options */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="w-full grid-cols-1 sm:hidden cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Login with Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full grid-cols-1 cursor-pointer"
                >
                  Login with Google
                </Button>
              </div>
            </form>
          </div>
        </Form>

        {showVerify && (
          <VerifyCode
            type={MailType.VERIFY}
            open={showVerify}
            onOpenChange={setShowVerify}
          />
        )}
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
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const {
    formState: { errors },
  } = form;
  const { username, email, setUser } = useUserStore((state) => state);

  const onSubmitLoginHandler = async (data: LoginUserType) => {
    try {
      //send data to backend
      //update state after we receive success message from post request to login user
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        data,
        { withCredentials: true } //need to set this to true in register and login request to make sure other request which require cookies actually get cookies to send,else they won't have any cookies to send even after they set {withCredentials:true}.
      );
      if (!response.data.success) {
        toast.error("Sign Up Failed!", {
          description: "Error Occurred While Registering",
          duration: 5000,
        });
      }
      setUser(response.data.data);
    } catch (error) {
      console.error("Error Occurred while Signing in: ", error);
    }
  };

  const formData = new FormData();
  useEffect(() => {
    console.log("updated store: ", username);
  }, [formData]);

  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md rounded-md py-6 px-4 sm:px-8 bg-white dark:bg-black">
        <Form {...form}>
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold">
                Log In to your account
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1">
                Enter your details below to log in to your account
              </p>
              <Button
                className="hidden sm:inline-block text-sm font-semibold float-right -mt-8 cursor-pointer"
                onClick={() => router.push("/register")}
                variant="link"
                type="button" //to avoid getting this button to become type=submit
              >
                Register
              </Button>
            </div>

            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmitLoginHandler)}
            >
              {/** Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john_doe"
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

              {/** Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@gmail.com"
                        {...field}
                        type="email"
                        autoComplete="on"
                        autoSave="on"
                        autoCorrect="on"
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

              {/** Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold">Password</FormLabel>
                      <Button
                        onClick={(e) => {
                          setShowForgotPass(true);
                        }}
                        variant="link"
                        type="button"
                        className="text-sm underline-offset-4 hover:underline cursor-pointer"
                      >
                        Forgot your password?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="johnDoe@123456"
                          {...field}
                          className={cn(
                            "w-full pr-10", // Reserve space for icon
                            errors.password &&
                              "border-destructive ring-1 ring-destructive/50 focus:ring-destructive"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
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

              {/** Submit */}
              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>

              {/** Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-sm text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              {/** Login Options */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="w-full grid-cols-1 sm:hidden"
                >
                  Register with Email
                </Button>
                <Button variant="outline" className="w-full grid-cols-1">
                  Login with Google
                </Button>
              </div>
            </form>
          </div>
        </Form>
        {showForgotPass && (
          <ResetPass
            open={showForgotPass}
            onOpenChange={setShowForgotPass}
            setShowResetPass={setShowResetPass}
            showResetPass={showResetPass}
          />
        )}
        {showResetPass && (
          <VerifyCode
            type={MailType.RESET}
            open={showResetPass}
            onOpenChange={setShowResetPass}
          />
        )}
      </div>
    </div>
  );
}
