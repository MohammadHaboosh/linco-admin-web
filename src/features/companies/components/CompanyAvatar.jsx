import { useState } from "react";
import commonStyles from "../../../components/common/Common.module.css";

const getInitials = (name) => {
  const initials = String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "CO";
};

const CompanyAvatar = ({ imagePath, name }) => {
  const [failedImagePath, setFailedImagePath] = useState("");

  const showImage = imagePath && imagePath !== failedImagePath;

  return (
    <span className={commonStyles.avatar}>
      {showImage ? (
        <img
          alt=""
          onError={() => setFailedImagePath(imagePath)}
          src={imagePath}
        />
      ) : getInitials(name)}
    </span>
  );
};

export default CompanyAvatar;
