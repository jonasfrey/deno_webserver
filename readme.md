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

## config o_webserver_config.module.js
this file gets automatically downloaded with the first start of the webserver. if it and its properties are present the values will be used as config values

```javascript
var o_webserver_config = {
  o_default_domain_o_config: {
      s_default_file: "client.html", // in apache this would be index.html
  },
  o_not_encrypted:{        
      s_host: "::", // '::' = allow ipv4 and ipv6
      n_port: 8080,
      s_url: "http://localhost:${o_not_encrypted.n_port}/"
  },
  o_encrypted: {
      s_host: "::", // '::' = allow ipv4 and ipv6
      n_port: 8443,
      s_url: "https://localhost:${o_encrypted.n_port}/"
  },
  // s_host_name: "2606:4700:4700::1111"//one.one.one.one
  s_host_name: "[::1]", // ip6-localhost,
  o_ssl: {
      b_auto_generate: true,
      o_auto_generate:{
          b: true, 
          s_country_name_2_letter_code:'CH', 
          s_state_or_province:'Switzerland', 
          s_locality_name:'Bern', 
          s_organization_name:'MyCompany', 
          s_common_name:'MyCommonName', 
          s_email_address:'my.email@dom.com', 
      },
      s_path_certificate_file : "./self_signed_cert.crt", // 
      s_path_key_file : "./self_signed_key.key",
  }, 
  n_ms_delta_max_a_o_request: 10*24*60*60*1000, //older requests will be delted
}
```