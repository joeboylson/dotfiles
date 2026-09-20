#!/bin/bash

# Toggle screen idle/blanking suspension
~/.local/bin/caffeine >/dev/null

# Force polybar to update the module immediately
polybar-msg action "#caffeine.hook.0" >/dev/null 2>&1
