const ArtReview = async ({ params }) => {
  const artId = (await params).artId;
  const reviewId = (await params).reviewId;

  return (
    <div>
      <h1 className="text-4xl">ArtId: {artId}</h1>
      <h2>ArtReview: {reviewId}</h2>
    </div>
  );
};

export default ArtReview;
