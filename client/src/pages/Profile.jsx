import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-500 cursor-pointer">
          Delete Account
        </span>
        <span className="text-red-500 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-500  mt-5">{error ? error : ""}</p>
      <p className="text-green-500 mt-5">
        {updateSuccess ? "Update Success" : ""}
      </p>
    </div>
  );
};

export default Profile;
