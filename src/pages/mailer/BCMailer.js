import React, { useState } from "react";
import "devextreme/ui/html_editor/converters/markdown";
import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item,
} from "devextreme-react/html-editor";
import ButtonGroup, { Item as ButtonItem } from "devextreme-react/button-group";
import "./style.css";

import { markup } from "./data.js";
import { Button } from "devextreme-react";

const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
const fontValues = [
  "Arial",
  "Courier New",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];
const headerValues = [false, 1, 2, 3, 4, 5];
const dialogTabs = ["url", "file"];

function BCMailer() {
  const [valueContent, setValueContent] = useState(markup);
  const [editorValueType, setEditorValueType] = useState("html");

  const isMultiline = true;
  const defaultSelectedItemKeys = ["html"];

  const fetchToServer = async (data) => {
    const url = "http://127.0.0.1:8080/mail/template";
    const trimmedData = data.replace(/\s/g, "");
    let toSend = { html: trimmedData };
    console.log(trimmedData);
    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(toSend),
    });
    // .then((response) => response.json());
    // .then((data) => alert(data.msg));
  };

  const fetchToServerSend = async (data) => {
    const url = "http://127.0.0.1:8080/mail/template";
    const trimmedData = data.replace(/\s/g, "");
    let toSend = { html: trimmedData };
    console.log(trimmedData);
    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert(data.msg);
      });
  };

  const fetchFromServer = async () => {
    const url = "http://127.0.0.1:8080/mail/template-types";
    fetch(url)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const saveTemplate = () => {
    fetchToServer(valueContent);
  };

  const valueChanged = (e) => {
    setValueContent(e.value);
    // console.log(valueContent);
  };

  const valueTypeChanged = (e) => {
    setEditorValueType(e.addedItems[0].text.toLowerCase());
  };

  return (
    <div className="widget-container">
      <HtmlEditor
        height="725px"
        defaultValue={markup}
        valueType={editorValueType}
        onValueChanged={valueChanged}
      >
        <MediaResizing enabled={true} />
        <ImageUpload
          fileUploadMode="base64"
          tabs={dialogTabs}
          uploadUrl="https://js.devexpress.com/Demos/Upload"
          uploadDirectory="./Images/"
        />
        <Toolbar multiline={isMultiline}>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item name="size" acceptedValues={sizeValues} />
          <Item name="font" acceptedValues={fontValues} />
          <Item name="separator" />
          <Item name="bold" />
          <Item name="italic" />
          <Item name="strike" />
          <Item name="underline" />
          <Item name="separator" />
          <Item name="alignLeft" />
          <Item name="alignCenter" />
          <Item name="alignRight" />
          <Item name="alignJustify" />
          <Item name="separator" />
          <Item name="orderedList" />
          <Item name="bulletList" />
          <Item name="separator" />
          <Item name="header" acceptedValues={headerValues} />
          <Item name="separator" />
          <Item name="color" />
          <Item name="background" />
          <Item name="separator" />
          <Item name="link" />
          <Item name="image" />
          <Item name="separator" />
          <Item name="clear" />
          <Item name="codeBlock" />
          <Item name="blockquote" />
          <Item name="separator" />
          <Item name="insertTable" />
          <Item name="deleteTable" />
          <Item name="insertRowAbove" />
          <Item name="insertRowBelow" />
          <Item name="deleteRow" />
          <Item name="insertColumnLeft" />
          <Item name="insertColumnRight" />
          <Item name="deleteColumn" />
        </Toolbar>
      </HtmlEditor>
      <div className="options">
        <ButtonGroup
          stylingMode="contained"
          onSelectionChanged={valueTypeChanged}
          defaultSelectedItemKeys={defaultSelectedItemKeys}
        >
          <ButtonItem text="Html" />
          <ButtonItem text="Markdown" />
        </ButtonGroup>
        <div>
          <Button text="save" onClick={saveTemplate} />
          <Button text="send" />
          <Button text="get" onClick={fetchFromServer} />
        </div>

        <div className="value-content">{valueContent}</div>
      </div>
    </div>
  );
}

export default BCMailer;
