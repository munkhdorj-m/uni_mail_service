import React, { useEffect, useState } from "react";

import TreeView from "devextreme-react/tree-view";
import "./styles.css";

function App() {
  const [items, setItems] = useState();

  const value = "contains";
  const url = "http://127.0.0.1:8080/mail/template-types";

  const fetchToServer = async (data) => {
    const turl = "http://127.0.0.1:8080/mail/template";
    let toSend = { name: data };
    console.log(toSend);
    fetch(turl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => response.json())
      .then((data) => alert(data.msg));
  };

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      });
  }, []);

  // const itemTemplate = (item) => {
  //   if (item.price) {
  //     return `${item.name} ($${item.price})`;
  //   } else {
  //     return `${item.name}`;
  //   }
  // };

  const itemClick = (e) => {
    fetchToServer(e.itemData.name);
    console.log(e.itemData.name);
  };

  return (
    <TreeView
      id="treeview"
      dataSource={items}
      displayExpr="name"
      onItemClick={itemClick}
      parentIdExpr="categoryId"
      width={300}
      searchMode={value}
      searchEnabled={true}
    />
  );
}

export { App as TemplatesTreeView };
