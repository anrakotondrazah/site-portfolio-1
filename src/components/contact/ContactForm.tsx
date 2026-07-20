import { useState, FormEvent, ChangeEvent } from "react";

interface FormData {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    service: "AI Product Photography",
    budget: "Let's discuss",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Fake submission with timeout to simulate transmission received
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  if (status === "success") {
    return (
      <div className="border border-cyber-cyan/30 bg-cyber-dark-3/80 p-8 relative text-center max-w-lg mx-auto">
        <span
          className="corner-bracket corner-bracket--tl"
          aria-hidden="true"
        />
        <span
          className="corner-bracket corner-bracket--tr"
          aria-hidden="true"
        />
        <span
          className="corner-bracket corner-bracket--bl"
          aria-hidden="true"
        />
        <span
          className="corner-bracket corner-bracket--br"
          aria-hidden="true"
        />

        <div className="text-4xl text-cyber-cyan mb-4 animate-pulse">✦</div>
        <h3 className="font-display text-sm tracking-widest text-cyber-cyan mb-2">
          TRANSMISSION REÇUE
        </h3>
        <p className="font-mono text-xs text-cyber-text-secondary leading-relaxed mb-6">
          Message received.
          <br />
          I'll get back to you within 24 hours.
          <br />
          While you wait — try the live demo above and generate your first AI
          visual for free.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto border border-cyber-border/30 bg-cyber-dark-3/60 p-6 sm:p-8 relative"
    >
      {/* Corners brackets */}
      <span className="corner-bracket corner-bracket--tl" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--tr" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--bl" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--br" aria-hidden="true" />

      {/* Field 1 — Name */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="name"
          className="font-mono text-mono-xs text-cyber-text-secondary uppercase"
        >
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="John Smith"
          className="bg-cyber-dark-2/80 border border-cyber-border/40 focus:border-cyber-cyan/60 px-4 py-3 font-mono text-xs text-cyber-text-primary outline-none transition-colors cursor-none"
        />
      </div>

      {/* Field 2 — Email */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="email"
          className="font-mono text-mono-xs text-cyber-text-secondary uppercase"
        >
          Your Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="john@company.com"
          className="bg-cyber-dark-2/80 border border-cyber-border/40 focus:border-cyber-cyan/60 px-4 py-3 font-mono text-xs text-cyber-text-primary outline-none transition-colors cursor-none"
        />
      </div>

      {/* Field 3 — Service */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="service"
          className="font-mono text-mono-xs text-cyber-text-secondary uppercase"
        >
          What do you need?
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="bg-cyber-dark-2/80 border border-cyber-border/40 focus:border-cyber-cyan/60 px-4 py-3 font-mono text-xs text-cyber-text-primary outline-none transition-colors cursor-none appearance-none"
        >
          <option>AI Product Photography</option>
          <option>AI Professional Portraits</option>
          <option>AI Cinematic Video (VEO)</option>
          <option>AI Brand Visual Identity</option>
          <option>AI Motion & Reels</option>
          <option>AI Strategy Consulting</option>
          <option>Custom / I'm not sure yet</option>
        </select>
      </div>

      {/* Field 4 — Budget */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="budget"
          className="font-mono text-mono-xs text-cyber-text-secondary uppercase"
        >
          Your Budget Range
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="bg-cyber-dark-2/80 border border-cyber-border/40 focus:border-cyber-cyan/60 px-4 py-3 font-mono text-xs text-cyber-text-primary outline-none transition-colors cursor-none appearance-none"
        >
          <option>Under $50</option>
          <option>$50 – $150</option>
          <option>$150 – $500</option>
          <option>$500+</option>
          <option>Let's discuss</option>
        </select>
      </div>

      {/* Field 5 — Project Description */}
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="message"
          className="font-mono text-mono-xs text-cyber-text-secondary uppercase"
        >
          Describe your project
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your brand, what you sell, and what kind of visuals you have in mind..."
          className="bg-cyber-dark-2/80 border border-cyber-border/40 focus:border-cyber-cyan/60 px-4 py-3 font-mono text-xs text-cyber-text-primary outline-none transition-colors cursor-none resize-none scrollbar-cyber"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full font-mono text-xs tracking-wider py-4 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/10 disabled:border-cyber-border/20 disabled:text-cyber-text-dim transition-all duration-300 cursor-none"
      >
        {status === "submitting" ? "SENDING BRIEF..." : "SEND MY BRIEF →"}
      </button>
    </form>
  );
}
