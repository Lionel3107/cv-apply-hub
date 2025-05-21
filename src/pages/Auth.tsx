
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthBenefits from "@/components/auth/AuthBenefits";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">("sign-in");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left panel - Login form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6">
              {activeTab === "sign-in" ? "Welcome Back" : "Create an Account"}
            </h1>
            
            <Tabs 
              defaultValue="sign-in" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "sign-in" | "sign-up")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sign-in">
                <SignInForm />
              </TabsContent>
              
              <TabsContent value="sign-up">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right panel - Info and benefits */}
          <div className="hidden md:block">
            <AuthBenefits isSignIn={activeTab === "sign-in"} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
