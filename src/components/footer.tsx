import { GithubIcon, LinkedinIcon, StarIcon, WebhookIcon } from "lucide-react";
import Link from "next/link";
import { BuiltWithOutstatic } from "./built-with-outstatic";

const Footer = () => {
  return (
    <div className="absolute bottom-0 w-full bg-slate-700 dark:bg-background dark:text-gray-400 text-gray-200 py-2 pb-20 md:pb-10 md:py-10 border-t">
      <footer className="max-w-6xl container mx-auto flex flex-col md:flex-row items-start justify-between p6-4 px-6">
        <div className="flex justify-between w-full items-center">
          <div className="flex flex-col w-1/2">
            <p className="text-sm mt-4 md:mt-0 text-white">
              The code for this website is{" "}
              <Link
                className="underline underline-offset-2 text-white hover:text-gray-600 dark:hover:text-white"
                href="https://github.com/avitorio/andrevitorio-com"
              >
                open source
              </Link>
              .
            </p>
            <p className="hidden md:block text-sm mt-4 text-white">
              © Visoteck {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <Link
              className="text-gray-100 hover:text-gray-300 dark:text-gray-200 dark:hover:text-white mr-4"
              href="https://visoteckgo.vercel.app/"
              target="_blank"
            >
              <StarIcon className="h-6 w-6" aria-label="Website" />
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-row mt-8 md:mt-12 md:hidden items-center justify-between gap-2 border-t-2 py-4">
          <p className="block md:hidden text-sm text-white">
            © Visoteck {new Date().getFullYear()}
          </p>
          <div className="flex flex-row gap-2 items-center ">
            <p className="text-sm text-white">Built with</p>
            <BuiltWithOutstatic fixed={false} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
