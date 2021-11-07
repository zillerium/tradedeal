#!/bin/bash
input="fulllist"
while IFS= read -r line
do
  echo "$line"
  node readf1 $line
done < "$input"
