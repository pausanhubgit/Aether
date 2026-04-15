import { FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaShieldAlt, FaUndo, FaTag, FaShare, FaCheckCircle } from "react-icons/fa";
import artsAPI from "@/api/arts";
import { ART_ROUTE } from "@/constants/routes";
import AddToCart from "../_components/AddToCart";
import Link from "next/link";
import Description from "../_components/description";
import MediaFeed from "@/components/MediaFeed";
import ImagePreview from "../_components/ImagePreview";
import ReviewsSection from "@/components/ReviewsSection";

export const generateMetadata = async ({ params }) => {
  const { artid, id } = await params;
  const artId = artid ?? id;
  const response = await artsAPI.getArtById(artId);
  const art = response.data;
  return {
    title: art?.name || art?.title,
    keywords: `${art?.name || art?.title}, ${art?.brand}, ${art?.category}`,
  };
};

const ArtDetails = async ({ params }) => {
  const { artid, id } = await params;
  const artId = artid ?? id;
  const response = await artsAPI.getArtById(artId);
  const art = response.data;
  const initialComments = art.comments || [];

  return (
    <main className="art-detail-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .art-detail-root {
          min-height: 100vh;
          background: var(--background);
          padding: 2rem 1rem 4rem;
          font-family: 'Inter', sans-serif;
          color: var(--foreground);
        }
        .art-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          color: var(--muted);
        }
        .breadcrumb a {
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb a:hover { color: var(--primary); }
        .breadcrumb-sep { color: var(--border); }
        .breadcrumb-current { color: var(--primary); font-weight: 600; }

        /* Main Card */
        .art-main-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 1.5rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }
        @media (min-width: 768px) {
          .art-main-card { flex-direction: row; gap: 3rem; }
        }
        .art-image-col { flex: 1 1 0; }
        .art-info-col { flex: 1 1 0; display: flex; flex-direction: column; gap: 1.2rem; }

        /* Category badge */
        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(139,92,246,0.1));
          border: 1px solid rgba(124,58,237,0.25);
          color: var(--primary);
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.2s;
          text-decoration: none;
        }
        .category-badge:hover {
          background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(139,92,246,0.2));
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(124,58,237,0.2);
        }

        /* Title */
        .art-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--foreground);
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        /* Rating row */
        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .stars { display: flex; gap: 2px; color: #f59e0b; }
        .rating-label { color: var(--muted); font-size: 0.85rem; font-weight: 500; }
        .rating-count {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          color: #f59e0b;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
        }

        /* Price */
        .price-section {
          background: linear-gradient(135deg, var(--background), var(--secondary));
          border: 1.5px solid var(--border);
          border-radius: 1rem;
          padding: 1.2rem 1.5rem;
        }
        .price-label { color: var(--primary); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.5rem; }
        .price-row { display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap; }
        .price-main { font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .price-original { font-size: 1.1rem; color: var(--muted); text-decoration: line-through; }
        .discount-badge { background: linear-gradient(135deg, #ef4444, #f97316); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; letter-spacing: 0.05em; }

        /* Divider */
        .divider { height: 1.5px; background: var(--border); margin: 0; border-radius: 999px; opacity: 0.5; }

        /* Action row */
        .action-row { display: flex; gap: 0.75rem; align-items: stretch; flex-wrap: wrap; }

        /* Perks / Shipping */
        .perks-section {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .perk-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--background);
          border: 1.5px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.7rem 1rem;
          transition: all 0.2s;
          cursor: default;
        }
        .perk-item:hover {
          background: rgba(34,197,94,0.05);
          border-color: rgba(34,197,94,0.3);
          transform: translateX(3px);
        }
        .perk-icon { width: 2rem; height: 2rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .perk-icon-purple { background: rgba(124,58,237,0.1); color: var(--primary); }
        .perk-icon-green { background: rgba(34,197,94,0.1); color: #22c55e; transition: background 0.2s; }
        .perk-icon-blue { background: rgba(59,130,246,0.1); color: #3b82f6; }
        .perk-text-main { font-size: 0.88rem; font-weight: 700; color: var(--foreground); }
        .perk-text-sub { font-size: 0.75rem; color: var(--muted); }

        /* Availability badge */
        .availability-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          color: #16a34a;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        /* Description section */
        .desc-section {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
        }
        .desc-tab-bar {
          display: flex;
          border-bottom: 1.5px solid var(--border);
          padding: 0 1.5rem;
          background: var(--background);
        }
        .desc-tab-btn {
          padding: 1rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--muted);
          border-bottom: 2.5px solid transparent;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .desc-tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .desc-body { padding: 1.5rem 2rem; color: var(--foreground); opacity: 0.8; line-height: 1.7; font-size: 0.95rem; }

        /* Reviews block */
        .reviews-block {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 1.25rem;
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          margin-top: 1.5rem;
        }

        /* Related Section */
        .related-section { margin-top: 2.5rem; }
        .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .section-title { font-size: 1.4rem; font-weight: 800; color: var(--foreground); }
        .section-line { flex: 1; height: 2px; background: linear-gradient(to right, var(--primary), transparent); border-radius: 999px; }
      `}</style>

      <div className="art-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={ART_ROUTE}>Arts</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{art.title || art.name}</span>
        </nav>

        {/* Main Card */}
        <div className="art-main-card">
          {/* Image Column */}
          <div className="art-image-col">
            <ImagePreview imageUrls={art.imageUrls} />
          </div>

          {/* Info Column */}
          <div className="art-info-col">
            {/* Top row: category + availability */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href={`${ART_ROUTE}?category=${art.category}`} className="category-badge">
                <FaTag style={{ fontSize: "0.7rem" }} />
                {art.category}
              </Link>
              <span className="availability-badge">
                <FaCheckCircle size={11} />
                In Stock
              </span>
            </div>

            {/* Title */}
            <h1 className="art-title">{art.title || art.name}</h1>

            {/* Rating */}
            <div className="rating-row">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
              </div>
              <span className="rating-label">4.5 out of 5</span>
              <span className="rating-count">{(initialComments).length + 128} reviews</span>
            </div>

            <div className="divider" />

            {/* Price */}
            <div className="price-section">
              <div className="price-label">Current Price</div>
              <div className="price-row">
                <span className="price-main">Rs. {(art.price * 0.9).toFixed(0)}</span>
                <span className="price-original">Rs. {art.price}</span>
                <span className="discount-badge">10% OFF</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="action-row">
              <AddToCart art={art} label="Add to Cart" />
            </div>

            <div className="divider" />

            {/* Perks */}
            <div className="perks-section">
              <div className="perk-item">
                <div className="perk-icon perk-icon-green"><FaTruck /></div>
                <div>
                  <div className="perk-text-main">Free Shipping</div>
                  <div className="perk-text-sub">On orders over Rs. 2000</div>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon perk-icon-blue"><FaUndo /></div>
                <div>
                  <div className="perk-text-main">30-Day Returns</div>
                  <div className="perk-text-sub">Money-back guarantee</div>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon perk-icon-purple"><FaShieldAlt /></div>
                <div>
                  <div className="perk-text-main">2-Year Warranty</div>
                  <div className="perk-text-sub">Fully covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="desc-section" style={{ marginTop: "2rem" }}>
          <div className="desc-tab-bar">
            <button className="desc-tab-btn active">Description</button>
          </div>
          <div className="desc-body">
            <Description description={art.description} />
          </div>
        </div>


        {/* Customer Reviews */}
        <div className="reviews-block">
          <ReviewsSection
            itemId={art._id || art.id}
            itemType="art"
            initialComments={art.comments || []}
          />
        </div>

        {/* Related Arts */}
        <div className="related-section">
          <div className="section-header">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="section-line" />
          </div>
          <MediaFeed type="art" genre={art.category} excludeId={artId || art._id} />
        </div>
      </div>
    </main>
  );
};

export default ArtDetails;