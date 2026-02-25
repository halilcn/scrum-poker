"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUsernameCookie } from "@/utils/cookieActions";
import { Button } from "@/components/ui/button";
import FullPageLoader from "@/components/ui/FullPageLoader";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getUsernameCookie();
    setUsername(user || "");
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    if (username) {
      router.push("/welcome-user");
    } else {
      router.push("/login");
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#F9F7F7] relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Large animated circles positioned on sides */}
        {/* Left side circles */}
        <div
          className="absolute -top-32 -left-64 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #3F72AF 0%, #DBE2EF 50%, transparent 70%)",
            filter: "blur(80px)",
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 -left-96 w-[800px] h-[800px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, #DBE2EF 0%, #112D4E 60%, transparent 80%)",
            filter: "blur(90px)",
            animation: "floatSlow 30s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-32 -left-48 w-[600px] h-[600px] rounded-full opacity-18"
          style={{
            background:
              "radial-gradient(circle, #3F72AF 0%, #112D4E 40%, transparent 70%)",
            filter: "blur(70px)",
            animation: "floatDelayed 25s ease-in-out infinite",
          }}
        />

        {/* Right side circles */}
        <div
          className="absolute -top-48 -right-64 w-[900px] h-[900px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, #3F72AF 0%, #112D4E 50%, transparent 70%)",
            filter: "blur(100px)",
            animation: "floatReverse 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 -right-96 w-[700px] h-[700px] rounded-full opacity-12"
          style={{
            background:
              "radial-gradient(circle, #112D4E 0%, #DBE2EF 50%, transparent 70%)",
            filter: "blur(85px)",
            animation: "float 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-32 -right-48 w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #3F72AF 0%, transparent 60%)",
            filter: "blur(60px)",
            animation: "floatSlow 30s ease-in-out infinite",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-12 flex flex-col items-center">
            <Image
              src="/storipoi.svg"
              alt="Scrum Poker Logo"
              width={300}
              height={300}
              className="mx-auto"
              priority
            />
            <p className="text-base text-gray-500 mt-3 flex items-center justify-center gap-1">
              <span>sponsored by</span>
              <a
                href="https://www.savaron.com.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/savaron.svg"
                  alt="Savaron"
                  width={70}
                  height={12}
                  className="inline-block"
                  priority
                />
              </a>
            </p>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Start Your Scrum Poker
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Estimate with confidence. Plan with precision. Build better software
            together.
          </p>

          {/* User Section */}
          <div className="bg-[#F9F7F7] border border-gray-200 rounded-2xl p-8 shadow-lg mb-8 max-w-md mx-auto">
            {username ? (
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-2">Welcome back,</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {username}
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-gray-700 text-lg">Ready to get started?</p>
              </div>
            )}

            {/* CTA Button */}
            <Button
              onClick={handleGetStarted}
              className="w-full bg-[#3F72AF] hover:bg-[#3F72AF]/90 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-md hover:shadow-lg p-6"
              size="lg"
            >
              {username ? "Continue Playing" : "Get Started"}
            </Button>
          </div>
        </div>
      </div>

      {/* Inline CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        @keyframes floatDelayed {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-40px, 30px) scale(0.95);
          }
          66% {
            transform: translate(20px, -20px) scale(1.05);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, -50px) scale(1.1);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 40px) scale(1.05);
          }
          66% {
            transform: translate(40px, -30px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
