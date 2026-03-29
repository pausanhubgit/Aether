
import { ART_ROUTE } from "@/constants/routes";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { FaCube, FaPaintBrush, FaMobile } from "react-icons/fa6";

const Categories = () => {
  return (
    <section id="categories" className="py-16 bg-white dark:bg-[#0d0118] dark:text-purple-100">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-4">
            Shop arts by Category
          </h2>
          <p className="text-gray-600 dark:text-purple-300/80 text-center">
            Browse arts by categories.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          <Link href={`${ART_ROUTE}?category=paintings`}>
            <div className="bg-white dark:bg-[#160327] rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-2 justify-between">
              <div className="text-primary text-3xl bg-purple-50 dark:bg-purple-950/30 p-5 h-20 w-20 rounded-full flex items-center justify-center">
                <FaCube />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Paintings</h3>
                <p className="text-slate-600 dark:text-purple-300/70 text-sm">35 Arts</p>
              </div>
            </div>
          </Link>


          <Link href={`${ART_ROUTE}?category=Sketches`}>
            <div className="bg-white dark:bg-[#160327] rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-2 justify-between">
              <div className="text-primary text-3xl bg-purple-50 dark:bg-purple-950/30 p-5 h-20 w-20 rounded-full flex items-center justify-center">
                <FaMobile />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Sketches</h3>
                <p className="text-slate-600 dark:text-purple-300/70 text-sm">95 Arts</p>
              </div>
            </div>
          </Link>

          <Link href={`${ART_ROUTE}?category=Digital_Arts`}>
            <div className="bg-white dark:bg-[#160327] rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-2 justify-between">
              <div className="text-primary text-3xl bg-purple-50 dark:bg-purple-950/30 p-5 h-20 w-20 rounded-full flex items-center justify-center">
                <FaCube />
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">Digital Arts</div>
                <p className="text-slate-600 dark:text-purple-300/70 text-sm">255 Arts</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
