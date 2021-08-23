const Slack = require('nodejslack');
const request = require('request');
const express = require("express");
require("dotenv").config();
const router = express.Router();
const { WebClient } = require("@slack/web-api");
const fs = require("fs");


const token = process.env.SLACK_TOKEN;

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
          text: "Preview"
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
  
  
  const payload = JSON.parse(req.body.payload);

  // view the payload on console
  console.log(payload);

  if (
    payload.type === "view_submission" &&
    payload.view.callback_id === "gfx"
  ) {
    
    const slack = new Slack(process.env.SLACK_TOKEN);
    
    
    const form = {
      file: fs.createReadStream('test.png'), // Optional, via multipart/form-data. If omitting this parameter, you MUST submit content 
      // content: 'Your text here', // Optional, File contents. If omitting this parameter, you must provide a `file`  
      filename: 'test.png', // Required  
      fileType: 'auto', // Optional, See more file types in https://api.slack.com/types/file#file_types 
      title: 'Test PNG', // Optional 
      initial_comment: 'First comment about this file.', // Optional 
      channels: 'general' //Optional, If you want to put more than one channel, separate using comma, example: 'general,random' 
    };

    slack.fileUpload(form)
    .then(function(response){

        // Slack sends a json with a boolean var ok.  
        // Error example : data = { ok: false, error: 'user_not_found'         } 
        // Error example : data = { ok: true, file: 'user_not_found' } 
        if(!response || !response.ok){
            return Promise.reject(new Error('Something wrong happened during the upload.'));
        }
        console.log('Uploaded Successfully:',response);

        return Promise.resolve(response);
    })
    .catch(function(err){
        return err;
    });
    
    
    const { values } = payload.view.state;
    const type = values.type.type.selected_option.value;
    const line_one = values.line_one.line_one.value;
    const line_two = values.line_two.line_two.value;
    const chroma_or_alpha =
      values.chroma_or_alpha.chroma_or_alpha.selected_option.value;

    
    const fileName = "template_preview.json";

    fs.readFile(fileName, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      var newData = data
        .replace("*TYPE*", type)
        .replace("*CHROMAORALPHA*", chroma_or_alpha)
        .replace("*LINEONE*", line_one)
        .replace("*LINETWO*", line_two);
        

      console.log(newData);

      fs.writeFile("preview.json", newData, "utf8", function(err) {
        if (err) return console.log(err);
      });
    });
  }
});

module.exports = router;
