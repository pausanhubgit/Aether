import artsAPI from "@/api/arts";
import { ART_ROUTE } from "@/constants/routes";
import Link from "next/link";
import ArtCard from "@/components/ArtCard";
import { FaPalette, FaArrowRight } from "react-icons/fa6";

const FeaturedArts = async () => {
  let arts = [];
  try {
    // Fetch a batch to sort by latest created
    const response = await artsAPI.getArt({ limit: 12 });
    // Sort by createdAt and take top 4
    arts = response.data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch featured arts:", error.message);
  }

  return (
    <section id="featured-arts" className="py-24 bg-white dark:bg-[#0d0118]">
      <div className="container-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">
              <FaPalette className="text-xs" /> <span>Curated Gallery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 dark:text-purple-100">
              Featured Creations
            </h2>
            <p className="text-gray-600 dark:text-purple-300/80 text-lg font-medium">
              Handpicked top-rated works from our community
            </p>
          </div>

          <div className="hidden lg:block">
            <Link
              href={ART_ROUTE}
              className="group flex items-center gap-3 text-slate-900 dark:text-purple-100 font-bold hover:text-primary transition-all duration-300"
            >
              <div className="flex items-center justify-center p-4 bg-white dark:bg-[#160327] rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                <FaArrowRight />
              </div>
              <span>Explore All Masterpieces</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {arts?.map((art, index) => (
            <ArtCard key={art._id || index} art={art} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArts;
