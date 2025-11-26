import React from "react";

export default function NewsItem(props) {
  const { title, description, imageUrl, newsUrl } = props;
  // fallback image if none
  const fallback = "https://via.placeholder.com/300x200?text=No+Image";
  return (
    <div className="card my-2">
      <img src={imageUrl || fallback} className="card-img-top" alt={title} style={{ height: "200px", objectFit: "cover" }} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <a href={newsUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-dark">Read More</a>
      </div>
    </div>
  );
}
