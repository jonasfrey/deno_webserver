# install deno 
https://deno.land/

# start/run in background webserver 
## install pm2 
```
sudo apt install pm2
```
## start webserver 
```
pm2 start webserver.js --interpreter="deno" --interpreter-args="run --allow-net" 
```