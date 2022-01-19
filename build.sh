#!/bin/bash

# Build frontend
build_frontend()
{
  cd webui
  npm run build
  cd ..
}

# Build backend
build_backend()
{
  go build -o bin
}

main()
{
  if [[ $1 == 'frontend' ]]; then
    build_frontend
  elif [[ $1 == 'backend' ]]; then
    build_backend
  else
    build_frontend
    build_backend
  fi
}

main "$@"; exit
