"use client";

import {
  LineChart,
  BarChart,
  Users,
  Activity,
  Lock,
  Database,
  Folder,
  Share2,
  File,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
const featuresData = [
  {
    title: "Secure Google Login",
    description:
      "Authenticate effortlessly and securely using Google OAuth via NextAuth, ensuring your notes and files are always protected.",
    icon: <Lock />
  },
  {
    title: "Safe PDF Storage in S3",
    description:
      "Upload and store your PDF files securely in Amazon S3 using presigned URLs, so your documents are always safe and private.",
    icon: <File className="w-6 h-6" />,
  },
  {
    title: "Database Powered by Prisma",
    description:
      "All your notes, files, and sharing permissions are managed with a robust and scalable Prisma database.",
    icon: <Database className="w-6 h-6" />,
  },
  {
    title: "Easy File Management (CRUD)",
    description:
      "Create, read, update, and delete your files with a simple and intuitive interface.",
    icon: <Folder className="w-6 h-6" />,
  },
  {
    title: "File Sharing",
    description:
      "Share your PDF files securely with others, controlling exactly who can access your documents.",
    icon: <Share2 className="w-6 h-6" />,
  },
];


const Features = () => {
  return (
    <section
      id="features"
      className="relative py-32 bg-black overflow-hidden"
      aria-label="Features Section"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#2563eb10,transparent)]" />

      <div className="container relative mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-oswald">
            Website Analytics Reimagined
          </h2>
          <p className="text-xl md:text-2xl text-blue-300/90 mb-6 font-jakarta">
            Powerful Insights Made Simple
          </p>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-jakarta">
            Transform your website data into actionable insights with our
            comprehensive analytics suite
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <Card className="group h-full bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-500 backdrop-blur-xl border border-zinc-800 rounded-lg overflow-hidden cursor-pointer">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <div className="text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-500">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3 group-hover:text-blue-300 transition-colors duration-500 font-jakarta">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-jakarta">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
