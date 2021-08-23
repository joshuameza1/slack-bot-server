const express = require('express');
require('dotenv').config();
const router = express.Router();
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token, { retries: 0 });

router.post('/slack/frontdesk', (req, res) => {
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
        callback_id: 'frontdesk',
        blocks: [
                {
            "type": "divider"
          },
          {
            "type": "input",
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
                  "value": "value-0"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Hosting Slide | 30sec",
                    "emoji": true
                  },
                  "value": "value-1"
                }
              ],
              "action_id": "static_select-action"
            },
            "label": {
              "type": "plain_text",
              "text": "What asset would you like to export?",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "title",
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_text_input-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Line One",
              "emoji": true
            }
          },
          {
            "type": "input",
            "block_id": "description",
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_text_input-action"
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
            "element": {
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Alpha",
                    "emoji": true
                  },
                  "value": "value-0"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Chroma",
                    "emoji": true
                  },
                  "value": "value-1"
                }
              ],
              "action_id": "radio_buttons-action"
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
    payload.view.callback_id === 'frontdesk'
  ) {
    const { values } = payload.view.state;
    const title = values.title.title.value;
    const description = values.description.description.value;

    console.log(`title ----->${title}`, `description---->${description}`);
  }
});

module.exports = router;
