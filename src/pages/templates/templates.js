import React from "react";

import Menu from "devextreme-react/menu";
import TileView from "devextreme-react/tile-view";
import "./style.css";

import sample from "./sample2.json";
import EmailEditor from "react-email-editor";
import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item,
} from "devextreme-react/html-editor";

import Form, {
  SimpleItem,
  EmailRule,
  RequiredRule,
  ButtonItem,
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import "devextreme-react/autocomplete";
import "./style.css";

import { markup } from "./data.js";
import { Button } from "devextreme-react";

class Templates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      menuItems: [],
      tileViewItemData: [],
      valueContent: sample,
      emailInfo: {
        Recipient: "muuduu5@yahoo.com",
        Sender: "muuduu90@gmail.com",
        Subject: "Sent from uni mail service",
      },
    };

    this.myRef = React.createRef();
    this.buttonOptions = {
      onClick: this.sendEmail,
      text: "Send Email",
      type: "success",
      useSubmitBehavior: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  // fontValues = [
  //   "Arial",
  //   "Courier New",
  //   "Georgia",
  //   "Impact",
  //   "Lucida Console",
  //   "Tahoma",
  //   "Times New Roman",
  //   "Verdana",
  // ];
  // headerValues = [false, 1, 2, 3, 4, 5];

  createTemplate = async (data) => {
    const url = "http://127.0.0.1:8080/mail/template";
    let toSend = {};
    const jsonstring = JSON.stringify(data);
    toSend.html = jsonstring;

    console.log(jsonstring);
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
    // .then((response) => response.json())
    // .then((data) => alert(data.msg))
    // .catch((error) => {
    //   console.error(error);
    // });
  };

  getTemplateTypes = async () => {
    const url = "http://127.0.0.1:8080/mail/template-types";
    fetch(url)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error(error);
      });
  };

  updateTemplate = async () => {
    let toSend = { html: this.state.valueContent };
    toSend.id = this.state.tileViewItemData.id;
    console.log(toSend);
    const url = "http://127.0.0.1:8080/mail/template";
    fetch(url, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    });
    // .then((response) => response.json())
    // .then((data) => console.log(data))
    // .catch((error) => {
    //   console.error(error);
    // });
  };

  sendEmail = async () => {
    const url = "http://127.0.0.1:8080/mail/mailer";
    const toSend = {};
    toSend.recipient = this.state.emailInfo.Recipient;
    toSend.sender = this.state.emailInfo.Sender;
    toSend.subject = this.state.emailInfo.Subject;
    toSend.html = this.state.valueContent;

    console.log(toSend);
    await fetch(url, {
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  editorValueChanged = (e) => {
    this.setState({ valueContent: e.value });
    // console.log(valueContent);
  };

  handleSubmit(e) {
    notify(
      {
        message: "Email has sent successfully",
        position: {
          my: "center top",
          at: "center top",
        },
      },
      "success",
      3000
    );
    e.preventDefault();
  }

  createNewTemplate = (e) => {
    this.createTemplate(this.state.valueContent);
  };

  getTemplateDataFromServer = async (data) => {
    const url = "http://127.0.0.1:8080/mail/get-template-types";
    let toSend = { name: data };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(toSend),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ templates: data });
        console.log(this.state.templates);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async componentDidMount() {
    try {
      const responseFromTemplateTypes = await fetch(
        "http://127.0.0.1:8080/mail/template-types"
      );
      const dataOfTemplateTypes = await responseFromTemplateTypes.json();
      const responseFromTemplate = await fetch(
        "http://127.0.0.1:8080/mail/template"
      );
      const dataOfTemplate = await responseFromTemplate.json();
      this.setState({ menuItems: dataOfTemplateTypes });
      this.setState({ templates: dataOfTemplate });
    } catch (error) {
      console.error(error);
    }
  }

  menuItemClick = (e) => {
    this.getTemplateDataFromServer(e.itemData.name);
    console.log(e.itemData);
  };

  tileViewItemClick = (e) => {
    this.setState({ tileViewItemData: e.itemData });
    console.log(e.itemData);
  };

  saveDesign = () => {
    this.myRef.current.editor.saveDesign((design) => {
      // console.log("saveDesign- ", JSON.stringify(design));
    });
  };

  onLoad = () => {
    this.myRef.current.editor.loadDesign(sample);
    this.myRef.current.editor.addEventListener(
      "design:updated",
      this.saveDesign
    );
  };
  onDesignLoad = (data) => {
    console.log("onDesignLoad", data);
  };

  Cons = async () => {
    await this.myRef.current.editor.exportHtml(async (data) => {
      const { html } = data;
      console.log(html);
      this.setState({ valueContent: data });
      this.state.valueContent = data.html;
      console.log(this.state.valueContent);
      this.sendEmail();
      // const response = await axios.post('http://localhost:4000/send-email', {mensaje: html},{
      //   headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
      // }).catch((error)=>{
      //   console.log(error);
      // });
      // console.log(response);
    });
  };
  render() {
    return (
      <div className="widget-container">
        <div>
          <Menu
            dataSource={this.state.menuItems}
            displayExpr="name"
            onItemClick={this.menuItemClick}
          />

          <TileView
            id="tileView"
            onItemClick={this.tileViewItemClick}
            items={this.state.templates}
            height={"450px"}
            direction={"horizontal"}
            baseItemHeight={400}
            baseItemWidth={230}
            showScrollbar={"onHover"}
            itemMargin={10}
            itemComponent={TileViewItem}
          />
          <EmailEditor
            ref={this.myRef}
            onLoad={this.onLoad}
            onDesignLoad={this.onDesignLoad}
          />
          {/* <HtmlEditor
              height="725px"
              // value={this.state.valueContent}
              value={this.state.tileViewItemData.html}
              valueType="html"
              onValueChanged={this.editorValueChanged}
            >
              <MediaResizing enabled={true} />
              <ImageUpload
                fileUploadMode="base64"
                tabs="file"
                uploadUrl="http://127.0.0.1:8080/mail/upload"
              />
              <Toolbar multiline="true">
                <Item name="undo" />
                <Item name="redo" />
                <Item name="separator" />
                <Item name="size" acceptedValues={this.sizeValues} />
                <Item name="font" acceptedValues={this.fontValues} />
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
                <Item name="header" acceptedValues={this.headerValues} />
                <Item name="separator" />
                <Item name="color" />
                <Item name="background" />
                <Item name="separator" />
                <Item name="link" />
                <Item name="image" />
                <Item name="separator" />
                <Item name="clear" />
                <Item name="separator" />
              </Toolbar>
            </HtmlEditor> */}

          <div className="options">
            <form onSubmit={this.handleSubmit}>
              <Form
                colCount={3}
                formData={this.state.emailInfo}
                readOnly={false}
                showColonAfterLabel={true}
                showValidationSummary={true}
              >
                <SimpleItem dataField="Recipient" editorType="dxTextBox">
                  <RequiredRule message="Email is required" />
                  <EmailRule message="Email is invalid" />
                </SimpleItem>
                <SimpleItem dataField="Sender" editorType="dxTextBox">
                  <RequiredRule message="Email is required" />
                  <EmailRule message="Email is invalid" />
                </SimpleItem>
                <SimpleItem dataField="Subject">
                  <RequiredRule message="Subject is required" />
                </SimpleItem>
                <ButtonItem
                  className="button-item"
                  horizontalAlignment="left"
                  buttonOptions={this.buttonOptions}
                />
              </Form>
            </form>
            <Button
              className="button-item"
              text="create template"
              onClick={this.createNewTemplate}
            />
            <Button
              className="button-item"
              text="update template"
              onClick={this.updateTemplate}
            />
            <Button
              className="button-item"
              text="get"
              onClick={this.getTemplateTypes}
            />
          </div>
        </div>
      </div>
    );
  }
}

function TileViewItem({ data }) {
  return (
    <div className="dx-tile-content">
      <div className="templateName">{"Template " + data.id}</div>
      <div
        className="image"
        style={{
          backgroundImage: `url(${data.ImageSrc})`,
        }}
      >
        {data.html}
      </div>
    </div>
  );
}

export default Templates;
