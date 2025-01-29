This is a image backgorund remover server build on Node.js.
The abailable path for request and there responds including success and error.

1. /removeBg
  the path requirements a valid image or a valid image URL.

  response
   success res : 
    1. resType = JSON, statusCode = 200, resObj = { "img": "a valid html img tag with data url" }.
   error res : 
    2. resType = JSON, statusCode = 400, resObj = { "title": "This is not image or image url", "msg": "Its look like this is not a image file or not a valid image URL. Please check and try again lager."}.
   error res : 
    3. resType = JSON, statusCode = 500, resObj = { "title": "Unknow server side error", "msg": "Its look like server side error please try again."}.



Commands for Run the server
  staging mode = node run dev.
  production mode = node start.