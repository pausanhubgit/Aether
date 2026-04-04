import { FaPencil, FaRegCircleUser, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import usersApi from "@/api/users";
import { useState } from "react";
import Modal from "@/components/Modal";
import { ADMIN_ROLE, MERCHANT_ROLE, USER_ROLE } from "@/constants/userRoles";
import { useSelector } from "react-redux";

const Action = ({ id, userRoles = [] }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState(userRoles);

  const isSelf = currentUser?._id === id || currentUser?.id === id;

  // Case-insensitive role check
  const hasRole = (role) => roles.some(r => r.toUpperCase() === role.toUpperCase());

  function updateRole(role) {
    let updatedRoles = [...roles];

    if (hasRole(role)) {
      // Remove match case-insensitively
      updatedRoles = updatedRoles.filter((item) => item.toUpperCase() != role.toUpperCase());
    } else {
      updatedRoles.push(role);
    }

    setRoles(updatedRoles);
  }

  function update() {
    // Normalize to uppercase for backend consistency (standard for role-based auth)
    const normalizedRoles = roles.map(r => r.toUpperCase());

    usersApi.updateUserRoles(id, { roles: normalizedRoles })
      .then(() => {
        toast.success(`User update success.`, { autoClose: 1500 });
        setTimeout(() => window.location.reload(), 1000); // Reload to reflect changes globally
      })
      .catch((error) => {
        toast.error(error.response?.data || "User update failed.", { autoClose: 1500 });
      })
      .finally(() => {
        setShowModal(false);
      });
  }

  function removeUser() {
    if (isSelf) {
      return toast.error("You cannot delete your own account from the admin panel.");
    }

    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      usersApi.deleteUser(id)
        .then(() => {
          toast.success("User deleted successfully.");
          setTimeout(() => window.location.reload(), 1000);
        })
        .catch(() => {
          toast.error("Failed to delete user.");
        });
    }
  }

  return (
    <div className="flex items-center gap-4 justify-center">
      <button
        onClick={() => setShowModal(true)}
        className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        <FaPencil /> <span className="text-xs font-semibold">Edit</span>
      </button>

      <button
        onClick={removeUser}
        className="text-red-600 cursor-pointer hover:text-red-800 transition-colors flex items-center gap-1"
      >
        <FaTrash /> <span className="text-xs font-semibold">Delete</span>
      </button>

      <Modal
        icon={
          <FaRegCircleUser className="mx-auto text-6xl text-gray-400 mb-5" />
        }
        showModal={showModal}
        setShowModal={setShowModal}
        label={"Update user roles."}
        info={
          <div className="pb-5 space-y-4">
            {isSelf && (
              <p className="text-amber-600 text-[10px] font-bold uppercase tracking-wider text-center bg-amber-50 py-2 rounded-lg border border-amber-100">
                ⚠️ You are editing your own roles. demotion is disabled.
              </p>
            )}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center group">
                <input
                  type="checkbox"
                  id={`admin-${id}`}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  checked={hasRole(ADMIN_ROLE)}
                  onChange={() => updateRole(ADMIN_ROLE)}
                  disabled={isSelf}
                />
                <label htmlFor={`admin-${id}`} className="ml-2 text-sm font-bold text-gray-700 cursor-pointer group-hover:text-purple-600 transition-colors">ADMIN</label>
              </div>
              <div className="flex items-center group">
                <input
                  type="checkbox"
                  id={`merchant-${id}`}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  checked={hasRole(MERCHANT_ROLE)}
                  onChange={() => updateRole(MERCHANT_ROLE)}
                />
                <label htmlFor={`merchant-${id}`} className="ml-2 text-sm font-bold text-gray-700 cursor-pointer group-hover:text-blue-600 transition-colors">MERCHANT</label>
              </div>
              <div className="flex items-center group">
                <input
                  type="checkbox"
                  id={`user-${id}`}
                  className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                  checked={hasRole(USER_ROLE)}
                  disabled
                />
                <label htmlFor={`user-${id}`} className="ml-2 text-sm font-bold text-gray-400 cursor-not-allowed">USER</label>
              </div>
            </div>
          </div>
        }
        confirmAction={
          <button
            onClick={update}
            className="bg-green-700 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-800"
          >
            Update
          </button>
        }
      />
    </div>
  );
};

export default Action;