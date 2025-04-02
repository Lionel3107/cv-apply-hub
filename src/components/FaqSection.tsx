
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our platform
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
