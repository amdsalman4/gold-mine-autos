import {
  CarIcon,
  SearchIcon,
  MailboxIcon,
  FileIcon,
  FilterIcon,
  BookmarkIcon,
} from "lucide-react";
import daBoiAvatar from "../client/static/da-boi.webp";
import kivo from "../client/static/examples/iaai_logo.png";
import messync from "../client/static/examples/nta_logo.jpg";
import microinfluencerClub from "../client/static/examples/copart_logo.svg";
import promptpanda from "../client/static/examples/adesa_auction.svg";
import reviewradar from "../client/static/examples/manheim_logo.png";
import fb_logo from "../client/static/examples/fb_log.png";
import searchcraft from "../client/static/examples/searchcraft.webp";
import { BlogUrl, DocsUrl } from "../shared/common";
import type { GridFeature } from "./components/FeaturesGrid";

export const features: GridFeature[] = [
  {
    name: "Browse Listings",
    description:
      "Explore a curated selection of vehicles with detailed specs and photos",
    icon: CarIcon,
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Custom Requests",
    description:
      "Can't find what you're looking for? Submit a custom request for specific car types",
    icon: SearchIcon,
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Private Email Alerts",
    description: "Get notified instantly when your dream car becomes available",
    icon: MailboxIcon,
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Detailed Reports",
    description:
      "Comprehensive calculated reports on vehicle history, value, and condition",
    icon: FileIcon,
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Smart Filters",
    description:
      "Filter by make, model, year, price, and more to find exactly what you need",
    icon: FilterIcon,
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Saved Searches",
    description:
      "Save your favorite searches and pick up right where you left off",
    icon: BookmarkIcon,
    href: DocsUrl,
    size: "medium",
  },
];

// ... rest of your code

export const testimonials = [
  {
    name: "Da Boi",
    role: "Wasp Mascot",
    avatarSrc: daBoiAvatar,
    socialUrl: "https://twitter.com/wasplang",
    quote: "I don't even know how to code. I'm just a plushie.",
  },
  {
    name: "Mr. Foobar",
    role: "Founder @ Cool Startup",
    avatarSrc: daBoiAvatar,
    socialUrl: "",
    quote: "This product makes me cooler than I already am.",
  },
  {
    name: "Jamie",
    role: "Happy Customer",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "My cats love it!",
  },
];

export const faqs = [
  {
    id: 1,
    question: "What's this actually worth to my business?",
    answer:
      "We deliver the highest-margin vehicles to fill your inventory with cars that actually make money. Think of it as a full-time employee searching every auction 24/7, finding the cream of the crop and alerting you instantly. While competitors waste hours manually checking sites and miss 60-70% of inventory, you're acting on the best deals first—saving 30+ hours monthly and gaining a serious competitive edge.",
    href: "#",
  },
  {
    id: 2,
    question: "Can I request specific vehicles I'm looking for?",
    answer:
      "Yes! If current listings don't have what you need, submit a custom request with your exact criteria. We'll actively monitor and alert you the moment matching vehicles appear on any platform.",
    href: "#",
  },
  {
    id: 3,
    question: "Do you actually listen to customer feedback?",
    answer:
      "Absolutely. We're still early and building this based on what real dealers and flippers actually need. Have a feature request or see something that could work better? We're all ears and push updates regularly based on your feedback.",
    href: "#",
  },
  {
    id: 4,
    question: "Which auction sites are included?",
    answer:
      "IAAI Canada, Copart Canada, North Toronto Auction, Adesa Canada, and Facebook Marketplace. If there's another platform you want us to add, just let us know.",
    href: "#",
  },
  {
    id: 5,
    question: "How often are listings updated?",
    answer:
      "We refresh data multiple times per day and send instant email alerts when vehicles matching your saved searches appear. You'll know about new inventory before most of your competition.",
    href: "#",
  },
];

export const footerNavigation = {
  app: [
    { name: "Documentation", href: DocsUrl },
    { name: "Blog", href: BlogUrl },
  ],
  company: [
    { name: "About", href: "https://wasp.sh" },
    { name: "Privacy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export const examples = [
  {
    name: "IAAI Canada",
    // description: "Describe your example here.",
    imageSrc: kivo,
    href: "#",
  },
  {
    name: "North Toronto Auction",
    imageSrc: messync,
    href: "#",
  },
  {
    name: "Copart Canada",

    imageSrc: microinfluencerClub,
    href: "#",
  },
  {
    name: "Adesa Canada",

    imageSrc: promptpanda,
    href: "#",
  },
  {
    name: "Facebook Marketplace",

    imageSrc: fb_logo,
    href: "#",
  },
];
