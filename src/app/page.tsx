"use client";
import SwapCard from "@/components/ui/Cards/SwapCard";

export default function Home() {
  return (
    <div className=" items-start justify-items-center px-8  sm:px-auto   gap-16  h-[calc(100vh-7rem)]   font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 mt-4  row-start-2 justify-center items-center  sm:items-center  ">
        <h2 className="text-[2rem] max-w-[480px] text-center animate-slide-up font-semibold">
          Swap Anytime AnyWhere
        </h2>
        <SwapCard></SwapCard>

        {/* Bokeh Effect for bacground */}
        <div className="absolute -z-20 inset-0 animate-bokeh">
          <div className="absolute bg-green-400 opacity-20 blur-2xl rounded-full w-36 h-36 top-20 left-10 animate-pulse"></div>
          <div className="absolute bg-green-500 opacity-25 blur-3xl rounded-full w-48 h-48 top-40 left-48"></div>
          <div className="absolute bg-green-300 opacity-15 blur-2xl rounded-full w-64 h-64 bottom-24 right-16"></div>
          <div className="absolute bg-green-600 opacity-10 blur-3xl rounded-full w-52 h-52 top-10 animate-pulse right-32"></div>
        </div>
      </main>
    </div>
  );
}
