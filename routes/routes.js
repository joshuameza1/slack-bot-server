"use strict";

const express = require("express");
require("dotenv").config();
const router = express.Router();
const { WebClient } = require("@slack/web-api");
const fs = require("fs");
var socket = require("../handlers/request.js");

const token = process.env.SLACK_TOKEN;
const GFX = process.env.GFX;

// Initialize
const web = new WebClient(token, { retries: 0 });

router.post("/slack/gfx", (req, res) => {
  console.log("Slash Command triggered from Slack.");

  const { trigger_id: triggerId } = req.body;
  //io.client.emit("hello", "world");
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
              multiline: true,
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
              multiline: true,
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

  console.log("Request Form sent to Slack.");
});

let type = "";
let chroma_or_alpha = "";
let line_one = "";
let new_line_one = "";
let line_two = "";
let new_line_two = "";
let filename = "";
let codec = "";

router.post("/slack/interactions", (req, res) => {
  res.status(200).send();

  let payload = JSON.parse(req.body.payload);
  //console.log(payload);

  // view the payload on console
  console.log("Request Form submitted from Slack.");

  if (
    payload.type === "view_submission" &&
    payload.view.callback_id === "gfx"
  ) {
    let user = payload.user;
    let name = user.name;
    let id = user.id;

    let { values } = payload.view.state;
    type = values.type.type.selected_option.value;
    line_one = values.line_one.line_one.value;
    new_line_one = line_one.replace(/(\r\n|\n|\r)/gm, "\\r");
    line_one = line_one.replace(/(\r\n|\n|\r)/gm, " ");
    line_two = values.line_two.line_two.value;
    if (line_two == null) {
      line_two = "";
    }
    new_line_two = line_two.replace(/(\r\n|\n|\r)/gm, "\\r");
    line_two = line_two.replace(/(\r\n|\n|\r)/gm, " ");

    chroma_or_alpha =
      values.chroma_or_alpha.chroma_or_alpha.selected_option.value;
    switch (chroma_or_alpha) {
      case "Chroma":
        codec = "3";
        break;
      case "Alpha":
        codec = "4";
        break;
    }
    function titleCase(str) {
      return str
        .toLowerCase()
        .split(" ")
        .map(function(word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }

    filename =
      GFX + "_" + type + "_" + titleCase(line_one.replace("&", "And")) + "_" + chroma_or_alpha;

    //PREVIEW

    const previewFileName = "./src/template_preview.json";

    fs.readFile(previewFileName, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      var newPreviewData = data
        .replace("*GFX*", GFX)
        .replace("*GFX*", GFX)
        .replace("*TYPE*", type)
        .replace("*CHROMAORALPHA*", chroma_or_alpha)
        .replace("*LINEONE*", new_line_one)
        .replace("*LINETWO*", new_line_two)
        .replace("*FILENAME*", filename.replace(/\s/g, ""))

      var fileName =
        filename.replace(/\s/g, "").replace("&", "And") + "_Preview.png";

      socket.emit("requestPreview", [fileName, newPreviewData]);
      console.log("Sent JSON Data over to Server.");
    });

    //SEND Preview for Confirmation

    try {
      // Call the chat.postMessage method using the WebClient
      const result = web.chat.postMessage({
        channel: id,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "Hey *" +
                name +
                "*! A preview of your *" +
                type +
                "* is being produced!"
            }
          }
        ]
      });
      console.log("Sent Confirmation Message to Slack.");
    } catch (error) {
      console.error(error);
    }

    socket.once("previewDone2", arg => {
      console.log("Render Receieved from Server.");
      console.log(arg[1]); 
      fs.writeFileSync('preview.png', arg[2], 'base64', (err) => {
        console.log(err);
      });
      
      try {
      // Call the files.upload method using the WebClient
            const result = web.files.upload({
              channel: id,
              // channels can be a list of one to many strings
              file: fs.createReadStream('./preview.png')
            });
            console.log(result);
          } catch (error) {
          console.error(error);
        }
        

        try {
          web.chat.postMessage({
          channel: id,
          text: "Does this preview look correct? :eyes:",
          "attachments": [
            {
              "blocks": [
                {
                  "type": "image",
                  "title": {
                    "type": "plain_text",
                    "text": arg[0],
                    "emoji": true
                  },
                  "image_url": "https://api.slack.com/img/blocks/bkb_template_images/onboardingComplex.jpg",
                  "alt_text": arg[0]
                }
              ]
            },
            {
              "text": "",
              "color": "#36a64f",
              "callback_id": "preview_confirmation",
              "attachment_type": "default", 
              "actions": [
                  {
                      "name": "option",
                      "text": "Yes",
                      "style": "primary",
                      "type": "button",
                      "value": "yes"
                  },
                {
                      "name": "option",
                      "text": "No",
                      "style": "danger",
                      "type": "button",
                      "value": "no"
                  }
              ]
            }
          ]
        });
        
        } catch (error) {
        console.error(error);
      }
      
      
    });
  } else if (
    payload.type === "interactive_message" &&
    payload.callback_id === "preview_confirmation"
  ) {
    let user = payload.user;
    let name = user.name;
    let id = user.id;
    let originalMessageID = payload.original_message.ts;
    let actions = payload.actions[0];
    let response = actions.value;

    if (response === "yes") {
      //console.log("yes");

      try {
        // Call the chat.delete method using the WebClient
        const result = web.chat.delete({
          channel: id,
          ts: originalMessageID
        });

        //console.log(result);
      } catch (error) {
        console.error(error);
      }

      const finalFileName = "./src/template_render.json";

      fs.readFile(finalFileName, "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        var newFinalData = data
          .replace("*GFX*", GFX)
          .replace("*GFX*", GFX)
          .replace("*TYPE*", type)
          .replace("*CHROMAORALPHA*", chroma_or_alpha)
          .replace("*LINEONE*", new_line_one)
          .replace("*LINETWO*", new_line_two)
          .replace("*FILENAME*", filename.replace(/\s/g, ""))
          .replace("*CODEC*", codec);

        var fileName =
          filename.replace(/\s/g, "").replace("&", "And") + ".mov";

        socket.emit("requestFinal", [fileName, newFinalData]);
        console.log("Sent JSON Data over to Server.");
      });

      // Send Message to Notify user that thier graphic is rendering.

      try {
        // Call the chat.postMessage method using the WebClient
        const result = web.chat.postMessage({
          channel: id,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text:
                  "Thanks! Your *" +
                  type +
                  "* for *" +
                  line_one +
                  "* is currently being rendered! :muscle:"
              }
            }
          ]
        });

        console.log("Sent Confirmation Message to Slack.");
      } catch (error) {
        console.error(error);
      }

      socket.once("finalDone2", arg => {
        console.log("Render Receieved from Server.");
        //console.log(data); // world
        try {
          // Call the chat.postMessage method using the WebClient
          const result = web.chat.postMessage({
            channel: id,
            attachments: [
              {
                color: "#36a64f",
                pretext:
                  ":sparkles: Your *" +
                  type +
                  "* is finished rendering! :sparkles:",
                title: arg[0],
                title_link: arg[1]
              }
            ]
          });
        } catch (error) {
          console.error(error);
        }
        console.log("Sent Render to Slack.");
      });
    } else if (response === "no") {
      //console.log("no");

      try {
        // Call the chat.delete method using the WebClient
        const result = web.chat.delete({
          channel: id,
          ts: originalMessageID
        });

        console.log(result);
      } catch (error) {
        console.error(error);
      }

      try {
        // Call the chat.postMessage method using the WebClient
        const result = web.chat.postMessage({
          channel: id,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Your render has been canceled. TRY AGAIN* :pensive:"
              }
            }
          ]
        });
        console.log("Sent Confirmation Message to Slack.");
      } catch (error) {
        console.error(error);
      }
    }
  }
});

module.exports = router;
