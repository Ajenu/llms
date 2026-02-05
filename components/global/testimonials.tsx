"use client"

import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      company: "Tech Corp",
      image: "/api/placeholder/150/150",
      content: "EduLearn completely transformed my career. The courses are well-structured, and the instructors are amazing. I went from junior to senior developer in just 6 months!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Digital Agency",
      image: "/api/placeholder/150/150",
      content: "The flexibility of learning at my own pace while working full-time was incredible. The certificates helped me get a promotion and a 30% salary increase.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Startup Inc",
      image: "/api/placeholder/150/150",
      content: "I've tried many online learning platforms, but EduLearn stands out. The quality of content and community support is unmatched. Highly recommend!",
      rating: 5
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied learners who have transformed their careers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-start">
                  <Quote className="h-8 w-8 text-blue-600 opacity-20" />
                </div>

                {/* Rating */}
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-lg shadow-lg px-8 py-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">15,000+</div>
              <div className="text-gray-600">Reviews</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
