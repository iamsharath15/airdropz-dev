import Link from 'next/link';
import React from 'react';
import { faqData } from '../../../lib/constants/index';
const FaqPage = () => {
  return (

    <section className=" bg-black p-10 flex flex-col items-center justify-start">
      <div className="max-w-[1440px] w-10/12 flex flex-col items-center justify-center">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center text-white mb-4">FAQ</h1>
        <p className="lg:text-xl text-lg text-center text-white mb-10">
          Answers to your questions.
        </p>
        <div className="w-full mx-auto items-center justify-center flex flex-wrap sm:flex-row flex-col">
          {faqData.map((category) => (
            <Link className='lg:w-4/12 md:w-6/12 w-full flex p-2' href={`/faq/${category.id}`} key={category.id}>
              <div className="border border-[#1A1A1A] rounded-lg p-6 hover:border-[#393838] transition cursor-pointer w-full">
                <div className="w-3 h-3 bg-white rounded-full mb-2"></div>
                <h2 className="mt-4 font-semibold md:text-2xl text-lg text-white">{category.title}</h2>
                <p className="text-gray-400 font-medium text-xl">{category.description}</p>
                <p className="mt-6 text-lg text-gray-500">
                  {category.articles.length} articles
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqPage;
