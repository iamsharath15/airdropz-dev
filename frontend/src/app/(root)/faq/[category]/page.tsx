'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { faqData } from '../../../../lib/constants/index';

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const cat = faqData.find((c) => c.id === category);

  if (!cat) return <p className="text-white p-10">Category not found.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-center  mb-6 flex-col">
          <div className="w-6 h-6 bg-white rounded-full"></div>
            <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center text-white ">
              {cat.title}
            </h1>
            <p className="lg:text-5xl md:text-4xl text-3xl text-center font-semibold text-[#999999]">
              {cat.description}{' '}
            </p>
        </div>

        <div className="space-y-2">
          {cat.articles.map((article) => (
            <Link
              className=""
              href={`/faq/${cat.id}/${article.slug}`}
              key={article.slug}
            >
              <div className="border my-4 border-[#1A1A1A] rounded-lg p-6 hover:border-[#393838]  px-4 py-3 cursor-pointer">
                {article.question}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
