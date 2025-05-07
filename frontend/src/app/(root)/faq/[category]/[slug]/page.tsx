"use client"
import { useParams } from 'next/navigation';
import { faqData } from '../../../../../lib/constants/index';
import ReactMarkdown from 'react-markdown';


export default function ArticlePage() {
  const params = useParams();
  const category = params?.category as string;
  const slug = params?.slug as string;
    const cat = faqData.find(c => c.id === category);
  const article = cat?.articles.find(a => a.slug === slug);

  if (!article) return <p className="text-white p-10">Article not found.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">
     

        <h1 className="text-3xl font-bold mb-4">{article.question}</h1>
        <ReactMarkdown>{article.answer}</ReactMarkdown>

      </div>
    </div>
  );
}
