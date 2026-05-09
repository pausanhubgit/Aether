import Modal from "@/components/Modal";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import videoAPI from "@/api/video";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refreshList } from "@/redux/video/videoSlice";

const DeleteVideoButton = ({ id }) => {
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  function confirmDelete() {
    videoAPI
      .deleteVideo(id)
      .then(() => {
        dispatch(refreshList(true));
        toast.success("Video deleted successfully.", { autoClose: 1500 });
      })
      .catch((error) =>
        toast.error(error?.response?.data || "Error deleting video", {
          autoClose: 1500,
        }),
      )
      .finally(() => setShowModal(false));
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
      >
        <FaTrash /> <span className="text-xs font-semibold">Delete</span>
      </button>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        icon={<FiAlertCircle className="mx-auto mb-4 text-red-600 w-12 h-12" />}
        label="Are you sure you want to delete this video?"
        confirmAction={
          <button
            onClick={confirmDelete}
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          >
            Yes, I&apos;m sure
          </button>
        }
      />
    </>
  );
};

export default DeleteVideoButton;
