
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "To create an account, click on the 'Sign Up' button in the top right corner. Fill in your details, verify your email address, and you're all set to start using our platform.",
  },
  {
    question: "Is it free to post jobs?",
    answer: "We offer various pricing tiers, including a free tier with limited features for small businesses. For unlimited job postings and premium features, check out our paid plans.",
  },
  {
    question: "How can I upload my CV?",
    answer: "You can upload your CV through your user profile or directly from the home page using the 'Upload CV' section. We accept PDF, DOC, and DOCX formats up to 5MB in size.",
  },
  {
    question: "What happens after I apply for a job?",
    answer: "After applying, your application will be sent directly to the employer. You can track the status of your applications in the 'My Applications' section of your dashboard.",
  },
  {
    question: "Can I edit my job posting after publishing?",
    answer: "Yes, you can edit your job postings at any time through your company dashboard. Updates will be reflected immediately across the platform.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-brand-blue/10 p-3 rounded-full">
              <HelpCircle className="h-6 w-6 text-brand-blue" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform or contact our support team for further assistance
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className={index !== faqs.length - 1 ? "border-b border-gray-100" : ""}
                  >
                    <AccordionTrigger className="text-left text-lg font-medium px-6 py-4 hover:bg-gray-50 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 px-6 pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <p className="text-gray-500">
              Still have questions? <a href="#" className="text-brand-blue font-medium hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
