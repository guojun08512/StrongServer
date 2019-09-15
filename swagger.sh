docker pull swaggerapi/swagger-editor
docker run -p 80:8080 swaggerapi/swagger-editor


docker pull swaggerapi/swagger-ui
docker run -p 80:8080 swaggerapi/swagger-ui


docker run -p 80:8080 -e SWAGGER_JSON=/foo/swagger.json -v /bar:/foo swaggerapi/swagger-ui


userInfo=(`curl -X POST \
  http://47.105.67.223:8888/v1/users/login \
  -H 'Accept: application/json' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "admin",
    "password": "123456"
}'`)

    -e "OAUTH_CLIENT_ID=${userInfo.}" -e "OAUTH_CLIENT_SECRET=${client_secret}" \

docker run -d --restart=always --name swagger_ui -p 8088:8080 -v /Users/guojun/Downloads/webserver/nodeServer/swagger/:/apidocs \
    -e "SWAGGER_JSON=/apidocs/swagger.yaml" -e "DEFAULT_MODELS_EXPAND_DEPTH=5" -e "DEFAULT_MODEL_EXPAND_DEPTH=1" \
    -e "OAUTH_AUTHORIZATIONURL=http://47.105.67.223:8888/v1/users/login" \
    -e "OAUTH_TOKENURL=http://47.105.67.223:8888/v1/users/login" \
    swaggerapi/swagger-ui
