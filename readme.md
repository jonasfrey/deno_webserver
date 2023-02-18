# install deno 
https://deno.land/

# start  

## create a file `webserver.js` and import the module
```javascript
import {O_webserver} from "https://deno.land/x/o_webserver@[n_version]/O_webserver.module.js"


//windows
// var s_folder_separator = "\"
//linux
var s_folder_separator = "/"

var s_path_o_webserver_root = import.meta.url
        .split("file://")
        .pop()
        .split(s_folder_separator)
        .slice(0,-1)
        .join(s_folder_separator)

var o_webserver = new O_webserver(
    s_path_o_webserver_root
);

o_webserver.f_serve_all();

```
## create a folder `mkdir localhost`
and create a testfile for the domain name localhost
```
mkdir localhost
```
create the default behaviour of a file explorer
```
wget https://deno.land/x/o_webserver@[n_version]/f_http_request_handler.module.js.example > ./localhost/f_http_request_handler.module.js"
```
create a testfile wich acts as testcontent
```
echo "server running" > ./localhost/test.txt 
```
### visit the page 
```
https://localhost/test.txt
```
### start the webserver in background
####  install pm2 
```
sudo apt install pm2
```
#### start in background
```
pm2 start webserver.js --interpreter="deno" --interpreter-args="run --allow-net" 
```

#### show running 
```
pm2 status
```
...
thats it