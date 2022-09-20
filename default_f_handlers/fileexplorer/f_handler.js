import {O_folder_file} from "https://deno.land/x/o_folder_file@0.3/O_folder_file.module.js"


var f_handler = async function(
    o_http_request,
    o_connection_info, 
    o_webserver
    ){
    return new Promise(
        async function(
            f_resolve, 
            f_reject
        ){
            var s_pathname_to_folder_or_file = 
            o_webserver.s_path_name_folder_name_domainorip_root + 
            decodeURI(
                o_webserver.o_url_request.s_path
            )
            // console.log(s_pathname_to_folder_or_file)
            try{
                var o_stat = await Deno.stat(s_pathname_to_folder_or_file);
                // console.log(o_stat)
                if(!o_stat.isFile){
                    var s = `<a href='..'>/..</a><br>`
                    var o_symbol = await Deno.readDir(s_pathname_to_folder_or_file);
                    for await( var o of o_symbol){
                        var s_path_name_relative = o.name
                        if(!o.isFile){
                            var s_path_name_relative = o.name + ((o.name.indexOf('/') == (o.name.length -1)) ? '': '/')
                        }
                        s+=`<a href='${s_path_name_relative}'>${s_path_name_relative}</a><br>`
                    }
                    return f_resolve(
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
                    
                    Deno.readFile(s_pathname_to_folder_or_file).then(
                        function(s_file_content){ // f_resolve
                            return f_resolve(
                                
                                new Response(
                                    s_file_content,
                                    { 
                                        status: 200, 
                                        headers: {
                                            "content-type": o_folder_file.o_mime_type_guessed_by_file_extension.s_mime_type,
                                        },
                                }
                                )
                                )
                                
                            }
                            )
                    
                }
            }catch{
                // file or folder does not exist
                return f_resolve(
                    new Response(
                        "not found",
                        { status: 404 }
                    )
                )
            }
        }
    )



}

export {f_handler}