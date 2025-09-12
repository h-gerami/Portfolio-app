import type { ImageSourcePropType } from "react-native";
import image002 from "@/assets/images/image002.png";
import image003 from "@/assets/images/image003.png";
import image004 from "@/assets/images/image004.png";
import image005 from "@/assets/images/image005.png";
import image006 from "@/assets/images/image006.png";
import image007 from "@/assets/images/image007.png";
import image008 from "@/assets/images/image008.png";
import image009 from "@/assets/images/image009.png";
import image010 from "@/assets/images/image010.png";
import image011 from "@/assets/images/image011.png";
import image012 from "@/assets/images/image012.png";
import image013 from "@/assets/images/image013.png";
import image018 from "@/assets/images/image018.png";
import image019 from "@/assets/images/image019.png";
import image020 from "@/assets/images/image020.png";
import image021 from "@/assets/images/image021.png";
import image022 from "@/assets/images/image022.png";

export type PrjName =
  | "Gardenia"
  | "quickclaim"
  | "Lerne24"
  | "Hihab"
  | "HoomQC";

export type Prj = {
  title: PrjName;
  description: string;
  images: ImageSourcePropType[];
  achievements: string[];
};

export const projects: Array<Prj> = [
  {
    title: "Gardenia",
    description:
      "IoT-enabled app that controls devices over Bluetooth and WiFi. Includes built-in shop and notification system.",
    images: [image002, image003, image004],
    achievements: [
      "Developed IoT mobile app for iOS & Android using React Native",
      "Integrated GraphQL APIs for efficient data querying",
      "Engineered mobile connectivity via WiFi, Bluetooth, UDP",
      "Implemented custom Bluetooth protocols",
      "Handled microprocessor-level device interactions",
      "Managed complex state using Redux",
      "Led Agile collaboration with Jira",
    ],
  },
  {
    title: "quickclaim",
    description:
      "Complete NDIS SaaS platform. Built mobile apps (QC Card & QC Pay) with live integration to NDIS API and finance systems.",
    images: [image005, image006],
    achievements: [
      "Developed QC-card & QC-pay apps using React Native",
      "Enabled financial services for millions of Australians with disabilities",
      "Built secure RESTful APIs using Node.js & AWS",
      "Automated testing for APIs & mobile",
      "Integrated NDIS, CRMs, and finance platforms",
      "Collaborated in Agile teams using GitLab CI/CD",
    ],
  },
  {
    title: "Lerne24",
    description:
      "Language learning app for German and French. Gamified learning, multi-language support, clean UI.",
    images: [image007],
    achievements: [
      "Built hybrid mobile app with Ionic & React",
      "Custom interactive plugins",
      "Real-time chat using FeathersJS & MongoDB",
      "Push notifications via Firebase",
      "Detailed technical documentation",
    ],
  },
  {
    title: "Hihab",
    description:
      "Cross-platform habit tracker app in English and Persian. Helps users build routines and stay motivated.",
    images: [image008, image009, image010, image011, image012, image013],
    achievements: [
      "Developed habit tracker in React Native",
      "Custom pie chart with react-native-svg",
      "Used React Hooks for state & lifecycle",
      "Implemented GraphQL APIs",
    ],
  },
  {
    title: "HoomQC",
    description:
      "Internal tool to test SmartHoom Bluetooth IoT devices. Supports signal strength checks and firmware-level communication.",
    images: [image018, image019, image020, image021, image022],
    achievements: [
      "Built cross-platform app for Bluetooth IoT testing",
      "Real-time signal strength & diagnostics",
      "Custom native modules for firmware control",
      "Automated regression testing for QA",
    ],
  },
] as const;
