'use client'

import {
    Ghost,
    LogOut,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'


const Navbar = () => {
    const { data: session, status } = useSession()
    const user = session?.user as User
    const initial = (user?.username || user?.email || '?').charAt(0).toUpperCase()

    return (
        <nav className='sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md'>
            <div className='container flex h-16 items-center justify-between mx-auto px-4'>
                <Link className='flex items-center gap-2 text-xl font-bold text-primary' href="/">
                    <Ghost className="h-6 w-6" />
                    GhostFeedback
                </Link>
                {
                    status === 'loading' ? (
                        <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
                    ) : session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 rounded-full pl-2 pr-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                        {initial}
                                    </span>
                                    Menu
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <DropdownMenuLabel>Welcome, {user.username || user.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href='/sign-in'>
                                <Button variant="ghost">Sign in</Button>
                            </Link>
                            <Link href='/sign-up'>
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar

//     const { data: session } = useSession()
//     const user = session?.user as User

//     return (
//         <nav className='p-4 md:p-6 shadow-md'>
//             <div className='container flex flex-col md:flex-row justify-between items-center mx-auto'>
//                 <a className='text-xl font-bold mb-4 md:mb-8' href="#">Message-Generator</a>
//                 {
//                     session ? (
//                         <>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button className="outline-none" variant="outline">Menu</Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent className="w-56">
//                                     <DropdownMenuLabel>Welcome, {user.username || user.email}</DropdownMenuLabel>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem>
//                                         <LogOut className="mr-2 h-4 w-4" />
//                                         <span>Log out</span>
//                                         <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>

//                             {/* <span className='mr-4'>Welcome, {user.username || user.email} </span>
//                             <Button className='w-full md:w-auto' onClick={() => signOut()}>LogOut</Button> */}
//                         </>
//                     ) : (
//                         <Link href='/sign-in'>
//                             <Button className='w-full md:w-auto'>Login</Button>
//                         </Link>
//                     )
//                 }
//             </div>
//         </nav>
//     )
// }

// export default Navbar
