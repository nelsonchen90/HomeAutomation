# HomeAutomation
A Home automation sever running on [Raspberry Pi 3B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) with Raspberry Pi OS Lite

## Documentation
- installation: `npm i`
- dev: `npm run dev`
- run the server: `npm start`

### USB port power
 - preqeq: install and setup (permission) uhubctl https://github.com/mvp/uhubctl
 - symlink the uhubctl to `/usr/local/bin` so the child_process can access
   ```
   ln -s /usr/sbin/uhubctl /usr/local/bin/uhubctl
   ```
 - create service so can boot with OS https://stackoverflow.com/a/29042953
 
 #### REST API:
 - status: GET `{hostname}:3000/usbSwitch/status`
 - turn on/off: GET `{hostname}:3000/usbSwitch/on` / GET `{hostname}:3000/usbSwitch/off`
 #### UI:
 - http://{hostname}:3002/static
