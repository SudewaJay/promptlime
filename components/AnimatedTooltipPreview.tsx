"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Person {
  id: number;
  name: string;
  designation: string;
  image: string;
}

interface AnimatedTooltipProps {
  items: Person[];
}

export function AnimatedTooltip({ items }: AnimatedTooltipProps) {
  const [hoveredId, setHoveredId] = React.useState<number | null>(null);

  return (
    <div className="flex items-center justify-center gap-6">
      {items.map((person) => (
        <div
          key={person.id}
          className="relative flex flex-col items-center group"
          onMouseEnter={() => setHoveredId(person.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Image
            src={person.image}
            alt={person.name}
            width={60}
            height={60}
            className="rounded-full border border-white/20 hover:border-lime-400 transition duration-300 object-cover"
          />

          <AnimatePresence>
            {hoveredId === person.id && (
              <motion.div
                className="absolute -top-20 bg-black text-white text-xs rounded-lg px-4 py-2 shadow-lg z-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-semibold">{person.name}</div>
                <div className="text-gray-400">{person.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}