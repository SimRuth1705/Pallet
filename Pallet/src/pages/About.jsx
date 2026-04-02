import React from "react";
import { FiTarget, FiAward, FiShield, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import heroImg from "../assets/heroimg.png";

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="About Pallet"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-6 tracking-tight">
            The Pallet Story<span className="text-accent">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
            Redefining modern fashion through curated design, 
            exceptional quality, and a commitment to timeless elegance.
          </p>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 border-l-4 border-primary pl-6">
              Our Heritage
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in 2024, **Pallet** began with a simple yet powerful vision: 
              to bridge the gap between premium luxury and everyday accessibility. 
              We believe that fashion is more than just clothing—it's a form of 
              self-expression that should be both sustainable and sophisticated.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every piece in our collection is handpicked and rigorously tested 
              to ensure it meets our high standards for comfort, durability, 
              and effortless style.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
               <img src={heroImg} alt="Brand Vision" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-24 px-6 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-900">Our Core Values</h2>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full"></div>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">The principles that guide every decision we make at Pallet.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FiTarget />, title: "Precision", desc: "Attention to detail in every stitch and design choice." },
              { icon: <FiAward />, title: "Quality", desc: "Only the finest materials survive our selection process." },
              { icon: <FiShield />, title: "Ethics", desc: "Committed to sustainable sourcing and fair production." },
              { icon: <FiUsers />, title: "Community", desc: "Building a global network of style-conscious individuals." }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group">
                <div className="text-4xl text-primary mb-6 p-4 bg-gray-50 rounded-2xl inline-block group-hover:bg-primary group-hover:text-white transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Motto Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-accent text-6xl opacity-50 font-serif underline decoration-primary">"</div>
          <h2 className="text-4xl md:text-5xl font-brand text-primary leading-tight">
            Style is a language, <br/>
            <span className="text-gray-900 italic">quality is our promise.</span>
          </h2>
          <div className="w-16 h-1 bg-gray-200 mx-auto rounded-full"></div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">— The Pallet Manifesto</p>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 bg-primary text-white text-center rounded-t-[4rem]">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h3 className="text-3xl font-bold">Join the Journey</h3>
          <p className="text-white/80 text-lg leading-relaxed font-medium">
            We're just getting started. Explore our latest collections and 
            experience the Pallet difference today.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/collections/all?new=true" className="px-10 py-4 bg-white text-primary rounded-full font-bold hover:bg-accent transition shadow-xl inline-block">Shop New</Link>
             <Link to="/contact" className="px-10 py-4 border-2 border-white/30 rounded-full font-bold hover:bg-white/10 transition inline-block">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
