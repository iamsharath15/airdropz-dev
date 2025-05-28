"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { partnersData, Partner } from "@/lib/constants";
import Image from "next/image";

const Page = () => {
  // Animation Variants
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Explicitly type chunkArray parameters and return type
  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  // Group partners into chunks of 3
  const groupedPartners = chunkArray<Partner>(partnersData, 3);

  return (
    <motion.section className="partners-section">
      {/* Become Partner Section */}
      <motion.div
        className="flex w-full items-center justify-center py-[10%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariant}
      >
        <div className="container text-center space-y-6 md:w-6/12 w-8/12">
          <h2 className="text-white font-semibold lg:text-5xl md:text-3xl sm:text-xl">
            Partners
          </h2>
          <p className="text-white font-normal text-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut maxime,
            necessitatibus autem quos possimus corporis? Quos animi omnis quam
            quibusdam.
          </p>
          <Button className="bg-[#8373EE] hover:bg-[#8373eec4] rounded-2xl">
            <a href="#">Become a partner</a>
          </Button>
        </div>
      </motion.div>

      {/* Partner Info Section */}
      <motion.div
        className="w-full flex items-center justify-center py-[5%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariant}
      >
        <div className="flex items-center justify-center w-8/12">
          <div className="container">
            {groupedPartners.map((group: Partner[], rowIndex: number) => (
              <div className="flex flex-col md:flex-row" key={rowIndex}>
                {group.map((partner: Partner, index: number) => (
                  <motion.div
                    key={index}
                    className="flex flex-col p-[3%] gap-4 border-[1px] border-[#ffffff1a] cursor-pointer hover:bg-[linear-gradient(314deg,_#1a1d32,_rgba(26,29,50,0))]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 * (rowIndex * group.length + index),
                    }}
                  >
                    <div className="cus-logo py-[8%]">
                      <Image src={partner.logo} alt={partner.name} width={100} height={40} />
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-white">{partner.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Partner Callout Section */}
      <motion.section
        className="flex w-full items-center justify-center px-[4%] py-[10%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpVariant}
      >
        <div className="w-full bg-[linear-gradient(86deg,_#670fff,_#d44ee3,_#f09d44)] rounded-4xl py-[16%] px-[4%] text-center space-y-6 ">
          <h2 className="text-white font-semibold lg:text-5xl md:text-3xl sm:text-xl">
            Collaborate with confidence.
          </h2>
          <p className="text-white font-normal text-lg">
            Securely share opportunities, protect sensitive data, and build
            trust—all while staying compliant and ahead of the curve in the Web3
            space.
          </p>
          <Button className="bg-white hover:bg-white/80 rounded-2xl text-black font-semibold">
            <a href="#">Begin Now</a>
          </Button>
        </div>
      </motion.section>
    </motion.section>
  );
};

export default Page;
