"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PromptDisplayProps {
    text: string;
}

export default function PromptDisplay({ text }: PromptDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Split into words
    const words = text.split(/\s+/);
    const isLong = words.length > 15;

    // Decide what to show
    const visibleText = isExpanded
        ? text
        : words.slice(0, 15).join(" ") + (isLong ? "..." : "");

    return (
        <div className="relative">
            <pre
                className={`bg-white/5 text-sm p-4 rounded-md border border-white/10 whitespace-pre-wrap transition-all duration-300 ${isExpanded ? "" : "line-clamp-3 md:line-clamp-none" // 3 lines on mobile, unlimited (handled by words) on desktop
                    }`}
            >
                {visibleText}
                {/* Blur effect for non-expanded long text could be added here if we were using height, 
            but since we are cutting words, a simple "..." suffices visually, 
            or we can add a blur overlay if we want to "fade out" the last few words. 
            For exact 15 words, a direct cut + ... is cleaner. 
        */}
            </pre>

            {isLong && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={14} /> Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown size={14} /> Show Full Prompt
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
