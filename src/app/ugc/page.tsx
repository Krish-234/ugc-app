"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { SCRIPT_GENERATE_URL } from "../../utils/constants";

export default function Ugc() {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [timeInSecond, setTimeInSecond] = useState(15);
  const [websiteLink, setWebsiteLink] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [referenceLink, setReferenceLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [image, setImage] = useState(null);
  const [data, setData] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const tones = [
    "Engaging Tone",
    "Gen Z Tone",
    "Motivational Tone",
    "Commercial Advertising",
    "Super Casual Tone",
    "Professional Tone",
    "Aspiring Tone",
    "Just Summary Tone",
  ];

  const handleGenerate = () => {
    if(selectedTones.length !== 3){
      alert("please select 3 tones.");
      return;
    }
    if (!productName.trim() || !productDescription.trim()) {
      setError("Please provide both product name and description.");
      return;
    }

    setLoading(true);
    setError(null);
    setData([]);

    const generateAiScript = async () => {
      try {
        const res = await axios.post(SCRIPT_GENERATE_URL, {
          product_name: productName,
          product_description: productDescription,
          time_in_seconds: timeInSecond,
          selected_tones: selectedTones,
        });

        const rawData = res.data.choices?.[0]?.message?.content;
        if (!rawData) {
          throw new Error("Received empty response from AI.");
        }
        console.log(rawData);

        const generatedScripts: [] = JSON.parse(rawData).map(
          (item: { script: string }) => item.script
        );

        if (generatedScripts && generatedScripts.length > 0) {
          setData(generatedScripts);
        } else {
          setError("nothing got generated");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    generateAiScript();
  };

  const handleToneSelection = (tone: string) => {
    if (selectedTones.length < 3) {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      "Your request has been submitted. Track Progress through Dashboard....."
    );
  };

  return (
    <>
      <form
        className="flex justify-center items-start m-[5rem] gap-[4rem]"
        onSubmit={handleSubmit}
      >
        <div
          className="w-32 h-32 border-2 border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer mt-10"
          // onClick={handleFileInputClick}
        >
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full rounded-lg"
            />
          ) : (
            <span className="text-gray-500 text-2xl before:content-['+']"></span>
          )}

          <input
            type="file"
            // ref={fileInputRef}
            className="hidden"
            // onChange={handleImageChange}
            accept=".png, .jpg, .jpeg, .svg, .webp"
          />
        </div>

        <div className="flex flex-col items-center space-y-4 mt-10">
          <input
            type="text"
            className="text-black rounded-lg w-80 p-2 border border-gray-300"
            placeholder="Your Product Name..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <textarea
            className="text-black rounded-lg w-80 p-2 border border-gray-300"
            placeholder="Your Product Description..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={4}
          />

          <div className="flex justify-between gap-4">
            {[15, 30, 45, 60].map((time, index) => (
              <button
                className={`py-2 px-3 rounded-lg hover:bg-blue-600 text-white ${
                  timeInSecond === time
                    ? "bg-purple-500  hover:bg-purple-600"
                    : "bg-blue-500"
                }`}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setTimeInSecond(time);
                }}
              >
                {time}s
              </button>
            ))}
          </div>

          <input
            type="text"
            className="text-black rounded-lg w-80 p-2 border border-gray-300"
            placeholder="Your Website Link..."
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
          />

          <div className="flex  gap-2 flex-wrap w-[25vw]">
            {tones.map((tone, index) => (
              <button
                className={`py-2 px-3 rounded-lg hover:bg-blue-600 text-white  bg-blue-500
                  `}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleToneSelection(tone);
                }}

                //   ${
                //   timeInSecond === tone
                //     ? "bg-purple-500  hover:bg-purple-600"
                //     : "bg-blue-500"
                // }
                // onClick={(e) => {
                //   e.preventDefault();
                //   setTimeInSecond(time);
                // }}
              >
                {tone}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap w-[25vw]">
  {selectedTones.map((tone, index) => (
    <div key={index} className="relative group">
      <div className="py-2 px-3 rounded-lg bg-gray-500 text-white hover:bg-blue-600 relative">
        {tone}
      </div>
      <button
        className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault();
          setSelectedTones(selectedTones.filter((_, i) => i !== index));
        }}
      >
        ×
      </button>
    </div>
  ))}
</div>


          <textarea
            className="text-black rounded-lg w-80 p-2 border border-gray-300"
            placeholder="Provide a script or Generate..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={4}
          />

          <input
            type="text"
            className="text-black rounded-lg w-80 p-2 border border-gray-300"
            placeholder="Give any reference link if possible...."
            value={referenceLink}
            onChange={(e) => setReferenceLink(e.target.value)}
          />
          <div>
            <button
              type="submit"
              className="bg-red-400 rounded-lg p-2 text-white mr-4"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-red-400 rounded-lg p-2 text-white"
              onClick={handleGenerate}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}

      <div className="flex justify-center items-center mx-[10rem]">
        {data.length > 0 && (
          <div className="relative mt-4">
            {/* List of Scripts */}
            <ul className="flex justify-between items-center text-black gap-10">
              {data.map((script, index) => (
                <li
                  key={index}
                  className="relative border rounded-lg bg-gray-200 w-[25vw] h-auto cursor-pointer pt-8"
                >
                  <button
                    onClick={() => {
                      setScript(script);
                      setData([]);
                    }}
                    className="px-2 py-1"
                  >
                    {script}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
