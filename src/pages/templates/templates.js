import React, { useState } from "react";
import { TemplatesTileView } from "./tileView/TileView";
import { TemplatesTreeView } from "./treeView/TreeView";

const templates = () => {
  // const [currentItem, setCurrentItem] = useState();

  // const clicked = (e) => {
  //   // get event.data.id
  //   // fetch id to beackend
  //   //set data to currentItem
  // }

  const divStyle = {
    display: "flex",
    alignItems: "flex-start",
  };

  return (
    <>
      {/* <Templates onClick={clicked} dataSource={currentItem}/> */}
      <div style={divStyle}>
        <TemplatesTreeView />
        <TemplatesTileView />
      </div>
    </>
  );
};

export default templates;
