

export default function PromptCardSkeleton() {
    return (
        <div className="flex flex-row items-start gap-3 md:gap-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-5 relative overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />

            {/* Image Placeholder */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-lg md:rounded-xl shrink-0" />

            {/* Content Placeholders */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
                {/* Tool Badge */}
                <div className="w-20 h-4 bg-white/10 rounded-full mb-2" />

                {/* Title */}
                <div className="w-3/4 h-6 md:h-7 bg-white/10 rounded-lg mb-2 md:mb-3" />

                {/* Description Lines */}
                <div className="w-full h-3 md:h-4 bg-white/10 rounded-full mb-1.5" />
                <div className="w-5/6 h-3 md:h-4 bg-white/10 rounded-full mb-auto" />

                {/* Action Buttons Row */}
                <div className="flex gap-2 mt-4">
                    <div className="w-12 h-6 md:h-8 bg-white/10 rounded-full" /> {/* Like */}
                    <div className="w-16 h-6 md:h-8 bg-white/10 rounded-full" /> {/* Share */}
                    <div className="w-8 h-6 md:h-8 bg-white/10 rounded-full" /> {/* Report */}
                    <div className="ml-auto w-20 h-6 md:h-8 bg-white/10 rounded-full" /> {/* Copy */}
                </div>
            </div>
        </div>
    );
}
