import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-primary py-20 text-center text-white px-6 rounded-b-[4rem]">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Get in Touch<span className="text-accent">.</span></h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium">
          Have a question about our products or your order? 
          We're here to help you redefine your style.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-accent pb-4 inline-block">Contact Info</h2>
            
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-gray-50 text-primary rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                <FiMail />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 font-medium">Email Us</p>
                <p className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">support@pallet.com</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-gray-50 text-primary rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                <FiPhone />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 font-medium">Call Us</p>
                <p className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">+1 (555) 000-0000</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-gray-50 text-primary rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                <FiMapPin />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 font-medium">Visit Office</p>
                <p className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">123 Fashion Blvd, Suite 100 <br/>New York, NY 10001</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-10 space-y-4">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-medium">Follow Our Journey</p>
               <div className="flex gap-4">
                  {[
                    { icon: <FaFacebook />, link: "https://facebook.com" },
                    { icon: <FaInstagram />, link: "https://instagram.com" },
                    { icon: <FaTwitter />, link: "https://twitter.com" },
                    { icon: <FaLinkedin />, link: "https://linkedin.com" }
                  ].map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center text-xl shadow-sm border border-gray-100 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform hover:-translate-y-1"
                    >
                       {social.icon}
                    </a>
                  ))}
               </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2 bg-gray-50 p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                  placeholder="Inquiry for order, bulk, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full bg-white border border-gray-200 rounded-3xl px-6 py-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium resize-none"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-primary text-white py-5 px-12 rounded-full font-bold hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Sending...
                  </span>
                ) : (
                  <>
                    <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
