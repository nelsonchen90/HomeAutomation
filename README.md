# HomeAutomation
A Home automation sever running on [Raspberry Pi 3B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) with Raspberry Pi OS Lite

## Documentation
  ### Installation/dev
  - installation: `npm i`
  - dev: `npm run dev`
  - start server: `npm run start`

  ### USB port power
   - preqeq: Install and setup (permission) uhubctl https://github.com/mvp/uhubctl
   - symlink the uhubctl to `/usr/local/bin` so the child_process can access
     ```
     ln -s /usr/sbin/uhubctl /usr/local/bin/uhubctl
     ```
   - create service so can boot with OS https://stackoverflow.com/a/29042953
 
     #### REST API:
       - status: GET `{hostname}/usbSwitch/status`
       - turn on/off: GET `{hostname}/usbSwitch/on` / GET `{hostname}/usbSwitch/off`
     #### UI:
       - http://{hostname}
         - dev: https://localhost:3001
         - in production mode, there will be 2 ports being listened. 80 for http redirect and 443 for https
         - using [Certbot](https://certbot.eff.org/lets-encrypt/debianbuster-webproduct) to generate certificates, need to renew periodically
         - check my running site here: [homeautomationbox.com](homeautomationbox.com)
     #### Alexa:
      - Deployed as a privite skill on Alexa under name: Decor light. access skill [here](https://developer.amazon.com/alexa/console/ask/build/custom/amzn1.ask.skill.43954e4b-5ee6-4604-9816-3658163d2b99/development/en_US/dashboard)
      
