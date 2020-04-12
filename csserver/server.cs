namespace FIFA 
{
    using System;
    using System.IO;
    using System.Net;
    using System.Net.Sockets;
    using System.Text;
    using System.Threading;

    class Server 
    {
        private TcpListener myListener;
        private int port = 8888;

        public Server()
        {
            try
            {
                myListener = new TcpListener(port);
                myListener.Start();
                Console.WriteLine("Web Server Running... Press ^C to Stop...");
                //start the thread which calls the method 'StartListen'  
                Thread th = new Thread(new ThreadStart(StartListen));
                th.Start();
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception Occurred while Listening :" + e.ToString());
            }
        }
        public string DefaultDirectory(string localDirectory)
        {
            StreamReader streamReader;
            String sLine = "";
            try
            {
                streamReader = new StreamReader("Default.Dat");
                while ((sLine = sr.ReadLine()) != null)
                {
                    if (File.Exists(sLocalDirectory + sLine))
                        break;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception Occurred: " + e.ToString());
            }
            if (File.Exists(sLocalDirectory + sLine))
                return sLine;
            else
                return "";
        }
        
        public string GetLocalPath(string sMyWebServerRoot, string sDirName)  
        {  
            StreamReader sr;
            String sLine = "";
            String sVirtualDir = "";
            String sRealDir = "";
            int iStartPos = 0;
            sDirName.Trim();
            sMyWebServerRoot = sMyWebServerRoot.ToLower();
            sDirName = sDirName.ToLower();
            try  
            {  
                sr = new StreamReader("VDirs.Dat");
                while ((sLine = sr.ReadLine()) != null)  
                {  
                    sLine.Trim();
                    if (sLine.Length > 0)  
                    {  
                        iStartPos = sLine.IndexOf(";");
                        sLine = sLine.ToLower();
                        sVirtualDir = sLine.Substring(0, iStartPos);
                        sRealDir = sLine.Substring(iStartPos + 1);
                        if (sVirtualDir == sDirName)  
                        {  
                            break;
                        }  
                    }  
                }  
            }  
            catch (Exception e)  
            {  
                Console.WriteLine("An Exception Occurred : " + e.ToString());
            }  
            if (sVirtualDir == sDirName)  
                return sRealDir;
            else  
                return "";
        }  
        public string GetMimeType(string sRequestedFile)  
        {  
            StreamReader sr;  
            String sLine = "";  
            String sMimeType = "";  
            String sFileExt = "";  
            String sMimeExt = "";  
            // Convert to lowercase  
            sRequestedFile = sRequestedFile.ToLower();  
            int iStartPos = sRequestedFile.IndexOf(".");  
            sFileExt = sRequestedFile.Substring(iStartPos);  
            try  
            {  
                //Open the Vdirs.dat to find out the list virtual directories  
                sr = new StreamReader("data\\Mime.Dat");  
                while ((sLine = sr.ReadLine()) != null)  
                {  
                    sLine.Trim();  
                    if (sLine.Length > 0)  
                    {  
                        //find the separator  
                        iStartPos = sLine.IndexOf(";");  
                        // Convert to lower case  
                        sLine = sLine.ToLower();  
                        sMimeExt = sLine.Substring(0, iStartPos);  
                        sMimeType = sLine.Substring(iStartPos + 1);  
                        if (sMimeExt == sFileExt)  
                            break;  
                    }  
                }  
            }  
            catch (Exception e)  
            {  
                Console.WriteLine("An Exception Occurred : " + e.ToString());  
            }  
            if (sMimeExt == sFileExt)  
                return sMimeType;  
            else  
                return "";  
        } 
        public void SendHeader(string sHttpVersion, string sMIMEHeader, int iTotBytes, string sStatusCode, ref Socket mySocket)  
        {  
            String sBuffer = "";  
            // if Mime type is not provided set default to text/html  
            if (sMIMEHeader.Length == 0)  
            {  
                sMIMEHeader = "text/html";// Default Mime Type is text/html  
            }  
            sBuffer = sBuffer + sHttpVersion + sStatusCode + "\r\n";  
            sBuffer = sBuffer + "Server: cx1193719-b\r\n";  
            sBuffer = sBuffer + "Content-Type: " + sMIMEHeader + "\r\n";  
            sBuffer = sBuffer + "Accept-Ranges: bytes\r\n";  
            sBuffer = sBuffer + "Content-Length: " + iTotBytes + "\r\n\r\n";  
            Byte[] bSendData = Encoding.ASCII.GetBytes(sBuffer);  
            SendToBrowser(bSendData, ref mySocket);  
            Console.WriteLine("Total Bytes : " + iTotBytes.ToString());  
        }  
        public void SendToBrowser(String sData, ref Socket mySocket)  
        {  
            SendToBrowser(Encoding.ASCII.GetBytes(sData), ref mySocket);  
        }  
        public void SendToBrowser(Byte[] bSendData, ref Socket mySocket)  
        {  
            int numBytes = 0;  
            try  
            {  
                if (mySocket.Connected)  
                {  
                    if ((numBytes = mySocket.Send(bSendData, bSendData.Length, 0)) == -1)  
                        Console.WriteLine("Socket Error cannot Send Packet");  
                    else  
                    {  
                        Console.WriteLine("No. of bytes send {0}", numBytes);  
                    }  
                }  
                else Console.WriteLine("Connection Dropped....");  
            }  
            catch (Exception e)  
            {  
                Console.WriteLine("Error Occurred : {0} ", e);  
            }  
        } 
    }
}