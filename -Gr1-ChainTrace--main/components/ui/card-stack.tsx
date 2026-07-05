"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let interval: any;

export type CardItem = {
  id: number;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset = 12,
  scaleFactor = 0.08,
}: {
  items: CardItem[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const [cards, setCards] = useState<CardItem[]>(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: CardItem[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 4000);
  };

  return (
    <div className="relative h-[300px] w-full flex items-center justify-center perspective-[1200px]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute bg-neutral-900 w-full md:w-[500px] h-48 border border-white/50 p-6 flex flex-col justify-between overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: `calc(50% - 96px + ${index * CARD_OFFSET}px)`,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
              opacity: 1 - index * 0.1, // make them more visible
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut", 
            }}
          >
            {/* Subtle inner grid background for that tech/clean look */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
            {card.content}
          </motion.div>
        );
      })}
    </div>
  );
};

const CARD_OFFSET = 35;
const SCALE_FACTOR = 0.05;
