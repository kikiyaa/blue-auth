#!/bin/bash
if [ $# -ne 3 ] ;then
   echo "Please check the args"
   exit 0
fi

USER_ID=$1
USER_UID=$2
USER_GID=$3
IMAGE_NAME="jwpark\/r-server\:03R01"

kubectl create ns $1
sed -e 's/$IMAGE_NAME/'$IMAGE_NAME'/g;s/$USER_ID/'$USER_ID'/g;s/$USER_UID/'$USER_UID'/g;s/$USER_GID/'$USER_GID'/g' ./kube_script/rstudio.yaml | kubectl create -n $1 -f -