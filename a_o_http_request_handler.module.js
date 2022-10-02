
import {O_folder_file} from "https://deno.land/x/o_folder_file@0.3/O_folder_file.module.js"
import {O_request} from "./O_request.module.js"
import { O_url } from "https://deno.land/x/o_url@0.4/O_url.module.js";

class O_http_request_handler{
    constructor(
        s_name,
        f_http_request_handler
    ){
        this.s_name = s_name
        this.f_http_request_handler = f_http_request_handler
    }
}

var o_http_request_handler_default = new O_http_request_handler(
    "default", 
    async function(
        o_http_connection, 
        o_request_event,
        o_webserver
    ){
        var o_URL = new URL(o_request_event.request.url);
        var o_request = new O_request(
            o_URL.hostname, 
            new Date().time, 
            o_request_event.request.url,
        )
        
        var o_url = new O_url(o_request_event.request.url)
        o_url.f_update_o_geolocation().then(
            function(){//f_resolve
                o_request.o_url = o_url
                // console.log(o_http_request)
                o_webserver.o_json_db.f_a_o_create(
                    O_request,
                    o_request
                )
            },
            function(){//f_reject
            }
        )

        var s_pathfile_handler_default = 
        o_webserver.s_path_o_webserver_root +
            `/${o_URL.hostname}/f_http_request_handler.module.js`


        try{
            var o_stat = await Deno.stat(s_pathfile_handler_default);
        }catch{
            console.log(`${s_pathfile_handler_default}: could not open file`)
        }


        if(o_stat){
            

            // var o_url_first_js_file = o_webserver.a_o_url_stack_trace.slice(-1)[0];
            // var s_pathfile_local_handler = o_url_first_js_file.o_URL.href.split("/").slice(0,-1).join("/") +"/"+ s_pathfile_handler_default;
            // var o_module = await import(s_pathfile_local_handler);
            var o_module = await import("file://"+s_pathfile_handler_default); // file:// is very important
            // console.log(o_module)
            // var a = o_module.f_http_request_handler(
            //     o_http_connection, 
            //     o_request_event,
            //     o_webserver
            // )
            return o_module.f_http_request_handler(
                o_http_connection, 
                o_request_event,
                o_webserver
            )
            // console.log(a)
            // return o_module.f_http_request_handler(
            //     o_http_connection, 
            //     o_request_event,
            //     o_webserver
            // )
        }else{
            return o_request_event.respondWith(
                new Response(
                    "f_http_request_handler.module.js not found",
                    { status: 404 }
                )
            )
            // console.log(`${s_path_handler_default}: is being used as default f_http_request_handler`);
            // var o_module = await import(s_path_handler_default)
        }

    }
)



var o_http_request_handler_file_explorer = 
new O_http_request_handler(
    "file_explorer", 
    async function(
        o_http_connection, 
        o_request_event,
        o_webserver
        ){

                var o_URL = new URL(o_request_event.request.url)

                var s_pathname_to_folder_or_file = 
                    o_webserver.s_path_o_webserver_root +
                    `/${o_URL.hostname}/`+
                    decodeURI(
                        o_URL.pathname
                    );
                console.log(s_pathname_to_folder_or_file)
                try{
                    var o_stat = await Deno.stat(s_pathname_to_folder_or_file);
                    // console.log(o_stat)
                }catch{
                    // file or folder does not exist
                    return o_request_event.respondWith(
                        new Response(
                            "not found",
                            { status: 404 }
                        )
                    )
                }
                if(!o_stat.isFile){
                    if(o_URL.pathname[o_URL.pathname.length-1] != "/"){
                        console.log(o_URL.href.replace(o_URL.pathname, o_URL.pathname+"/"))
                        // if is folder but last char in path is not a slash, redirect to location with trailing slash
                        return o_request_event.respondWith(
                            "moved",
                            { 
                                status: 301,  
                                headers: {
                                    "location": o_URL.href.replace(o_URL.pathname, o_URL.pathname+"/"),
                                },
                            }
                        )
                    }
                    // if(o_http_request.o_webserver.o_url)
                    var s = `<a href='..'>/..</a><br>`
                    var o_symbol = await Deno.readDir(s_pathname_to_folder_or_file);
                    for await( var o of o_symbol){
                        var s_path_name_relative = o.name
                        if(!o.isFile){
                            var s_path_name_relative = o.name + ((o.name.indexOf('/') == (o.name.length -1)) ? '': '/')
                        }
                        s+=`<a href='${s_path_name_relative}'>${s_path_name_relative}</a><br>`
                    }
                    return o_request_event.respondWith(
                        new Response(
                            s,
                            { 
                                status: 200,  
                                headers: {
                                    "content-type": "text/html",
                                },
                            }
                            )
                    )
                }
                if(o_stat.isFile){
                    var o_folder_file = new O_folder_file(s_pathname_to_folder_or_file)
                    // console.log(o_folder_file)
                    if(o_folder_file.o_mime_type_guessed_by_file_extension?.s_mime_type){
                        s_mime_type = o_folder_file.o_mime_type_guessed_by_file_extension.s_mime_type
                    }else{
                        var s_mime_type = "text/plain"
                    }
                    return Deno.readFile(s_pathname_to_folder_or_file).then(
                        function(s_file_content){ // f_resolve
                            return o_request_event.respondWith(
                                
                                new Response(
                                    s_file_content,
                                    { 
                                        status: 200, 
                                        headers: {
                                            "content-type": s_mime_type,
                                        },
                                }
                                )
                                )
                                
                            }
                        )
                    
                }
    
    
    
    
    }
    
)
var o_http_request_handler_get_proxy = 
new O_http_request_handler(
    "get_proxy", 
    async function(
        o_http_connection, 
        o_request_event,
        o_webserver,
        s_url = "https://deno.land"
    ){
        var o_URL = new URL(o_request_event.request.url)

        var s_response = await fetch(s_url+o_URL.pathname);
        return Promise.resolve(
            new Response(s_response.body)
        )
    }
    
)

var o_http_request_handler_redirect_http_to_https = 
new O_http_request_handler(
    "redirect_http_to_https", 
    async function(
        o_http_connection, 
        o_request_event,
        o_webserver
    ){
        
        // console.log(o_http_connection);
        console.log(o_request_event);
        // console.log(o_webserver);
        var s_url_new = o_request_event.request.url.replace("http", "https");
        s_url_new = s_url_new.replace(":"+o_webserver.o_config.o_not_encrypted.n_port, ":"+o_webserver.o_config.o_encrypted.n_port)
        // console.log(s_url_new)
        o_request_event.respondWith(
            new Response(
                "moved",
                { 
                    status: 301,  
                    headers: {
                        "location": s_url_new,
                    },
                }
            ),
        )

    }
)

var a_o_http_request_handler = [
    o_http_request_handler_default,
    o_http_request_handler_file_explorer, 
    o_http_request_handler_get_proxy, 
    o_http_request_handler_redirect_http_to_https, 
]

export {
    a_o_http_request_handler, 
    o_http_request_handler_default,
    o_http_request_handler_file_explorer,
    o_http_request_handler_get_proxy,
    o_http_request_handler_redirect_http_to_https,
}