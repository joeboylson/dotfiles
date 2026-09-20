#!/bin/bash

# Get current time
h=$(date +%H)
m=$(date +%M)
s=$(date +%S)

# Convert to binary representation
to_binary() {
    local num=$1
    local bits=$2
    local result=""

    for ((i=bits-1; i>=0; i--)); do
        if ((num & (1 << i))); then
            result+="█"
        else
            result+="░"
        fi
    done
    echo "$result"
}

# Hours (6 bits for 0-23)
h1=$(to_binary $((h / 10)) 3)
h2=$(to_binary $((h % 10)) 4)

# Minutes (6 bits for 0-59)
m1=$(to_binary $((m / 10)) 3)
m2=$(to_binary $((m % 10)) 4)

# Seconds (6 bits for 0-59)
s1=$(to_binary $((s / 10)) 3)
s2=$(to_binary $((s % 10)) 4)

# Output: split into rows for vertical display
row1="${h1:0:1}${h2:0:1} ${m1:0:1}${m2:0:1} ${s1:0:1}${s2:0:1}"
row2="${h1:1:1}${h2:1:1} ${m1:1:1}${m2:1:1} ${s1:1:1}${s2:1:1}"
row3="${h1:2:1}${h2:2:1} ${m1:2:1}${m2:2:1} ${s1:2:1}${s2:2:1}"
row4=" ${h2:3:1}  ${m2:3:1}  ${s2:3:1}"

# For horizontal polybar display (single line)
echo "$row1 $row2 $row3 $row4"
