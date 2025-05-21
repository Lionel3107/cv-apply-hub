
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "This platform has revolutionized our hiring process. We've reduced our time-to-hire by 40% and found incredibly talented candidates that our old methods would have missed.",
    name: "Alex Morgan",
    position: "Head of Talent",
    company: "TechGiant Inc.",
    avatar: null,
  },
  {
    id: 2,
    content: "As a hiring manager, I've found exceptional talent through this platform. The AI-powered ranking system has been incredibly accurate at identifying the best matches for our team.",
    name: "Sarah Chen",
    position: "HR Director",
    company: "InnovateCorp",
    avatar: null,
  },
  {
    id: 3,
    content: "After struggling for months on other job platforms, I found my perfect role within days. The CV enhancement tool helped me highlight my skills in a way that really stood out to employers.",
    name: "Michael Patel",
    position: "Senior Developer",
    company: "FutureWorks",
    avatar: null,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted by Industry Leaders</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from recruiters and job seekers who have transformed their hiring and job search experience
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 pl-4 pr-4">
                  <Card className="border-none shadow-lg h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="flex justify-center mb-6">
                        <div className="bg-brand-blue p-3 rounded-full">
                          <Quote size={24} className="text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700 text-center text-lg mb-8 flex-grow">{testimonial.content}</p>
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
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
