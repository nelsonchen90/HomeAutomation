# HomeAutomation
A Home automation sever running on Raspberry Pi 3 B

## Documentation
- installation: `npm i`
- dev: `npm run dev`
- run the server: `npm start`

### USB port power
 - preqeq: install and setup (permission) uhubctl https://github.com/mvp/uhubctl
 - status: GET `{hostname}:3000/usbSwitch/status`
 - turn on/off: GET `{hostname}:3000/usbSwitch/on` / GET `{hostname}:3000/usbSwitch/off`
 
