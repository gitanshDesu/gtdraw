"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@gtdraw/ui/components/form";
import { Input } from "@gtdraw/ui/components/input";
import {
  registerUserSchema,
  RegisterUserType,
} from "@gtdraw/common/registerUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema, LoginUserType } from "@gtdraw/common/loginUser";
import { Button } from "@gtdraw/ui/components/button";

const onSubmit = (values: RegisterUserType | LoginUserType) => {
  console.log(values);
};

export function RegisterForm() {
  const registerSchema = registerUserSchema;
  const form = useForm<RegisterUserType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center bg-slate-400 text-black md:min-w-[20rem] max-h-full py-4 px-8 rounded-md">
        <Form {...form}>
          <div>
            <div className="w-full max-w-sm flex items-center  ">
              <div className="md:grid md:grid-cols-7">
                <div className="font-semibold md:col-span-7">
                  Sign Up to your account
                </div>
                <div className="md:col-span-6">
                  Enter your details below to register your account
                </div>
              </div>
              <Button
                className="font-semibold text-[1rem] cursor-pointer text-black"
                variant="link"
              >
                Log In
              </Button>
            </div>
            <form
              className="py-4 flex flex-col items-center min-w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="md:min-w-[22rem]">
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
                          <Input
                            className=" dark:bg-red-100"
                            placeholder="john_doe"
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
                          <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
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
              <div className="flex flex-col items-center justify-center min-w-[15rem] md:min-w-[22rem]">
                <Button
                  className="mb-4 min-w-full col-span-6 cursor-pointer"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  variant="outline"
                  className="min-w-full col-span-6 cursor-pointer"
                >
                  Login with Google
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
}

export function LoginForm() {
  const loginSchema = loginUserSchema;
  const form = useForm<LoginUserType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john_doe" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
          </form>
        </Form>
        <Button type="submit">Submit</Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </div>
    </>
  );
}
