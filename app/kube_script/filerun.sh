#!/bin/bash
if [ $# -ne 3 ] ;then
   echo "Please check the args"
   exit 0
fi

USER_ID=$1
USER_UID=$2
USER_GID=$3
USER_GROUP_ID="container"
#USER_UID=$(id -u $1)
#USER_GID=$(id -g $1)
#USER_GROUP_ID=$(id -g -n $1)

#sed -e 's/$USER_GROUP_ID/'$USER_GROUP_ID'/g;s/$USER_ID/'$USER_ID'/g;s/$USER_UID/'$USER_UID'/g;s/$USER_GID/'$USER_GID'/g' deploy.yaml
kubectl create ns $1
sed -e 's/$USER_GROUP_ID/'$USER_GROUP_ID'/g;s/$USER_ID/'$USER_ID'/g;s/$USER_UID/'$USER_UID'/g;s/$USER_GID/'$USER_GID'/g' ./kube_script/filerun.yaml | kubectl create -n $1 -f -
