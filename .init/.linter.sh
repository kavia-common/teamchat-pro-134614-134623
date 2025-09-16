#!/bin/bash
cd /home/kavia/workspace/code-generation/teamchat-pro-134614-134623/slack_clone_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

