#!/bin/bash

# Check whether screen idle/blanking is currently suspended
state=$(xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/presentation-mode 2>/dev/null || echo false)

if [ "$state" = "true" ]; then
    printf '%%{T5}\xee\xa4\x80%%{T-}\n'  # U+E900 eye
else
    printf '%%{T5}\xee\xa4\x81%%{T-}\n'  # U+E901 eye-closed
fi
