import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 font-sans text-slate-900">
      <main className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
            <div className="w-8 h-8 bg-white rounded-md"></div>
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          FirstContact <span className="text-accent">AI</span>
        </h1>
        
        <p className="text-xl text-slate-600 leading-relaxed">
          The 24/7 AI lead response agent for solo real estate professionals. 
          Mirroring your voice, qualifying leads in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-primary/10">
            Join the Waitlist
          </button>
          <button className="bg-white text-primary border-2 border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
            View Demo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div>
            <p className="text-3xl font-bold text-primary">60s</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mt-1">Response Time</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mt-1">Availability</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">Multi</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mt-1">Channel</p>
          </div>
        </div>
      </main>
      
      <footer className="mt-20 text-slate-400 text-sm font-medium">
        © 2026 FirstContact AI. All rights reserved.
      </footer>
    </div>
  );
}
