// src/constants/Constant.ts

export const CONTACT_NUMBERS = "+91 9967442515 , 8879798736";

export const WHATSAPP_NUMBER = "9082187414";

export const BRANCH_ADDRESS = "Thane West - XXXXXX;";

export const LOGO = "/logo-gurukul-new.png";

export const EMAIL = "riyaachipdey@gmail.com";

export const SLOGAN = "Every Topper Starts With A Question";

export const ADDRESS =
    "6, Kavita CHS, Opp. Pratap Cinema, Kolbad Road, Thane (W) - 400066";

export interface Student {
    image: string;
    rank: string;
    name: string;
    badge: "gold" | "silver" | "bronze";
}

export const STUDENTS: Student[] = [
    {
        image: "/first.jpg",
        rank: "1st Rank",
        name: "🏆 Saumya Bhide",
        badge: "gold"
    },
    {
        image: "/java.jpg",
        rank: "2nd Rank",
        name: "🥈 Ananya Patel",
        badge: "silver",
    },
    {
        image: "/java_prog.jpg",
        rank: "3rd Rank",
        name: "🥉 Aman Verma",
        badge: "bronze",
    },
];
