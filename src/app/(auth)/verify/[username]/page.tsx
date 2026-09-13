'use client'
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Ghost } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';

const VerifyAccountPage = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast({
                title: 'Verification Succesfull',
                description: response.data.message,
            })
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errormessage = axiosError.response?.data.message;
            toast({
                title: 'Verifiaction Failed',
                description: errormessage,
                variant: 'destructive'
            })
        }

    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary via-primary/90 to-slate-900 px-4 py-12">
            <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-xl">
                <div className="text-center">
                    <Ghost className="mx-auto mb-3 h-9 w-9 text-primary" />
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Verify Your Account
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Please enter the verification code we sent to your email to activate your account.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="Enter your code"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default VerifyAccountPage
