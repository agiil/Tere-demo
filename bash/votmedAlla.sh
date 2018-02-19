# Laeb Heroku keskkonnamuutujad pilvest lokaalsesse
# .env faili
# NB! Fail enne tühjaks teha

heroku config:get SIGNKEY -s  >> .env
heroku config:get DECRYPTKEY -s  >> .env
