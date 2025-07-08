import { motion } from "framer-motion";
import { CheckCircle, Users, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const companyLogos = [
  { name: "TechCorp", logo: "TC" },
  { name: "InnovateX", logo: "IX" },
  { name: "DataFlow", logo: "DF" },
  { name: "CloudTech", logo: "CT" },
  { name: "NextGen", logo: "NG" },
  { name: "FutureWorks", logo: "FW" },
  { name: "SmartSystems", logo: "SS" },
  { name: "DevSolutions", logo: "DS" }
];

const metrics = [
  {
    icon: Users,
    value: "10,000+",
    label: "Successful Placements",
    description: "Candidates placed in their dream jobs"
  },
  {
    icon: Clock,
    value: "60%",
    label: "Faster Hiring",
    description: "Reduction in time-to-hire"
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    description: "Of placements still active after 1 year"
  },
  {
    icon: CheckCircle,
    value: "500+",
    label: "Partner Companies",
    description: "Trust our platform for their hiring needs"
  }
];

const TrustedCompaniesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Trusted Worldwide
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powering Success for Leading Companies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of forward-thinking companies that have transformed their hiring process with our platform
            </p>
          </motion.div>
        </div>

        {/* Company Logos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 mb-20"
        >
          {companyLogos.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <span className="text-xl font-bold text-primary">{company.logo}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                <metric.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">{metric.value}</h3>
              <h4 className="text-lg font-semibold text-foreground mb-2">{metric.label}</h4>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Ready to join these industry leaders?
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>No setup fees</span>
            <span className="text-border">•</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Cancel anytime</span>
            <span className="text-border">•</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>24/7 support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedCompaniesSection;