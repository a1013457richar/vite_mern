import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      requiered: true,
      unique: true,
    },
    password: {
      type: String,
      requiered: true,
    },
    profilePic: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw3GDQf-aTjCOZI2dj-Wljdx&ust=1705281514803000&source=images&cd=vfe&ved=0CBMQjRxqFwoTCJigkOna24MDFQAAAAAdAAAAABAE",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
