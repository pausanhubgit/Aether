import videoAPI from "@/api/video";
import VideoForm from "../../_components/Form";
import BackButton from "@/components/BackButton";

const EditVideo = async ({ params }) => {
  const id = (await params).id;
  const response = await videoAPI.getVideoById(id);
  const video = response.data;

  return (
    <section className="min-h-screen bg-gray-50/50 dark:bg-[#160327]/50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <BackButton />
        <div className="bg-white dark:bg-[#160327] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white tracking-tight">
            Refine Video Content
          </h2>
          <VideoForm video={video} isEditing={true} />
        </div>
      </div>
    </section>
  );
};

export default EditVideo;
