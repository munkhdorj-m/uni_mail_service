import React, { useEffect, useState } from "react";
import TileView from "devextreme-react/tile-view";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function Templates() {
  const [items, setItems] = useState([]);

  const url = "http://127.0.0.1:8080/mail/template";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      });
  }, []);

  let navigate = useNavigate();

  const itemClick = (e) => {
    routeChange();
    console.log(e.itemData);
  };

  const routeChange = () => {
    let path = "/mail";
    navigate(path);
  };

  return (
    <TileView
      id="tileView"
      onItemClick={itemClick}
      items={items}
      height={500}
      baseItemHeight={120}
      baseItemWidth={185}
      itemMargin={10}
      itemComponent={TileViewItem}
    />
  );
}

function TileViewItem({ data }) {
  return (
    <div className="dx-tile-content">
      <div className="templateName">{data.id}</div>
      <div
        className="image"
        style={{ backgroundImage: `url(${data.ImageSrc})` }}
      ></div>
    </div>
  );
}

export { Templates as TemplatesTileView };
