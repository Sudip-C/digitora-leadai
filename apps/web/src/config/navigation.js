import {
  BadgeCheck,
  BarChart3,
  Kanban,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Search,
  Settings,
  Users,
  Workflow,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Overview",
    path: "/",
    icon: LayoutDashboard,
    description: "Monitor pipeline health, outreach activity, and priority tasks.",
  },
  {
    label: "Lead Finder",
    path: "/lead-finder",
    icon: Search,
    description: "Configure searches and discover potential businesses.",
  },
  {
    label: "Review Queue",
    path: "/review",
    icon: ListChecks,
    description: "Review new, duplicate, or low-confidence lead candidates.",
  },
  {
    label: "Leads",
    path: "/leads",
    icon: Users,
    description: "Search, filter, and manage every qualified lead.",
  },
  {
    label: "Pipeline",
    path: "/pipeline",
    icon: Kanban,
    description: "Track leads across the complete sales process.",
  },
  {
    label: "Inbox",
    path: "/inbox",
    icon: MessageSquare,
    description: "View conversations and respond to interested leads.",
  },
  {
    label: "Approvals",
    path: "/approvals",
    icon: BadgeCheck,
    description: "Review AI-generated messages before they are sent.",
  },
  {
    label: "Sequences",
    path: "/sequences",
    icon: Workflow,
    description: "Configure controlled follow-up sequences and stop conditions.",
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    description: "Measure lead sources, outreach, meetings, and conversions.",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    description: "Manage targeting rules, integrations, limits, and team access.",
  },
];
