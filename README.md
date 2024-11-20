# PZEM-016forRTI

JS code devlopment for rti xp processor driver with id 9.21
while modbus is a known working solution it is too generic. The current free druiver avaible does not allow for more than one device to be on the rs485 bus and does not allow the sending of custom strings meaning 
the inbuilt energy meter of the pzem-016 can't be reset. The thought is polling with the correct hex strings and parseInt base 16 on 2 bytes will yield exactly the same integers. I'll start with 1 device with the default slave id of 1
and go from there
