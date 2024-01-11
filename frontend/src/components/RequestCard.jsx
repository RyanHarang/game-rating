import React, { useState } from "react";
import axios from "axios";

const RequestCard = ({ request }) => {
  const { title, site, imageUrl } = request;
  const [isApproved, setIsApproved] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  const handleApprove = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("site", site);
      formData.append("imageUrl", imageUrl);
      const response = await axios.post(
        "http://localhost:4000/games/upload-game",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.delete(
        `http://localhost:4000/requests/approve/${request.title}`
      );
      console.log(response.data);
      setIsApproved(true);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleDeny = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/requests/deny/${request.title}`
      );
      console.log(response.data);
      setIsDenied(true);
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  return (
    <div className="request-container">
      <img
        src={imageUrl}
        alt={title}
        className="request-image"
        loading="lazy"
      />
      <div className="request-details">
        <h3 className="request-title">{title}</h3>
        <p className="request-site">{site}</p>
      </div>
      <div className="request-actions">
        <button
          onClick={() => handleApprove()}
          className={`approve ${isApproved || isDenied ? "disabled" : ""}`}
          disabled={isApproved || isDenied}
        >
          Approve
        </button>
        <button
          onClick={() => handleDeny()}
          className={`deny ${isApproved || isDenied ? "disabled" : ""}`}
          disabled={isApproved || isDenied}
        >
          Deny
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
