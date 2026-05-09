import { ART_ROUTE } from "@/constants/routes";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { FaCube, FaPaintBrush, FaMobile } from "react-icons/fa6";

const Categories = () => {
  return (
    <section
      id="categories"
      className="py-16 bg-white dark:bg-[#0d0118] dark:text-purple-100"
    >
      <div className="container-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop arts by Category
          </h2>
          <p className="text-gray-600 dark:text-purple-300/80 text-lg font-medium">
            Browse arts by categories.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          <Link href={`${ART_ROUTE}?category=paintings`}>
            <div className="bg-white dark:bg-[#160327] rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-4 justify-between min-h-64">
              <div className="text-primary text-4xl bg-purple-50 dark:bg-purple-950/30 p-6 h-24 w-24 rounded-full flex items-center justify-center">
                <FaCube />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg lg:text-xl xl:text-2xl">
                  Paintings
                </h3>
                <p className="text-slate-600 dark:text-purple-300/70 text-sm lg:text-base">
                  35 Arts
                </p>
              </div>
            </div>
          </Link>

          <Link href={`${ART_ROUTE}?category=Sketches`}>
            <div className="bg-white dark:bg-[#160327] rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-4 justify-between min-h-64">
              <div className="text-primary text-4xl bg-purple-50 dark:bg-purple-950/30 p-6 h-24 w-24 rounded-full flex items-center justify-center">
                <FaMobile />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg lg:text-xl xl:text-2xl">
                  Sketches
                </h3>
                <p className="text-slate-600 dark:text-purple-300/70 text-sm lg:text-base">
                  95 Arts
                </p>
              </div>
            </div>
          </Link>

          <Link href={`${ART_ROUTE}?category=Digital_Arts`}>
            <div className="bg-white dark:bg-[#160327] rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-4 justify-between min-h-64">
              <div className="text-primary text-4xl bg-purple-50 dark:bg-purple-950/30 p-6 h-24 w-24 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <FaCube />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg lg:text-xl xl:text-2xl">
                  Digital Arts
                </h3>
                <p className="text-slate-600 dark:text-purple-300/70 text-sm lg:text-base">
                  255 Arts
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
