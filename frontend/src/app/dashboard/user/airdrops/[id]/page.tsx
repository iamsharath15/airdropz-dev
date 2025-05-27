import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { airdrops } from "@/app/data/airdrops";
import { Button } from "@/components/ui/button";

interface Props {
  params: { id: string };
}

const AirdropDetail = ({ params }: Props) => {
  const airdrop = airdrops.find(a => a.id === params.id);

  if (!airdrop) return notFound();

  return (
    <div className="mb-4">
      <Link href="/dashboard/airdrops" className="flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to airdrops
      </Link>

      <div className="bg-gray-900/40 rounded-lg p-4 mb-6">
        <div className="text-xs text-gray-400 mb-1">
          {airdrop.date ? `Guides • ${airdrop.date}` : "Guides"}
        </div>
        <h1 className="text-2xl font-bold mb-3">How to Join the {airdrop.name} Airdrop</h1>
        <p className="text-gray-300 mb-6">{airdrop.description}</p>

        <div className="aspect-video bg-blue-900/20 rounded-lg overflow-hidden mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-5xl font-bold text-center">{airdrop.name}</h2>
          </div>
          <div className="absolute bottom-6 left-0 w-full flex justify-center">
            <Button className="bg-green-600 hover:bg-green-700">Free DePIN Airdrop</Button>
          </div>
        </div>

        {airdrop.steps && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Run the {airdrop.name} Node for free and start earning points. These points could potentially lead to an airdrop.
            </h3>

            <p className="mb-2">Here's how to get started:</p>

            <ul className="list-disc pl-6 mb-6 space-y-1">
              {airdrop.steps.map((step, index) => (
                <li key={index} className="text-gray-300">{step}</li>
              ))}
            </ul>

            <p className="mb-4">Next, download the browser extension node and connect it to your account using the API key.</p>

            <h4 className="font-semibold mb-2">Here are the steps:</h4>

            <ol className="list-decimal pl-6 mb-6 space-y-3">
              <li className="text-gray-300">
                Download the extension (top right corner): <span className="text-blue-400">Link</span>
              </li>
              <li className="text-gray-300">
                Go to your dashboard and generate your API key: <span className="text-blue-400">Link</span>
              </li>
            </ol>

            {airdrop.twitterEmbed && (
              <div className="border border-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-start mb-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Sui <span className="text-gray-400 font-normal">@SuiNetwork</span></p>
                    <p className="text-sm text-gray-300 mt-1">{airdrop.twitterEmbed}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="mb-6">Done! You'll start earning points automatically as long as your PC is on — all in the background.</p>

            <p className="mb-6">You can grab a few extra points from the "Earn More Points" page — but the tasks are only up for a limited time, so complete them as soon as you can.</p>

            <div className="bg-gray-800 p-4 rounded-lg text-center mb-6">
              <p className="text-lg font-medium">
                "Run the {airdrop.name} Node for free and start earning points. These points could potentially lead to an airdrop"
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AirdropDetail;
