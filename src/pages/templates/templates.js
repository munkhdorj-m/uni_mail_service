import React from "react";

import Menu from "devextreme-react/menu";
import TileView from "devextreme-react/tile-view";
import "./style.css";

import sample from "./design.json";
import EmailEditor from "react-email-editor";
import Form, {
  SimpleItem,
  EmailRule,
  RequiredRule,
  ButtonItem,
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import "devextreme-react/autocomplete";
import "./style.css";

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
      onClick: this.Cons,
      text: "Send Email",
      type: "success",
      useSubmitBehavior: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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

  createTemplateInServer = async (data) => {
    const url = "http://127.0.0.1:8080/mail/template";
    let toSend = {};
    const jsonstring = JSON.stringify(data);
    toSend.html = jsonstring;
    toSend.image_src = this.state.tileViewItemData.image_src;
    console.log(this.state.tileViewItemData);
    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    });
    // .then((response) => response.json())
    // .then((data) => alert(data.msg))
    // .catch((error) => {
    //   console.error(error);
    // });
  };

  deleteTemplateInServer = async (data) => {
    const url = "http://127.0.0.1:8080/mail/template";
    let toSend = {};
    const jsonstring = JSON.stringify(data);
    toSend.html = jsonstring;
    toSend.id = this.state.tileViewItemData.id;

    fetch(url, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    });
  };

  updateTemplateInServer = async (data) => {
    let toSend = {};
    const jsonstring = JSON.stringify(data);
    toSend.html = jsonstring;
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

  editorValueChanged = (e) => {
    this.setState({ valueContent: e.value });
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

  deleteTemplate = (e) => {
    this.deleteTemplateInServer(this.state.valueContent);
  };

  createNewTemplate = (e) => {
    this.createTemplateInServer(this.state.valueContent);
  };

  updateTemplate = (e) => {
    this.updateTemplateInServer(this.state.valueContent);
  };

  menuItemClick = (e) => {
    this.getTemplateDataFromServer(e.itemData.name);
    console.log(e.itemData);
  };

  tileViewItemClick = (e) => {
    this.state.tileViewItemData = e.itemData;
    console.log(this.state.tileViewItemData);
    this.changeTemplate(e.itemData);
  };

  saveDesign = () => {
    this.myRef.current.editor.saveDesign((design) => {
      console.log(design);
      this.state.valueContent = design;
    });
  };

  changeTemplate = (data) => {
    const jsonString = JSON.parse(data.html);
    this.myRef.current.editor.loadDesign(jsonString);
  };

  onLoad = () => {
    // this.myRef.current.editor.loadDesign(sample);
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
      this.state.valueContent = data.html;
      this.sendEmail();
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
            height={"500px"}
            direction={"horizontal"}
            baseItemHeight={400}
            baseItemWidth={230}
            showScrollbar={"always"}
            itemMargin={10}
            itemComponent={TileViewItem}
          />
          <EmailEditor
            ref={this.myRef}
            onLoad={this.onLoad}
            onDesignLoad={this.onDesignLoad}
          />
          <div className="options">
            <form onSubmit={this.handleSubmit}>
              <Form
                colCount={2}
                formData={this.state.emailInfo}
                readOnly={false}
                showColonAfterLabel={true}
                showValidationSummary={true}
              >
                <SimpleItem dataField="Recipient" editorType="dxTextBox">
                  <RequiredRule message="Email is required" />
                  <EmailRule message="Email is invalid" />
                </SimpleItem>
                {/* <SimpleItem dataField="Sender" editorType="dxTextBox">
                  <RequiredRule message="Email is required" />
                  <EmailRule message="Email is invalid" />
                </SimpleItem> */}
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
              text="delete template"
              // onClick={this.deleteTemplate}
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
      {/* <div className="templateName">{"Template " + data.id}</div> */}
      <img
        className="tile-image"
        src={data.image_src}
        max-width={230}
        height={400}
      />
    </div>
  );
}

export default Templates;
