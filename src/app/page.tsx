import Link from "next/link";
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-accent rounded-lg flex items-center justify-center">
              <div className="size-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-primary">FirstContact <span className="text-accent">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-bold text-slate-600">Login</Button>
            <Link href="/onboarding">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
              <Zap size={14} className="fill-current" />
              Response time under 60 seconds
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-primary mb-6 leading-[1.1]">
              Never Miss a Real Estate <br className="hidden lg:block" />
              <span className="text-accent">Lead Again.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              FirstContact AI is the 24/7 multi-channel lead response agent that mirrors your personal voice and local expertise to qualify prospects within seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-extrabold px-10 py-7 text-lg rounded-2xl shadow-xl shadow-primary/10 flex items-center gap-2">
                  Start Your 14-Day Free Trial
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-slate-200 text-primary font-extrabold px-10 py-7 text-lg rounded-2xl hover:bg-slate-50">
                Book a Demo
              </Button>
            </div>
            
            {/* Hero Mockup Graphic */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden animate-slide-up">
              <div className="bg-slate-50 h-10 border-b border-slate-200 flex items-center px-4 gap-1.5">
                <div className="size-2.5 rounded-full bg-slate-300" />
                <div className="size-2.5 rounded-full bg-slate-300" />
                <div className="size-2.5 rounded-full bg-slate-300" />
              </div>
              <div className="p-4 md:p-8 bg-slate-50/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm h-80 flex flex-col p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                      <div className="h-4 w-12 bg-accent/20 rounded animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-slate-100 shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-1/4 bg-slate-100 rounded" />
                          <div className="h-10 w-3/4 bg-slate-50 rounded-2xl rounded-tl-none border border-slate-100" />
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="size-8 rounded-full bg-accent shrink-0 flex items-center justify-center text-white text-[10px] font-bold">AI</div>
                        <div className="space-y-2 flex-1 flex flex-col items-end">
                          <div className="h-3 w-1/4 bg-slate-100 rounded" />
                          <div className="h-14 w-4/5 bg-primary rounded-2xl rounded-tr-none text-white/90 p-3 text-[10px] overflow-hidden leading-tight">
                            &ldquo;Hi John! I see you&apos;re interested in the property on Maple St. Are you looking for a 3 or 4 bedroom home?&rdquo;
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                    <div className="h-32 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 text-slate-300">
                      <TrendingUp size={48} />
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-5/6 bg-slate-100 rounded" />
                      <div className="h-3 w-4/6 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-3">Powerful Capabilities</h2>
              <p className="text-4xl font-extrabold text-primary tracking-tight">Your 24/7 AI Sales Assistant</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<Clock className="text-accent" />} 
                title="60-Second Speed" 
                description="80% of leads go cold after 5 minutes. Our AI responds instantly across all channels."
              />
              <FeatureCard 
                icon={<Bot className="text-accent" />} 
                title="Your Personal Voice" 
                description="Our persona engine mirrors your unique tone and common phrases for a seamless handoff."
              />
              <FeatureCard 
                icon={<MessageSquare className="text-accent" />} 
                title="Multi-Channel" 
                description="Engage leads via SMS, Email, and Voice through one unified qualification pipeline."
              />
              <FeatureCard 
                icon={<CheckCircle2 className="text-accent" />} 
                title="Smart Briefing" 
                description="Receive appointment-ready prospect cards with verified budget, timeline, and intent."
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-3">Simplified Workflow</h2>
              <p className="text-4xl font-extrabold text-primary tracking-tight">How FirstContact AI Works</p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                <Step 
                  number={1} 
                  title="Connect Sources" 
                  description="Link Zillow, Facebook, or your site via simple webhooks." 
                />
                <Step 
                  number={2} 
                  title="Calibrate Voice" 
                  description="Upload samples of your texts and emails for the AI to learn." 
                />
                <Step 
                  number={3} 
                  title="AI Qualifications" 
                  description="AI engages every lead immediately and scores their intent." 
                />
                <Step 
                  number={4} 
                  title="Instant Handoff" 
                  description="Take over when they're ready to book an appointment." 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-[600px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-3">Pricing Plans</h2>
              <p className="text-4xl font-extrabold tracking-tight">Flexible plans for every agent</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard 
                title="Solo Agent" 
                price="$99" 
                description="Perfect for individual professionals."
                features={["Up to 100 leads/mo", "SMS & Email channels", "Persona calibration", "Standard support"]}
              />
              <PricingCard 
                title="Small Team" 
                price="$199" 
                description="Scale your team's lead response."
                featured
                features={["Up to 500 leads/mo", "All channels + Voice", "Multi-agent personas", "Priority support"]}
              />
              <PricingCard 
                title="Enterprise" 
                price="Custom" 
                description="For large brokerage requirements."
                features={["Unlimited leads", "Advanced CRM integrations", "Custom AI training", "Dedicated account manager"]}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-accent">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-primary tracking-tight mb-8">
              Ready to turn more leads <br /> into appointments?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-primary hover:bg-slate-800 text-white font-extrabold px-12 py-8 text-xl rounded-2xl shadow-2xl">
                  Get Started Now
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-primary/70 font-bold uppercase tracking-widest text-sm">
              14-Day Free Trial • No Credit Card Required
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-60">
            <div className="size-6 bg-accent rounded flex items-center justify-center">
              <div className="size-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-primary">FirstContact AI</span>
          </div>
          <div className="flex gap-8 text-slate-400 text-sm font-bold uppercase tracking-tighter">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 FirstContact AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="size-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
      <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-xl relative z-10">
        {number}
      </div>
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, description, features, featured = false }: { 
  title: string, 
  price: string, 
  description: string, 
  features: string[],
  featured?: boolean 
}) {
  return (
    <div className={`p-8 rounded-3xl border ${featured ? 'bg-primary border-accent/30 shadow-2xl scale-105' : 'bg-slate-800/50 border-slate-700'} relative`}>
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-6">{description}</p>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-extrabold">{price}</span>
        {price !== "Custom" && <span className="text-slate-400 text-sm">/mo</span>}
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
            <CheckCircle2 size={16} className="text-accent shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Button className={`w-full font-extrabold py-6 rounded-xl ${featured ? 'bg-accent hover:bg-accent/90 text-primary' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
        Choose Plan
      </Button>
    </div>
  );
}
