// src/constants/Constant.ts

export const CONTACT_NUMBERS = "+91 9967442515 , 8879798736";

export const WHATSAPP_NUMBER = "8879798736";

export const BRANCH_ADDRESS = "Thane West - 400601;";

export const LOGO = "/logo-gurukul-new.png";

export const EMAIL = "kgurukuls09@gmail.com";

export const SLOGAN = "Every Topper Starts With A Question";

export const ADDRESS =
    "6, Kavita CHS, Opp. Pratap Cinema, Kolbad Road";

export interface Student {
    image: string;
    rank: string;
    name: string;
    badge: "gold" | "silver" | "bronze";
}

export const STUDENTS: Student[] = [
    {
        image: "/first.jpg",
        rank: "1st",
        name: "🏆 Saumya Bhide",
        badge: "gold"
    },
    {
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
        rank: "2nd",
        name: "🥈 Ananya Patel",
        badge: "silver",
    },
    {
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        rank: "3rd",
        name: "🥉 Aman Verma",
        badge: "bronze",
    },
];