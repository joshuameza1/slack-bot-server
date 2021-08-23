const express = require('express');
require('dotenv').config();
const router = express.Router();
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token, { retries: 0 });

router.post('/slack/gfx', (req, res) => {
  const { trigger_id: triggerId } = req.body;

  res.status(200).send('');
  (async () => {
    // Open a modal.
    await web.views.open({
      trigger_id: triggerId,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'GFX PKG Exporter',
        },
        submit: {
          type: 'plain_text',
          text: 'Preview',
        },
        callback_id: 'gfx',
        blocks: [
                {
            "type": "divider"
          },
          {
            "type": "input",
            "block_id": "type",
            "element": {
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select an option",
                "emoji": true
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Nameslide | 10sec",
                    "emoji": true
                  },
                  "value": "nameslide"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Hosting Slide | 30sec",
                    "emoji": true
                  },
                  "value": "hosting_slide"
                }
              ],
              "action_id": "type"
            },
            "label": {
              "type": "plain_text",
              "text": "What asset would you like to export?",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "line_one",
            "element": {
              "type": "plain_text_input",
              "action_id": "line_one"
            },
            "label": {
              "type": "plain_text",
              "text": "Line One",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "line_two",
            "element": {
              "type": "plain_text_input",
              "action_id": "line_two"
            },
            "label": {
              "type": "plain_text",
              "text": "Line Two",
              "emoji": true
            },
            "optional": true
          },
          {
            "type": "divider"
          },
          {
            "type": "input",
            "block_id": "chroma_or_alpha",
            "element": {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Alpha",
                    "emoji": true
                  },
                  "value": "alpha"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Chroma",
                    "emoji": true
                  },
                  "value": "chroma"
                }
              ],
              "action_id": "chroma_or_alpha"
            },
            "label": {
              "type": "plain_text",
              "text": " "
            }
          }
        ],
      },
    });
  })();
});

router.post('/slack/interactions', (req, res) => {

  res.status(200).send();

  const payload = JSON.parse(req.body.payload);

  // view the payload on console
  console.log(payload);

  if (
    payload.type === 'view_submission' &&
    payload.view.callback_id === 'gfx'
  ) {
    const { values } = payload.view.state;
    const type = values.type.type.selected_option.value;
    const line_one = values.line_one.line_one.value;
    const line_two = values.line_two.line_two.value;
    const chroma_or_alpha = values.chroma_or_alpha.chroma_or_alpha.selected_option.value;
    

    console.log(`type -----> ${type}`, `line one ----> ${line_one}`, `line two ----> ${line_two}`, `chroma or alpha ----> ${chroma_or_alpha}`);
  }
});

module.exports = router;
