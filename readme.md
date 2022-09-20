# install deno 
https://deno.land/

# start/run in background webserver 
## install pm2 
```
sudo apt install pm2
```
## start webserver 
### create a file `webserver.js` and import the module
```javascript
import {O_webserver} from "https://deno.land/x/O_webserver@0.1/O_webserver.module.js"

var o_webserver = new O_webserver();

await o_webserver.f_serve_all();

```

### create a folder `mkdir localhost`
and create a testfile 
```
mkdir localhost
echo "test hurray" > ./localhost/test.txt
```
### start the webserver in background
```
pm2 start webserver.js --interpreter="deno" --interpreter-args="run --allow-net" 
```

### visit the page 
```
https://localhost/test.txt
```