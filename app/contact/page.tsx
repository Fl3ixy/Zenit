"use client";

import { motion } from "framer-motion";
import { Mail, Bitcoin} from "lucide-react"; // 🛠️ Ajout de Twitter
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const contacts = [
    {
      name: "Twitter",
      icon: Mail,
      link: "https://x.com/Imfl3ixy",
      color: "hover:text-blue-400",
    },
    {
      name: "Discord",
      icon: Mail,
      link: "https://discord.gg/G86rhKhMeC",
      color: "hover:text-indigo-500",
    },
    {
      name: "Email",
      icon: Mail,
      link: "mailto:ZenithSuports@protonmail.com",
      color: "hover:text-red-500",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 grid-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r text-white">
          Zenith Contacts
        </h1>
        <p className="text-muted-foreground">
          Feel free to reach out through any of these platforms
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {contacts.map((contact) => (
          <motion.div key={contact.name} variants={item}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-64 flex items-center justify-start space-x-4 transition-all ${contact.color}`}
                    onClick={() => window.open(contact.link, "_blank")}
                  >
                    <contact.icon className="h-5 w-5" />
                    <span>{contact.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Connect on {contact.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}

        <motion.div variants={item}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-64 flex items-center justify-start space-x-4 hover:text-yellow-500 hover:border-yellow-500"
                  onClick={() => {
                    navigator.clipboard.writeText("your-crypto-address");
                    // You could add a toast notification here
                  }}
                >
                  <Bitcoin className="h-5 w-5 animate-bounce duration-1000" />
                  <span>Donate Crypto - Soon...</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to copy wallet address</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-sm text-muted-foreground"
      >
        Thanks for all donations ❤️ Zenith Teams
      </motion.div>
    </div>
  );
}
