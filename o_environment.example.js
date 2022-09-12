var o_config = {
    s_default_name: "deno_webserver",
    s_default_folder_name: ".${s_default_name}",
    o_default_domain_o_config: {
        s_default_file: "client.html",
    },
    n_port: 8080,
    // s_host_name: "2606:4700:4700::1111"//one.one.one.one
    s_host_name: "[::1]", // ip6-localhost, 
    s_path_certificate_file : "/path/to/certFile.crt", // 
    s_path_key_file : "/path/to/keyFile.key",
}

import {f_evaluate_object} from "https://deno.land/x/f_evaluate_object@0.1/f_evaluate_object.module.js"

await f_evaluate_object(o_config,o_config)

console.log(o_config)
export {o_config}