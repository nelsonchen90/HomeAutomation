# HomeAutomation
A Home automation sever running on [Raspberry Pi 3B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) with Raspberry Pi OS Lite

## Documentation
  ### Installation/dev
  - installation: `npm i`
  - dev: `npm run dev`
  - start server: `npm run start`
  - create service so can boot with OS https://stackoverflow.com/a/29042953
  - dev UI: http://localhost:3000

  ### USB port power
  - preqeq: Install and setup (permission) uhubctl https://github.com/mvp/uhubctl
  - symlink the uhubctl to `/usr/local/bin` so the child_process can access
    ```
    ln -s /usr/sbin/uhubctl /usr/local/bin/uhubctl
    ```

    #### REST API:
    - status: GET `{hostname}/api/v1/usbSwitch/status`
    - turn on/off: GET `{hostname}/api/v1/usbSwitch/on` / GET `{hostname}/api/v1/usbSwitch/off`
  ### Wake on lan (WOL):
  - prereq: WOL with magic packet must be enabled on the device prior using this feature. For Windows check [here](https://www.groovypost.com/howto/enable-wake-on-lan-windows-10/)
     
    #### REST API:
    - trigger on: POST `{hostname}/api/v1/windowsSwitch/toggle`
      
      ```
      // body optional. it will override the one defined in env variable when provided 
      {
        "targetMacAddress": "1A:2B:3C:4D:5E:6F"
      }
      ```

## Interaction
### UI:
  - http://{hostname}
    - in production mode, there will be 2 ports being listened. 80 for http redirect and 443 for https
    - using [Certbot](https://certbot.eff.org/lets-encrypt/debianbuster-webproduct) to generate certificates, need to renew periodically
    - check my running site here: [homeautomationbox.com](homeautomationbox.com)
### Alexa:
- [What is Alexa?](https://developer.amazon.com/en-US/alexa)
- Deployed as a privite skill on Alexa under name: Decor light. Access skill [here](https://developer.amazon.com/alexa/console/ask/build/custom/amzn1.ask.skill.43954e4b-5ee6-4604-9816-3658163d2b99/development/en_US/dashboard)
  - utterances:
    - turn on/off decor light
    - decor light on/off
    - decor light switch
    - help
    - what is this
    - what does this do
    - ...
