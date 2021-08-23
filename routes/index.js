const express = require("express");
require("dotenv").config();
const router = express.Router();
const { WebClient } = require("@slack/web-api");
const fs = require("fs");
var Slack = require('node-slack-upload');

const token = process.env.SLACK_TOKEN;

var slack = new Slack(token);

// Initialize
const web = new WebClient(token, { retries: 0 });

router.post("/slack/gfx", (req, res) => {
  const { trigger_id: triggerId } = req.body;

  res.status(200).send("");
  (async () => {
    // Open a modal.
    await web.views.open({
      trigger_id: triggerId,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "GFX PKG Exporter"
        },
        submit: {
          type: "plain_text",
          text: "Export"
        },
        callback_id: "gfx",
        blocks: [
          {
            type: "divider"
          },
          {
            type: "input",
            block_id: "type",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select an option",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Nameslide | 10sec",
                    emoji: true
                  },
                  value: "Nameslide"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Hosting Slide | 30sec",
                    emoji: true
                  },
                  value: "HostingSlide"
                }
              ],
              action_id: "type"
            },
            label: {
              type: "plain_text",
              text: "What asset would you like to export?",
              emoji: true
            }
          },
          {
            type: "input",
            block_id: "line_one",
            element: {
              type: "plain_text_input",
              action_id: "line_one"
            },
            label: {
              type: "plain_text",
              text: "Line One",
              emoji: true
            }
          },
          {
            type: "input",
            block_id: "line_two",
            element: {
              type: "plain_text_input",
              action_id: "line_two"
            },
            label: {
              type: "plain_text",
              text: "Line Two",
              emoji: true
            },
            optional: true
          },
          {
            type: "divider"
          },
          {
            type: "input",
            block_id: "chroma_or_alpha",
            element: {
              type: "radio_buttons",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Alpha",
                    emoji: true
                  },
                  value: "Alpha"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Chroma",
                    emoji: true
                  },
                  value: "Chroma"
                }
              ],
              action_id: "chroma_or_alpha"
            },
            label: {
              type: "plain_text",
              text: " "
            }
          }
        ]
      }
    });
  })();
});

router.post("/slack/interactions", (req, res) => {
  res.status(200).send();

  let payload = JSON.parse(req.body.payload);

  // view the payload on console
  //console.log(payload);

  if (
    payload.type === "view_submission" &&
    payload.view.callback_id === "gfx"
  ) {
    let user = payload.user;
    let name = user.name;
    let id = user.id;

    let { values } = payload.view.state;
    let type = values.type.type.selected_option.value;
    let line_one = values.line_one.line_one.value;
    let line_two = values.line_two.line_two.value;
    if (line_two == null) {
      line_two = "";
    }
    let chroma_or_alpha =
      values.chroma_or_alpha.chroma_or_alpha.selected_option.value;

    try {
      // Call the chat.postMessage method using the WebClient
      const result = web.chat.postMessage({
        channel: id,
        text: "Hey " + name + "! Your " + type + " for " + line_one + " is being rendered and will be uploaded here shortly!"
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }

    const fileName = "template_render.json";

    fs.readFile(fileName, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      var newData = data
        .replace("*TYPE*", type)
        .replace("*CHROMAORALPHA*", chroma_or_alpha)
        .replace("*LINEONE*", line_one)
        .replace("*LINETWO*", line_two);

      //console.log(newData);

      fs.writeFile("render.json", newData, "utf8", function(err) {
        if (err) return console.log(err);   
      });
    });

   
    slack.uploadFile({
      content: 'My file contents!',
      filetype: 'post',
      title: 'README',
      initialComment: 'my comment',
      channels: id
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
      else {
        console.log('Uploaded file details: ', data);
      }
    });
    
    
    
  }
});

module.exports = router;
