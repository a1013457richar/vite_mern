import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFail,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFail,
} from "../redux/use/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [formData, setformData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false); //更新成功後顯示訊息
  const [listingError, setListingError] = useState(false);
  const [listing, setListing] = useState([]); //user的listing
  console.log("🚀 ~ Profile ~ listing:", listing);

  const { userData, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);
  const handleImageUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progress));
      },
      (error) => {
        setError(true);
      },
      () => {
        //add the download url to the database
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformData({ ...formData, profilePic: downloadURL });
        });
      }
    );
  };

  const handleChanges = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/users/delete/${userData._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(deleteUserStart(data.message));
        return; //就不會往下執行
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFail(error.message));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/users/update/${userData._id}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success === false) {
        dispatch(updateUserFail(data.message));
        return; //就不會往下執行
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFail(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await fetch(`/api/auth/signout`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signOutUserFail(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(signOutUserFail(error.message));
    }
  };

  const handleListing = async () => {
    try {
      setListingError(false);
      const response = await fetch(`/api/users/listing/${userData._id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setListing(data);
    } catch (error) {
      setListingError(true);
    }
  };

  const handleListingDelete = async (listingid) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListing(listing.filter((item) => item._id !== listingid));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        ></input>
        <img
          src={formData.profilePic || userData.profilePic}
          alt="profile "
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover "
          onClick={() => fileRef.current.click()}
        />
        <p className="self-center">
          {error ? (
            <span className="text-red-700">Error uploading image</span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-blue-500">{`Uploading ${progress}`}</span>
          ) : progress === 100 ? (
            <span className="text-green-500">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={userData.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChanges}
        ></input>
        <input
          defaultValue={userData.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChanges}
        ></input>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChanges}
        ></input>
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase  hover:opacity-95 disabled:opacity-30 p-3"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 "
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-500 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-500 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-500  mt-5">{error ? error : ""}</p>
      <p className="text-green-500 mt-5">
        {updateSuccess ? "Update Success" : ""}
      </p>
      <button className="text-green-600 w-full " onClick={handleListing}>
        Show Listing
      </button>
      <p className="text-red-600 mt-6">{listingError ? "Error Listing" : ""}</p>
      {listing && listing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {listing.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
