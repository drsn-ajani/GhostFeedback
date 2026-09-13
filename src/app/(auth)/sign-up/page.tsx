"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Ghost, Loader2 } from "lucide-react"


const SignUpPage = () => {
    const { toast } = useToast();
    const router = useRouter();

    const [username, setusername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setusername, 300);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setUsernameMessage('');
                setIsCheckingUsername(true);
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/sign-up`, data);
            toast({
                title: 'Success',
                description: response.data.message
            });
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error in signUp of User: ", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let erroMessage = axiosError.response?.data.message;
            toast({
                title: 'SignUp failed',
                description: erroMessage ?? 'Error signing up',
                variant: "destructive"
            });
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary via-primary/90 to-slate-900 px-4 py-12">
          <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-xl">
            <div className="text-center">
              <Ghost className="mx-auto mb-3 h-9 w-9 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Create your account
              </h1>
              <p className="mt-2 text-muted-foreground">Sign up to start your anonymous adventure</p>
            </div>
      
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      <FormMessage />
                      <p className={`text-sm ${usernameMessage == "Username is unique" ? 'text-emerald-600' : 'text-destructive'}`}>
                        {usernameMessage}
                      </p>
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
                          placeholder="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>
            </Form>
      
            <div className="text-center">
              <p className="text-muted-foreground">
                Already a member?{' '}
                <Link href="/sign-in" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
      
}

export default SignUpPage
