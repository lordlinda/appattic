import React from "react";

function Image({ image }) {
  return (
    <div>
      <img
        src={`${process.env.REACT_APP_URL}${image}`}
        alt="placeholderImage"
      />
    </div>
  );
}

export default Image;
