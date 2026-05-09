"use client";
import usersApi from "@/api/users";

const UsersPage = () => {
  usersApi
    .getAllUsers()
    .then((response) => console.log(response))
    .catch((error) => console.log(error));

  return <div>UsersPage</div>;
};

export default UsersPage;
