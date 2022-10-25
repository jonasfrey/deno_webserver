

import {
    O_json_db
} from "https://deno.land/x/o_json_db@4.0/O_json_db.module.js";

import {O_url} from "https://deno.land/x/o_url@0.4/O_url.module.js"

import { f_a_o_url_stack_trace } from "./f_a_o_url_stack_trace.module.js";

import {o_http_request_handler_file_explorer } from "./a_o_http_request_handler.module.js"

import {o_http_request_handler_redirect_http_to_https} from "./a_o_http_request_handler.module.js"

import {o_http_request_handler_default} from "./a_o_http_request_handler.module.js"

class O_webserver {
    constructor(
        s_path_o_webserver_root
    ) {
        console.warn(`if you use self-signed ssl certificates, you may need to start deno like so: 'deno run  --unsafely-ignore-certificate-errors myscript.js'`)
        this.s_path_o_webserver_root = s_path_o_webserver_root
        this.o_json_db = new O_json_db()
        this.a_o_url_stack_trace = f_a_o_url_stack_trace();
        this.o_url_import_meta_url = new O_url(import.meta.url);
        this.s_file_name = import.meta.url.split("/").pop();
        this.s_directory_seperator = "/"
        var o_self = this
        this.b_init = false
        if(s_path_o_webserver_root == undefined || s_path_o_webserver_root == null){
            console.error(
                `
                ${this.s_file_name}: needs to know the path of the root folder !, please pass this string as the first argument like this: 

                //windows
                var s_folder_separator = "\\"
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
                `
            )
            Deno.exit(1)
        }
    }

    async f_download_ifnotexisting_remote_module_and_import(s_path_relative){

        // /home/root/tst.js            -> s_pathfile
        // /home/root/                  -> s_pathfolder
        // file:///home/root/tst.js     -> s_urlpathfile
        // file:///home/root/           -> s_urlpathfolder

        var o_url_first_js_file = this.a_o_url_stack_trace.slice(-1)[0];
        var s_import_meta_url_path_folder_name = import.meta.url.split("/").slice(0,-1).join("/"); 
        var s_urlpathfile_remote = s_import_meta_url_path_folder_name + "/" + s_path_relative;
        var s_urlpathfile_local = o_url_first_js_file.o_URL.href.split("/").slice(0,-1).join("/") + "/" + s_path_relative;
        var s_pathfile_local = o_url_first_js_file.o_URL.href.split("file://").slice(1)[0].split("/").slice(0,-1).join("/") +"/"+ s_path_relative;
        try{
            var o_stat = await Deno.stat(s_pathfile_local);
        }catch{
            var o_response = await fetch(s_urlpathfile_remote)
            var s_text = await o_response.text();
            console.log(`${s_urlpathfile_remote} :file did not exists yet, and was downloaded automaitcally`)
            await Deno.writeTextFile(s_pathfile_local, s_text);
        }
        // see https://github.com/denoland/deno/issues/15984#issuecomment-1254379796
        // import(file:///home/root/tst.js) //will work 
        // import(/home/root/tst.js)        //wont work 
        var o_module = await import(s_urlpathfile_local);
        return Promise.resolve(o_module);
    }
    async f_o_config(){
        var s_file_name = this.o_url_import_meta_url.o_folder_file.s_file_name.toLowerCase().split(".").map((s,n_i)=>(n_i==0) ? s+"_config": s).join(".");
        return this.f_download_ifnotexisting_remote_module_and_import("./"+s_file_name)
    }

    async f_init() {
        var self = this;
        if (!this.b_init) {
            self.o_config = (await this.f_o_config()).o_webserver_config;
            this.b_init = true;

            if (this.o_config.o_not_encrypted.n_port < 1024 || this.o_config.o_encrypted.n_port < 1024) {
                console.log("ports under 1024 needs root/superuser privileges")
            }
        }
        return Promise.resolve(true)
    }


    async f_check_if_ssl_exists() {
        var o_self = this;

        try {
            const o_stat_certificate_file = await Deno.stat(o_self.o_config.o_ssl.s_path_certificate_file)
            const o_stat_key_file = await Deno.stat(o_self.o_config.o_ssl.s_path_key_file)

        } catch {
            // if(!o_stat_certificate_file.isFile || !o_stat_key_file.isFile){ //assuming the files or folders can be overwritten

            if (o_self.o_config.o_ssl.b_auto_generate) {

                var a_s_command = [
                    'openssl req -newkey rsa:4096',
                    '-x509',
                    '-sha256',
                    '-days 3650',
                    '-nodes',
                    '-subj',
                    `"/C=${o_self.o_config.o_ssl.o_auto_generate.s_country_name_2_letter_code}/ST=${o_self.o_config.o_ssl.o_auto_generate.s_state_or_province}/L=${o_self.o_config.o_ssl.o_auto_generate.s_locality_name}/O=${o_self.o_config.o_ssl.o_auto_generate.s_organization_name}/CN=${o_self.o_config.o_ssl.o_auto_generate.s_common_name}"`,
                    `-out ${o_self.o_config.o_ssl.s_path_certificate_file}`,
                    `-keyout ${o_self.o_config.o_ssl.s_path_key_file}`
                ] // this works only with the weird string shit
                // wtf without the lines below it wont work
                var s_command = a_s_command.join(' ').slice();
                var a_s_command = s_command.split(' ');
                console.log("canno serveTls because no valid ssl certificate configured")
                console.log(`run this command to generate the certificates:`)
                console.log(`${a_s_command.join(' ')}`)
                Deno.exit()
                if (o_self.o_config.o_not_encrypted.n_port < 1024 || o_self.o_config.o_encrypted.n_port < 1024) {
                    console.log("ports under 1024 needs root/superuser privileges")
                }
                // const o_process = Deno.run(
                //     {
                //         cmd:a_s_command,
                //         stdout: "piped",
                //         stderr: "piped",
                //     }
                // )
                // // console.log(await o_process.status());
                // const { n_code } = await o_process.status();

                // const raw_output = await o_process.output();
                // const raw_error_output = await o_process.stderrOutput();
                // await o_process.close()

                // console.log(raw_output)

            }


        }
    }

