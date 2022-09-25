
import {O_folder_file} from "https://deno.land/x/o_folder_file@0.3/O_folder_file.module.js"

class O_http_request_handler{
    constructor(
        s_name,
        f_http_request_handler
    ){
        this.s_name = s_name
        this.f_http_request_handler = f_http_request_handler
    }
}

var o_http_request_handler_file_explorer = 
new O_http_request_handler(
    "file_explorer", 
    async function(
        o_http_request,
        o_connection_info, 
        o_webserver
        ){

                var o_URL = new URL(o_http_request.url)

                var s_pathname_to_folder_or_file = 
                "." + 
                "/"+
                o_webserver.o_url.s_domainname +
                decodeURI(
                    o_webserver.o_url.s_path
                )
                try{
                    var o_stat = await Deno.stat(s_pathname_to_folder_or_file);
                    // console.log(o_stat)
                }catch{
                    // file or folder does not exist
                    return Promise.resolve(
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
                        return Promise.resolve(new Response(
                            "moved",
                            { 
                                status: 301,  
                                headers: {
                                    "location": o_URL.href.replace(o_URL.pathname, o_URL.pathname+"/"),
                                },
                            }
                        ))
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
                    return Promise.resolve(
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
                            return Promise.resolve(
                                
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
        o_request, 
        o_connection_info, 
        o_webserver, 
        s_url = "https://deno.land"
    ){
        var s_response = await fetch(s_url+o_webserver.o_url.s_path);
        return Promise.resolve(
            new Response(s_response.body)
        )
    }
    
)



var o_http_request_handler_redirect_http_to_https = 
new O_http_request_handler(
    "redirect_http_to_https", 
    async function(
        o_request, 
        o_connection_info, 
        o_webserver
    ){
        var s_url_new = o_request.url.replace("http", "https");
        s_url_new = s_url_new.replace(":"+o_webserver.o_config.o_not_encrypted.n_port, ":"+o_webserver.o_config.o_encrypted.n_port)
        return Promise.resolve(new Response(
            "moved",
            { 
                status: 301,  
                headers: {
                    "location": s_url_new,
                },
            }
        ))

    }
)

var a_o_http_request_handler = [
    o_http_request_handler_file_explorer, 
    o_http_request_handler_get_proxy, 
    o_http_request_handler_redirect_http_to_https, 
]

export {
    a_o_http_request_handler, 
    o_http_request_handler_file_explorer,
    o_http_request_handler_get_proxy,
    o_http_request_handler_redirect_http_to_https,
}