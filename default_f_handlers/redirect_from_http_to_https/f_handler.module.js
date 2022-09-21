
var f_handler = async function(
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

export {f_handler}