    async f_serveTls() {
        var o_self = this
        // check if ssl cert exists 
        await o_self.f_check_if_ssl_exists();

        await this.f_init();

        // var self = this;
        var o_server_https = Deno.listenTls(
            {
                certFile: o_self.o_config.o_ssl.s_path_certificate_file,
                keyFile: o_self.o_config.o_ssl.s_path_key_file,
                port: o_self.o_config.o_encrypted.n_port,
                hostname: o_self.o_config.o_encrypted.s_host,
            }
        );
        
        // Connections to the server will be yielded up as an async iterable.
        for await (const o_connection of o_server_https) {
            // In order to not be blocking, we need to handle each connection individually
            // without awaiting the function
            o_self.f_serve_http(o_connection);
        }

    }

    async f_serve() {
        var o_self = this;
        await this.f_init();
        var o_server = Deno.listen(
            {
                port: parseInt(o_self.o_config.o_not_encrypted.n_port),
                hostname: o_self.o_config.o_not_encrypted.s_host,
            }
        )

        // Connections to the server will be yielded up as an async iterable.
        for await (const o_connection of o_server) {
            // In order to not be blocking, we need to handle each connection individually
            // without awaiting the function
            o_self.f_serve_http(o_connection);
        }

    }

    async f_handle_connections_and_serve_http2(o_server,o_http_request_handler){
        var o_self = this
        for await (const o_connection of o_server) {
            (async () => {
              const o_http_connection = Deno.serveHttp(o_connection);
              for await (const o_request_event of o_http_connection) {
                return await o_http_request_handler.f_http_request_handler(
                    o_http_connection, 
                    o_request_event,
                    o_self
                )
                // ... handle requestEvent ...
              }
            })();
          }
    }
    async f_handle_connections_and_serve_http(o_server){
        var o_self = this;

        while (true) {
            try {
              const o_connection = await o_server.accept();
              console.log(`${o_connection}: new connection`);
              // ... handle the o_connectionection ...
            //   console.log(o_connection)
                const o_http_connection = Deno.serveHttp(o_connection);
                console.log(`${o_http_connection}: new httpconnection`);

                while (true) {

                  try { 
                    const o_request_event = await o_http_connection.nextRequest();
                    console.log(`${o_request_event}: new request event`);

                    // ... handle o_request_event ...
                    // console.log(`${this.s_file_name}: o_request_event: ${o_request_event}`)
                    await o_http_request_handler_default.f_http_request_handler(
                        o_http_connection, 
                        o_request_event,
                        o_self
                    )

                    // await o_request_event.respondWith(
                    //     new Response("hello world", {
                    //       status: 200,
                    //     }),
                    //   );

                  } catch (err) {
                    console.log(`${this.s_file_name}: connection has finished or error: ${err}`)
                    console.log(`${err.stack}`)
                    // the connection has finished
                    break;
                  }
                }

            } catch (err) {
                console.log(`${this.s_file_name}: listener has closed: or error: ${err}`)
                console.log(`${err.stack}`)

              // The listener has closed
              break;
            }
          }
    }

    async f_serve_http(o_connection) {
        var o_self = this
        // This "upgrades" a network connection into an HTTP connection.
        const o_http_connection = Deno.serveHttp(o_connection);
        // Each request sent over the HTTP connection will be yielded as an async
        // iterator from the HTTP connection.
        try{
          for await (const o_request_event of o_http_connection) {
            // The native HTTP server uses the web standard `Request` and `Response`
            // objects.
            try{
                o_http_request_handler_default.f_http_request_handler(
                    o_http_connection, 
                    o_request_event,
                    o_self
                )
            }catch(o_e){
              console.log("error")
              console.log(o_e)
            }
          }
      
        }catch(o_e){
          console.log("error with `for await (const requestEvent of httpConn) {`")
          console.log(o_e)
        }
      }


    async f_serve_all() {
        var o_self = this

        await this.f_init();
        this.f_serve()
        this.f_serveTls()

        console.log(`HTTP webserver running. Access it at: ${o_self.o_config.o_not_encrypted.s_url}`);
        console.log(`HTTPS webserver running. Access it at: ${o_self.o_config.o_encrypted.s_url}`);
    }


}


export {
    O_webserver
}