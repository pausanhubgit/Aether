"use client";

const ArtByIdError = ({error}) => {
  return (
    <div className="py-5 px-4 text-center text-red-500">
     {error.message}
    </div>
  )
}

export default ArtByIdError
