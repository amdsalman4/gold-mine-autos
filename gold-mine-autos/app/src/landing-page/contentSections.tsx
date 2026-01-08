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
    name: "Cool Feature 1",
    description: "Your feature",
    emoji: "🤝",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 2",
    description: "Feature description",
    emoji: "🔐",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 3",
    description: "Describe your cool feature here",
    emoji: "🥞",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Cool Feature 4",
    description: "Describe your cool feature here",
    emoji: "💸",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Cool Feature 5",
    description: "Describe your cool feature here",
    emoji: "💼",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Cool Feature 6",
    description: "It is cool",
    emoji: "📈",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 7",
    description: "Cool feature",
    emoji: "📧",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 8",
    description: "Describe your cool feature here",
    emoji: "🤖",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Cool Feature 9",
    description: "Describe your cool feature here",
    emoji: "🚀",
    href: DocsUrl,
    size: "medium",
  },
];

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
    question: "Whats the meaning of life?",
    answer: "42.",
    href: "https://en.wikipedia.org/wiki/42_(number)",
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
