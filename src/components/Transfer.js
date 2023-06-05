import React from "react";

function Transfer({ callthis }) {
  return (
    <div>
      <>
        <a className="btn" onClick={callthis}>
          Transfer
        </a>
      </>
    </div>
  );
}

export default Transfer;
