//
//
//
//

DriverName = "PZEM016";
System.Print("Initializing " + DriverName);

//
// Globals
//
var g_debug = Config.Get("DebugTrace") == "true";
var g_comm = new Serial(OnCommRx, parseInt(Config.Get("SerialPort"), 10), parseInt(Config.Get("BaudRate"), 10), 8, 1, "None", "None");
g_comm.SetTxInterMsgDelay(100);
// The heartbeat function is only used to determine if the device is connected or not. Quote from forum
g_comm.EnableHeartbeat(1000, SendHeartbeat, OnConnect, OnDisconnect); // this creates a reaction to a lack of unsolicited feedback from the device, not linked to the timer created for polling.
//g_comm.AddRxFraming("FixedLength", 24);
//g_comm.AddRxFraming("StopChar", '\r');
//g_comm.AddRxFraming("StartStopChar", '#', '\n');
var e_Poll = Config.Get("EPollinID") == "true";
var pollRate = (Config.Get("PRate")*1000);
//
// Startup code
//
SystemVars.Write("connection", false);

System.OnShutdownFunc = OnShutdown;

function OnShutdown()
{
	System.Print(DriverName + ": OnShutdown\r\n");
}


function SendHeartbeat(){
	
	
}
function OnConnect(){
	
	System.Print(DriverName+" OnConnect");
	SystemVars.Write("connection", true);
	SystemVars.Write("noconnection", false);
	System.SignalEvent("connected");
	}

function OnDisconnect(){

	SystemVars.Write("connection", false);
	System.Print(DriverName + " OnDisconnect");
	SystemVars.Write("noconnection", true);
	System.SignalEvent("notconnected");
	}

//  Polling Event

var pollingTimer = new Timer();

	//PollEvent.Enabled();
		if (e_PollinID == true)
		{
		pollingTimer.Start(PollEvent, pollRate);
		}
		else
		{
		pollingTimer.Stop();
		}
		
function PollEvent() // outbound status check
	{
	pollingTimer.Start(PollEvent, pollRate);
		SystemVars.Write("TimeOfLastCheck", (System.GetLocalTime()));
		g_comm.Write("\x01\x04\x00\x00\x00\x0A\x70\x0D"); //read 10 input registers starting at address 30001
// 01 04 00 00 00 0A 70 0D copied from cas modbus scanner
	}

function OnCommRx(data)
{
    
  if (data.length == 36)
  {
datastringmain = data.slice(9,36)
    
  }   
  //buffer = buffer.concat(data);

    //if (buffer.length > 2)
    //{
        //if (buffer.charCodeAt(0) == 0x33)
        //{
            //var length = buffer.charCodeAt(1);

           // if (buffer.length >= (length + 1))
            //{
           //     length += 1;
               
                // get the complete message
         //       var msg = buffer.substr(0, length);

                // remove the message from the buffer;
       //         buffer = buffer.substr(length);
               
                // hold integer value!
     //           var int = combineBytes(msg.substr(8, 2));
   //         }
 //       }
//    }

//	System.Print("Integer from combined bytes is " + (int))

//{																		
  // System.Print("Serial: OnCommRX() data = (" + hexString(data) + ")"); //copied from rti paul search oncomm hex
   
//}


//function hexString(str) {				// copied from rti paul forum search oncomm hex
  //strData = '';
  //for (var j = 0; j < str.length; j+=1) {
    //strData += str.charCodeAt(j).toString(16) + ":";
  //}

  // lose that last colon
  //return (strData.substr(0, strData.length - 1));
//}
//{
	SystemVars.Write("RXdata", data);
	SystemVars.Write("TimeOfLastConfirmedAction", (System.GetLocalTime()));//

//if (g_debug)
//{

//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(0).toString(16)); //from Tcoupe forum message 
//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(1).toString(16));
//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(2).toString(16));
//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(3).toString(16));
//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(4).toString(16));
//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(5).toString(16));
//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(6).toString(16));
//	System.Print("Serial: OnCommRx data; first data character we received is 0x"+data.charCodeAt(7).toString(16));

	// to show how to see hex in traceviewer{
	//PrintBytes("data", data);  // viewable in traceviewer - jeff mackie
	//25.1.23 - After viewing in traceviewer it displays as ascii not hex, but the polling does appear to work. Might be a good idea to find a way to function call ( at runtime
	// the timestamp and connected variable
	
	if (data == "\x33\x3C\x00\x00\x00\x01\x01\x71") {  //relay 1 is on
		g_comm.HeartbeatReceived();
		SystemVars.Write("relay1integer",1);
	    SystemVars.Write("relay1ONboolean",true);
	    SystemVars.Write("relay1OFFboolean",false);
	    System.SignalEvent("relay1ONevent");	
		}

	
}
	
	
