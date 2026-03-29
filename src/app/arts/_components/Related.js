import artsAPI from "@/api/arts";
import ArtCard from "./Card";
import { GRID_VIEW } from "@/constants/artView";

const Related = async ({ category }) => {
  const response = await artsAPI.getArt({ category });

  const Arts = response.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Arts.map((art, index) => (
        <ArtCard key={index} product={art} ArtView={GRID_VIEW} />
      ))}
    </div>
  );
};

export default Related;