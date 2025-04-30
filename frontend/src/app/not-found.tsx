"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function NotFoundPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiFaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const emoji = emojiRef.current;
    const emojiFace = emojiFaceRef.current;

    if (!wrapper || !emoji || !emojiFace) return;

    const moveEvent = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      const emojiMax = 30; // smaller on mobile
      const faceMax = 50;

      const emojiX = (relX / rect.width) * emojiMax;
      const emojiY = (relY / rect.height) * emojiMax;
      const faceX = (relX / rect.width) * faceMax;
      const faceY = (relY / rect.height) * faceMax;

      gsap.to(emoji, { x: emojiX, y: emojiY, ease: "power3.out", duration: 0.35 });
      gsap.to(emojiFace, { x: faceX, y: faceY, ease: "power3.out", duration: 0.35 });
    };

    const leaveEvent = () => {
      gsap.to([emoji, emojiFace], { x: 0, y: 0, ease: "power3.out", duration: 1 });
    };

    wrapper.addEventListener("mousemove", moveEvent);
    wrapper.addEventListener("mouseleave", leaveEvent);

    return () => {
      wrapper.removeEventListener("mousemove", moveEvent);
      wrapper.removeEventListener("mouseleave", leaveEvent);
    };
  }, []);

  return (
    <section className="fixed inset-0 flex flex-col items-center justify-center bg-[#6c2bd9] text-white text-center p-4 overflow-hidden">
      {/* 404 number */}
      <div className="relative flex items-center justify-center text-[24vw] sm:text-[20vw] font-bold leading-none">
        <span>4</span>

        {/* Moving emoji face inside the 0 */}
        <div ref={wrapperRef} className="relative mx-4 w-[1em] h-[1em] flex items-center justify-center">
          <div
            ref={emojiRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white flex items-center justify-center overflow-hidden"
          >
            <div
              ref={emojiFaceRef}
              className="w-20 h-20 sm:w-28 sm:h-28 flex flex-col items-center justify-between"
            >
              {/* Eyes */}
              <div className="flex w-full justify-between px-2 sm:px-4">
                <div className="text-black text-2xl sm:text-4xl"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none"><g clipPath="url(#a)"><path d="m23.093 25.04-.037 5.183c1.58.018 6.533.41 6.554-2.512.02-3.05-4.938-2.651-6.517-2.67m.05-7.073-.033 4.7c1.315.016 5.445.378 5.465-2.281.018-2.774-4.117-2.402-5.433-2.42M19.94 4.123a20.833 20.833 0 1 0 9.693 40.523 20.833 20.833 0 0 0-9.692-40.523m12.986 15.263a3.626 3.626 0 0 1-2.025 3.935 4.03 4.03 0 0 1 3.31 4.909c-.368 3.712-3.117 4.676-7.037 4.855l-.027 3.905-2.332-.029.028-3.852a80 80 0 0 1-1.86-.04l-.028 3.87-2.329-.028.028-3.914c-.546-.008-1.1-.026-1.666-.032l-3.033-.037.483-2.806s1.725.048 1.693.021a.82.82 0 0 0 .883-.768l.073-10.597a1.215 1.215 0 0 0-1.333-1.048c.027-.03-1.694-.019-1.694-.019l.02-2.515 3.212.042v.012q.726.005 1.484-.003l.027-3.865 2.33.028-.027 3.79c.622-.004 1.249-.01 1.863-.003l.025-3.765 2.331.029-.028 3.867c3.007.302 5.384 1.268 5.63 4.058" fill="#000"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h50v50H0z"/></clipPath></defs></svg></div>
                <div className="text-black text-2xl sm:text-4xl"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none"><g clipPath="url(#a)"><path d="m23.093 25.04-.037 5.183c1.58.018 6.533.41 6.554-2.512.02-3.05-4.938-2.651-6.517-2.67m.05-7.073-.033 4.7c1.315.016 5.445.378 5.465-2.281.018-2.774-4.117-2.402-5.433-2.42M19.94 4.123a20.833 20.833 0 1 0 9.693 40.523 20.833 20.833 0 0 0-9.692-40.523m12.986 15.263a3.626 3.626 0 0 1-2.025 3.935 4.03 4.03 0 0 1 3.31 4.909c-.368 3.712-3.117 4.676-7.037 4.855l-.027 3.905-2.332-.029.028-3.852a80 80 0 0 1-1.86-.04l-.028 3.87-2.329-.028.028-3.914c-.546-.008-1.1-.026-1.666-.032l-3.033-.037.483-2.806s1.725.048 1.693.021a.82.82 0 0 0 .883-.768l.073-10.597a1.215 1.215 0 0 0-1.333-1.048c.027-.03-1.694-.019-1.694-.019l.02-2.515 3.212.042v.012q.726.005 1.484-.003l.027-3.865 2.33.028-.027 3.79c.622-.004 1.249-.01 1.863-.003l.025-3.765 2.331.029-.028 3.867c3.007.302 5.384 1.268 5.63 4.058" fill="#000"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h50v50H0z"/></clipPath></defs></svg></div>
              </div>
              {/* Mouth */}
              <div className="w-4 h-6 sm:w-6 sm:h-8 bg-black rounded-full mt-2" />
            </div>
          </div>
        </div>

        <span>4</span>
      </div>

      {/* Text and Button */}
      <h2 className="mt-2 text-lg sm:text-2xl font-semibold">Page not found</h2>

      <Link href="/" className="mt-6 ">
        <button className="px-4 py-2 bg-white text-black font-bold rounded-full  hover:bg-gray-100 transition cursor-pointer">
          Go Back Home
        </button>
      </Link>
    </section>
  );
}
