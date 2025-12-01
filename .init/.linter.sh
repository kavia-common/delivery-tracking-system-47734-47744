#!/bin/bash
cd /home/kavia/workspace/code-generation/delivery-tracking-system-47734-47744/delivery_tracker_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

