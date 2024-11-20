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

function OnCommRx(data) // example returned string 01 04 14 09 59 02 04 00 00 03 85 00 00 12 29 00 00 01 F3 00 49 00 00 D3 EA (09 59 is 0x0959 = 2393 volts) 
{
    
if (data.length == 74)
  {
	  g_comm.HeartbeatReceived();
          datastringmain = data.slice(0,62)
          datastringvolts = (data.slice(9,11)) + (data.slice(12,14))
	  dataINTvolts = parseInt(datastringvolts,16)
	  	SystemVars.Write("volts10dp1",dataINTvolts);
	  datastringcurrent = (data.slice(15,17)) + (data.slice (18,20))
	  dataINTcurrent = parseInt(datastringcurrent,16)
	  	SystemVars.Write("current1000dp3",dataINTcurrent);
	  datastringwatts = (data.slice(27,29)) + (data.slice(30,32))
          dataINTwatts = parseInt(datastringwatts,16)
	  	SystemVars.Write("watts",dataINTwatts); 
	  datastringwatthrs = (data.slice(39,41)) + (data.slice(42,44))
	  dataINTwatthrs = parseInt(datastringwatthrs,16)
	  	SystemVars.Write("watthrs",dataINTwatthrs);
	  datastringfrequency = (data.slice(51,53)) + (data.slice(54,56))
	  dataINTfrequency = parseInt(datastringfrequency,16)
	  	SystemVars.Write
	  datastringpf = (data.slice(57,59)) + (data.slice(60,62))
	  dataINTpf = parseInt(datastringpf,16)
	  SystemVars.Write("TimeOfLastDataParse", (System.GetLocalTime()));
  }   else {

	  SystemVars.Write
  }
	SystemVars.Write("RXdata", data);
	SystemVars.Write("TimeOfLastConfirmedAction", (System.GetLocalTime()));//
	
//if (data == "\x33\x3C\x00\x00\x00\x01\x01\x71") {  //relay 1 is on
	//	g_comm.HeartbeatReceived();
	//    SystemVars.Write("relay1integer",1);
	//    SystemVars.Write("relay1ONboolean",true);
	 //   SystemVars.Write("relay1OFFboolean",false);
	 //   System.SignalEvent("relay1ONevent");	
	//	}

	
}
	
	
