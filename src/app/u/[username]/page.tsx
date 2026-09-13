'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const parseStringMessages = (messageString: string): string[] => {
  let cleanedString = messageString.replace(/0:/g, '');
  cleanedString = cleanedString.replace(/"/g, '');

  // Split the cleaned string by '||'
  return cleanedString.split(specialChar).map(msg => msg.trim()).filter(msg => msg.length > 0);
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>(parseStringMessages(initialMessageString));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      const response = await axios.post('/api/suggest-messages', {
        prompt: "Create a paragraph that consist list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
      });
      const newMessages = parseStringMessages(response.data); // Adjust based on API response format
      setMessages(newMessages);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to fetch suggested messages');
      console.error('Error fetching messages:', error);
    }
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/40 p-5">

      <div className="container mx-auto max-w-4xl rounded-2xl border bg-card p-6 shadow-lg md:p-10">
        <h1 className="mb-2 text-center text-3xl font-bold text-foreground md:text-4xl">
          Send an Anonymous Message
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          to <span className="font-semibold text-primary">@{username}</span>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>


        <Separator className="mt-10 mb-10" />

        <div className="my-8 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Button
              onClick={fetchSuggestedMessages}
              variant="secondary"
              className="w-full sm:w-2/4"
              disabled={isLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Suggest Messages
            </Button>
            <p className="text-center text-muted-foreground">Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {errorMessage ? (
                <p className="text-center text-destructive">{errorMessage}</p>
              ) : (
                messages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto w-full whitespace-normal text-left"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4 text-muted-foreground">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}