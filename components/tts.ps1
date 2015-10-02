Add-Type -AssemblyName System.Windows.Forms
[System.Reflection.Assembly]::LoadWithPartialName("System.web")

$Clip = [System.Windows.Forms.Clipboard]::GetText()
$Encoded = [System.Web.HttpUtility]::UrlEncode("$Clip")
$Command = "& 'node.exe' '$PSScriptRoot\say.js' '$Encoded'"
clear
iex $Command

#pause