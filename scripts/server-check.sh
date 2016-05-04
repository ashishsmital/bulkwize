#!/bin/bash
ADMIN="devarajs.cbe@gmail.com,ashishsmital@gmail.com"
output=`ps -ef | grep index.js | grep -v grep`
set -- $output
pid=$2
echo $output
if [[ $pid == "" ]]; then
        echo NODE DOWN
        (echo Subject: "Bulkwize server is Restarted"; echo "Bulkwize server is restart on hostname $(hostname) as on $(date)";) | /usr/sbin/sendmail  $ADMIN> /dev/null
        `node /usr/bulkwize-code/bulkwize/Bulkwise/index.js > /dev/null &`
fi