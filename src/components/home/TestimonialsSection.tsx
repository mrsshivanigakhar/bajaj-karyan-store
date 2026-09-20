import React from "react";
import { Star, Quote, CheckCircle, Heart, ThumbsUp } from "lucide-react";
import { getProductTheme } from "@/lib/product-themes";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  quote: string;
  tag: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Mrs. Harpreet Kaur",
    location: "Mall Road, Firozpur Cantt",
    rating: 5,
    date: "Verified Buyer • 2 weeks ago",
    quote:
      "Best kiryana service in Firozpur. The Atta and pure Desi Ghee quality is uncompromised. Being able to check the items at my doorstep before paying gives complete peace of mind!",
    tag: "Monthly Staples & Ghee",
    initials: "HK",
  },
  {
    id: "2",
    name: "Rajesh Sharma",
    location: "Main Bazar, Firozpur City",
    rating: 5,
    date: "Verified Buyer • 1 month ago",
    quote:
      "I ordered dry fruits and confectionery for festive gifting. The packaging was immaculate, California almonds were super fresh, and the delivery boy was very courteous.",
    tag: "Dry Fruits & Sweets",
    initials: "RS",
  },
  {
    id: "3",
    name: "Simranjeet Singh",
    location: "Basti Balochan, Firozpur",
    rating: 5,
    date: "Verified Buyer • 3 weeks ago",
    quote:
      "We have been buying our monthly rations from Bajaj karyana for over 15 years. Now building our shopping list with custom weights online has made everything effortless.",
    tag: "Custom Weight Dals & Rice",
    initials: "SS",
  },
  {
    id: "4",
    name: "Neha Gupta",
    location: "Border Road, Firozpur",
    rating: 5,
    date: "Verified Buyer • 5 days ago",
    quote:
      "Finding 250g and 500g spice packs online is impossible elsewhere. Bajaj karyana packs exactly what I ask for, and market-rate pricing is totally honest and transparent.",
    tag: "Spices & Bakery Essentials",
    initials: "NG",
  },
];

export function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-8 sm:p-12 shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#800f2f] text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#800f2f]" />
            <span>Loved by Firozpur Families</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            What Our Customers Say
          </h2>

          <p className="text-sm text-gray-700 mt-2">
            Real experiences from Firozpur households who rely on Bajaj karyana
            Store for their daily groceries and celebrations.
          </p>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-gray-800">4.9 / 5.0</span>
            <span>based on 250+ neighborhood reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, idx) => {
            const theme = getProductTheme(idx);
            const avatarGradients = [
              "bg-gradient-to-br from-[#800f2f] to-[#ff4d6d]",
              "bg-gradient-to-br from-amber-700 to-amber-500",
              "bg-gradient-to-br from-emerald-700 to-emerald-500",
              "bg-gradient-to-br from-[#a4133c] to-[#ff758f]",
            ];
            const avatarBg = avatarGradients[idx % avatarGradients.length];

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between bg-white rounded-2xl p-6 border ${theme.border} shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group`}
              >
                <div className="space-y-3">
                  {/* Quote Icon & Stars */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-gray-300 group-hover:text-rose-300 transition-colors" />
                  </div>

                  {/* Review Quote */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
                  >
                    {item.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h4
                        className={`font-semibold text-xs sm:text-sm text-gray-900 ${theme.accentHover} truncate`}
                      >
                        {item.name}
                      </h4>
                      <span
                        title="Verified Customer"
                        className="inline-flex items-center"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">
                      {item.location}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-medium ${theme.categoryTag} px-2 py-0.5 rounded-md`}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee Bar */}
        <div className="mt-8 pt-6 border-t border-rose-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-[#800f2f]" />
            <span className="font-medium">
              100% Satisfaction Guarantee on Every Delivery
            </span>
          </div>
          <span className="text-rose-600 font-medium">
            Have a question or feedback? Contact us anytime.
          </span>
        </div>
      </div>
    </section>
  );
}
