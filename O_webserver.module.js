

import { O_folder_file }  from "https://deno.land/x/o_folder_file@0.3/O_folder_file.module.js"

import { serve, serveTls } from "https://deno.land/std@0.154.0/http/server.ts";

import { O_json_db } from "https://deno.land/x/o_json_db@1.4/O_json_db.module.js";

var o_folder_file = new O_folder_file(import.meta.url.split("//").pop())

class O_webserver{
  constructor(){
    console.log(import.meta)
  this.o_json_db = new O_json_db()
   this.import_meta_url = import.meta.url, 
   this.o_folder_file = o_folder_file,
   this.s_path_name_folder_name_root = o_folder_file.s_folder_name, 
   this.s_directory_seperator  = "/"
    var o_self = this
    this.b_init = false
  }

  async f_o_config(){
        
    var a_s_part = import.meta.url.split("/");
    var s_file_name = a_s_part.pop()
    var a_s_part_filename = s_file_name.split('.')
    a_s_part_filename[0] = a_s_part_filename[0].toLowerCase()+"_config"
    var s_file_name_config = a_s_part_filename.join(".")
    this.s_path_o_config = "./"+s_file_name_config
    a_s_part.push(this.s_path_o_config)
    var s_url = a_s_part.join("/")

    try{
        var o_stat = await Deno.stat(this.s_path_o_config)
    }catch{
        
        // console.log(`${this.s_path_o_config} file does not exists, please download it with this command:`)
        // console.log(`wget ${self.s_url_o_config}`)
        // Deno.exit(1)
        // s_url = "https://deno.land/x/o_json_db@1.2/./o_json_db_config.module.js" //tmp for testing
        var o_response = await fetch(s_url)
        var s_text = await o_response.text();
        console.log(`${s_url} :file did not exists yet, and was downloaded automaitcally`)
        await Deno.writeTextFile(this.s_path_o_config, s_text);
    }
    
    var {o_webserver_config} = await import(this.s_path_o_config)
    return Promise.resolve(o_webserver_config)

}
  async f_init(){
    var self = this;
    if(!this.b_init){
      self.o_config = await this.f_o_config();
      this.b_init = true;

      if(this.o_config.o_not_encrypted.n_port < 1024 || this.o_config.o_encrypted.n_port < 1024){
        console.log("ports under 1024 needs root/superuser privileges")
      }
    }
    return Promise.resolve(true)
  }


  async f_check_if_ssl_exists(){
    var o_self = this;

    try{
      const o_stat_certificate_file = await Deno.stat(o_self.o_config.o_ssl.s_path_certificate_file)
      const o_stat_key_file = await Deno.stat(o_self.o_config.o_ssl.s_path_key_file)

    }catch{
    // if(!o_stat_certificate_file.isFile || !o_stat_key_file.isFile){ //assuming the files or folders can be overwritten
      
    if(o_self.o_config.o_ssl.b_auto_generate){

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
      if(o_self.o_config.o_not_encrypted.n_port < 1024 || o_self.o_config.o_encrypted.n_port < 1024){
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

  async f_serveTls(){
    var o_self = this
    // check if ssl cert exists 
    await o_self.f_check_if_ssl_exists();

    await this.f_init();
    var {f_handler} = await import("./f_handler.module.js");

    // var self = this;
    serveTls(
      async function(
        o_request, 
        o_connection_info
      ){ 
        return f_handler(
          o_request,
          o_connection_info, 
          o_self
          )
      },
      { 
        certFile: o_self.o_config.o_ssl.s_path_certificate_file,
        keyFile: o_self.o_config.o_ssl.s_path_key_file,
        port: o_self.o_config.o_encrypted.n_port,
        hostname: o_self.o_config.o_encrypted.s_host,
      }
      );
      return Promise.resolve(true)

  }
  async f_serve(){
    var o_self = this;
    await this.f_init();
    var {f_handler} = await import("./default_f_handlers/redirect_from_http_to_https/f_handler.module.js")
    serve(
      async function(o_request, o_connection_info){
        return f_handler(
          o_request, 
          o_connection_info, 
          o_self
        )
      },
      { 
        port:parseInt(o_self.o_config.o_not_encrypted.n_port),
        hostname: o_self.o_config.o_not_encrypted.s_host,
      }
    )
    return Promise.resolve(true)

  }
  
  async f_serve_all(){
    var o_self = this

    await this.f_init();
    await this.f_serve()
    await this.f_serveTls()
    console.log(`HTTP webserver running. Access it at: ${o_self.o_config.o_not_encrypted.s_url}:${o_self.o_config.o_not_encrypted.n_port}/`);
    console.log(`HTTPS webserver running. Access it at: ${o_self.o_config.o_encrypted.s_url}:${o_self.o_config.o_encrypted.n_port}/`);
  }

 
}


export {O_webserver}