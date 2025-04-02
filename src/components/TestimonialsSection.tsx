
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "This platform helped me land my dream job at a top tech company within just 2 weeks of applying. The process was seamless and the interface is incredibly user-friendly.",
    name: "Alex Morgan",
    position: "Software Engineer",
    company: "TechGiant Inc.",
    avatar: null,
  },
  {
    id: 2,
    content: "As a hiring manager, I've found exceptional talent through this platform. The quality of candidates and the filtering tools make recruitment so much easier.",
    name: "Sarah Chen",
    position: "HR Manager",
    company: "InnovateCorp",
    avatar: null,
  },
  {
    id: 3,
    content: "After struggling for months on other job platforms, I found my perfect role within days. The category filters and company profiles gave me all the information I needed.",
    name: "Michael Patel",
    position: "Product Manager",
    company: "FutureWorks",
    avatar: null,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What People Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from job seekers and employers who have successfully used our platform
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <Card className="border-none shadow-lg mx-4">
                    <CardContent className="p-8">
                      <div className="flex justify-center mb-6">
                        <div className="bg-brand-blue p-3 rounded-full">
                          <Quote size={24} className="text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700 text-center text-lg mb-6">{testimonial.content}</p>
                      <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-3">
                          {testimonial.avatar ? (
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          ) : (
                            <AvatarFallback className="bg-brand-lightBlue text-brand-darkBlue">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">
                          {testimonial.position} at {testimonial.company}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-6 border-gray-200" />
              <CarouselNext className="-right-6 border-gray-200" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
