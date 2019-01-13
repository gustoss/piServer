#!/bin/bash 

instApplication() {
  echo "Install application."
  sudo apt install -y avahi-daemon avahi-discover libnss-mdns libavahi-compat-libdnssd-dev
  npm install
}

showHelp() {
  echo "Usage: ./init.sh [OPTION]..."
  echo "Controler application of piServer, help when it is in RaspBerry PI"
  echo
  echo -e "  -i, --install\t\tInitialize the application"
  echo -e "  -r, --run\t\tRun server application"
  echo -e "  -rk, --rkill\t\tKill Avahi application and after kill run server application"
  echo -e "  -t, --test\t\tCreate files to test"
  echo -e "  \t\t\t\tcdb to create"
}

test() {
  for item in $(echo "$1" | sed 's/,/\n/g'); do
    case $item in
      cdb ) for i in $(cat config.json | grep '/database/.*\.db' | sed 's/.*"\//\//' | sed 's/",*//g'); do
              echo > .$i
            done
      ;;
      rdb ) for i in $(cat config.json | grep '/database/.*\.db' | sed 's/.*"\//\//' | sed 's/",*//g'); do
              if [ -f ".$i" ]; then
                rm .$i
              fi
            done
      ;;
      * ) echo "Option $item of test not found!"
          echo
          showHelp
          exit 0
      ;;
    esac
  done
}

run=false
rkill=false

if [ "$1" == "" ]; then
  run=true
fi

while [ "$1" != "" ]; do
  case $1 in
    -i | --install ) instApplication
                      exit 0
    ;;
    -h | --help ) showHelp
                  exit 0
    ;;
    -r | --run ) run=true
    ;;
    -rk | --rkill ) run=true
                    rkill=true
    ;;
    -t | --test ) shift
                  test $1
    ;;
    * ) echo "Option $1 not found!"
        echo
        showHelp
        exit 0
    ;;
  esac
  shift
done

if [ $run == true ]; then
  if [ $rkill == true ]; then
    sudo kill $(ps -A | grep 'avahi' | awk '{print $1}')
  fi
  node index.js
fi
