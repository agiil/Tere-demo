# Lae privaatvõtmed Heroku keskkonnamuutujatesse
# 
# Käivitamine: ./bash/votmedYles.sh

heroku config:set SIGNKEY="$(cat salajane/sign.json)"
heroku config:set DECRYPTKEY="$(cat salajane/decrypt.json)"

echo Võtmed üles laetud:

heroku config
