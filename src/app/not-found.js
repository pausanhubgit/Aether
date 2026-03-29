import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="text-3xl font-bold text-center h-[80vh] flex flex-col justify-center items-center">
      <h2 className="text-8xl font-bold">
        4<span className="text-9xl text-red-500">0</span>4
      </h2>
      <h1 className="text-3xl font-semibold mt-4">Page Not Found</h1>
<Link href="/" className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;