"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Search, User, BookOpen, GraduationCap, Settings } from 'lucide-react'
import { currentUser } from '@/lib/auth'
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModeToggle } from './mode-toggle'
import SwitchLang from './switch-lang'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <GraduationCap className="h-9 w-9 text-blue-600 transform group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduLearn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/courses" 
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 py-2 group"
            >
              Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/categories" 
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 py-2 group"
            >
              Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/instructors" 
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 py-2 group"
            >
              Instructors
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/enterprise" 
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 py-2 group"
            >
              Enterprise
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme & Language Toggle */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <SwitchLang />
              </div>
              <div className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <ModeToggle />
              </div>
            </div>

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-200 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-4 border-b">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-gray-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center py-2 px-4 hover:bg-blue-50 transition-colors">
                      <User className="mr-3 h-4 w-4 text-blue-600" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/teacher/courses" className="flex items-center py-2 px-4 hover:bg-blue-50 transition-colors">
                      <BookOpen className="mr-3 h-4 w-4 text-blue-600" />
                      <span>My Courses</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center py-2 px-4 hover:bg-blue-50 transition-colors">
                      <Settings className="mr-3 h-4 w-4 text-blue-600" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/sign-out" className="flex items-center py-2 px-4 hover:bg-red-50 text-red-600 transition-colors">
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  asChild
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="px-6 py-4 space-y-2">
              <Link 
                href="/courses" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-3 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-3 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/instructors" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-3 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Instructors
              </Link>
              <Link 
                href="/enterprise" 
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-3 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Enterprise
              </Link>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <SwitchLang />
                  <ModeToggle />
                </div>
                
                {!session ? (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 transition-colors"
                      asChild
                    >
                      <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      asChild
                    >
                      <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 transition-colors"
                      asChild
                    >
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 transition-colors"
                      asChild
                    >
                      <Link href="/teacher/courses" onClick={() => setIsMobileMenuOpen(false)}>
                        My Courses
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 transition-colors"
                      asChild
                    >
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        Profile
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-red-50 text-red-600 transition-colors"
                      asChild
                    >
                      <Link href="/sign-out" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign out
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
