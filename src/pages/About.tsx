
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About CVApplyHub</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At CVApplyHub, we're dedicated to connecting talented individuals with their dream jobs. 
                Our platform simplifies the job search and application process, making it easier for 
                candidates to showcase their skills and for employers to find the perfect match for their teams.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2 leading-relaxed">
                <li>A streamlined job application process</li>
                <li>Direct CV uploads for immediate applications</li>
                <li>Carefully curated job listings from top companies</li>
                <li>User-friendly interface for both job seekers and employers</li>
                <li>Categorized job searches to find relevant opportunities</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2023, CVApplyHub began with a simple idea: job hunting shouldn't be stressful. 
                Our team of HR professionals and technology experts combined their knowledge to create
                a platform that addresses the common pain points in the recruitment process. Today, we're
                proud to have helped thousands of professionals find positions where they can thrive and grow.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg">Jane Doe</h3>
                  <p className="text-gray-600">CEO & Founder</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg">John Smith</h3>
                  <p className="text-gray-600">CTO</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg">Emily Johnson</h3>
                  <p className="text-gray-600">Head of HR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
