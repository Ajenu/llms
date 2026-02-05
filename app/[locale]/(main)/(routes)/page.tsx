import { getCategories, getCourses, getCoursesWithoutProgress, getCoursesWithProgress, getUserCourses } from '@/data'
import React from 'react'
import Categories from './_components/categories'
import SearchInput from '@/components/global/search-input'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CoursesList from '@/components/global/courses-list'
import { CourseProgressWithCatgeroy } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Award, Clock, ArrowRight, Play, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import Testimonials from '@/components/global/testimonials'


type Props = {
  searchParams: {
    title: string,
    categoryId: string
  }
}

const page = async({ searchParams } : Props) => {

    const categories = await getCategories()
    let courses;

    const user = await currentUser()

    if (user?.id) {
        courses = await getCoursesWithProgress({ userId: user.id, title: searchParams.title, categoryId: searchParams.categoryId })
    } else {
        courses = await getCoursesWithoutProgress({  title: searchParams.title, categoryId: searchParams.categoryId })
    }

    // Calculate stats (mock data for now)
    const totalStudents = 12500
    const totalCourses = courses.length
    const totalInstructors = 150
    const completionRate = 87

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-6 pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
                  Learn Without Limits
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                  Start, switch, or advance your career with more than 5,000 courses, Professional Certificates, and degrees from world-class universities and companies.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="#courses">
                    Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/sign-in">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-y">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{totalStudents.toLocaleString()}</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{totalCourses}</div>
                <div className="text-gray-600">Available Courses</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{totalInstructors}</div>
                <div className="text-gray-600">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <TrendingUp className="h-12 w-12 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{completionRate}%</div>
                <div className="text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We provide everything you need to succeed in your learning journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0 text-center space-y-4">
                  <div className="flex justify-center">
                    <Play className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Rich Video Content</h3>
                  <p className="text-gray-600">
                    High-quality video lessons with transcripts, subtitles, and playback controls for optimal learning experience.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0 text-center space-y-4">
                  <div className="flex justify-center">
                    <Clock className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Learn at Your Pace</h3>
                  <p className="text-gray-600">
                    Access courses anytime, anywhere. Learn at your own pace with lifetime access to purchased courses.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0 text-center space-y-4">
                  <div className="flex justify-center">
                    <Award className="h-16 w-16 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Certificates</h3>
                  <p className="text-gray-600">
                    Earn verified certificates upon completion to showcase your new skills and advance your career.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section id="courses" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Courses
              </h2>
              <p className="text-xl text-gray-600">
                Discover our most enrolled courses and start learning today
              </p>
            </div>

            {/* Mobile Search */}
            <div className='px-6 pt-6 md:hidden md:mb-0 block'>
              <SearchInput />
            </div>
            
            <div className='space-y-6'>
              <Categories 
                items={categories}
              />
              <CoursesList 
                items={courses}
              />
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/courses">
                  View All Courses <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of students already learning on our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link href="/sign-up">
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/teacher/create">
                    Become an Instructor
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
}

export default page