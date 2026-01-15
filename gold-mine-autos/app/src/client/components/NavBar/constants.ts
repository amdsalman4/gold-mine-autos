import { routes } from "wasp/client/router";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "How it Works", to: "/#how-it-works" },
  { name: "FAQ", to: "/#faq" },
  { name: "Pricing", to: routes.PricingPageRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  // { name: "AI Scheduler", to: routes.DemoAppRoute.to },
  // { name: "File Upload", to: routes.FileUploadRoute.to },
  { name: "Browse Inventory", to: routes.InventoryRoute.to },
  { name: "Pricing", to: routes.PricingPageRoute.to },
] as const;
