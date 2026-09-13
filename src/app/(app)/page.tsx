'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircleHeart, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const features = [
  {
    icon: ShieldCheck,
    title: '100% Anonymous',
    description: "Senders' identities are never stored or shared with you.",
  },
  {
    icon: Sparkles,
    title: 'AI-Suggested Prompts',
    description: 'Not sure what to write? Get instant, friendly question ideas.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Honest Feedback',
    description: 'Learn what people really think in a safe, judgment-free way.',
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session;

  return (
    <>
      <main className="flex-grow bg-gradient-to-b from-primary via-primary/95 to-slate-900 text-white">
        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center md:py-28">
          <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium tracking-wide text-white/90">
            Free & anonymous, always
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Discover the Power of{' '}
            <span className="text-primary-foreground/90 underline decoration-white/30 decoration-4 underline-offset-4">
              Anonymous Feedback
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
            With GhostFeedback, your thoughts and opinions remain completely anonymous.
            Share your link and let people tell you what they really think.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Create Your Board
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-16 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
            >
              <Icon className="mx-auto h-8 w-8 text-white/90" />
              <h3 className="mt-3 font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/70">{description}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-20">
          <h2 className="mb-6 text-xl font-semibold text-white/90 md:text-2xl">
            See what others are receiving
          </h2>
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            className="w-full max-w-lg md:max-w-2xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="border-white/10 bg-white/5 text-white backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                      <Mail className="h-6 w-6 flex-shrink-0 text-white/70" />
                      <div className="flex-1">
                        <p className="text-white/80">{message.content}</p>
                        <p className="mt-2 text-xs text-white/50">
                          Received on: {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
            <CarouselNext className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
          </Carousel>
        </section>
      </main>

      <footer className="bg-slate-950 p-4 text-center text-sm text-white/50">
        © {new Date().getFullYear()} GhostFeedback. All rights reserved.
      </footer>
    </>
  );
}