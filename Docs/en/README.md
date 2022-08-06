![Logo](../../admin/time_switch_clock.png)
# ioBroker.time_switch_clock

[![NPM version](https://img.shields.io/npm/v/iobroker.time_switch_clock.svg)](https://www.npmjs.com/package/iobroker.time_switch_clock)
[![Downloads](https://img.shields.io/npm/dm/iobroker.time_switch_clock.svg)](https://www.npmjs.com/package/iobroker.time_switch_clock)
![Number of Installations](https://iobroker.live/badges/time_switch_clock-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/time_switch_clock-stable.svg)


[![NPM](https://nodei.co/npm/iobroker.time_switch_clock.png?downloads=true)](https://nodei.co/npm/iobroker.time_switch_clock/)

**Tests:** ![Test and Release](https://github.com/XSDiVer/ioBroker.time_switch_clock/workflows/Test%20and%20Release/badge.svg)

## time_switch_clock adapter for ioBroker

Timer for e.g. water valves or lamps e.t.c.

This adapter triggers up to 6 different data points.

## Documentation

[![trigger_1_is_set](https://img.shields.io/badge/-Setup.SetTrigger-blue)](https://img.shields.io/badge/-Setup.SetTrigger-blue) - First, under SetTrigger, set the trigger (1 - 6) which one should be changed.<br />

Then you can set the time and weekdays for the selected trigger under Setup & Weekdays.<br /><br />


<b>Function of the data points in the trigger:</b><br />
![Screenshot_1](https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/img/Screenshot_1.png)

 
[![goforit_1](https://img.shields.io/badge/-goforit__1-blue)](https://img.shields.io/badge/-goforit__1-blue) - the data point wich should be switched (see screenshot below)<br />
[![t1_time](https://img.shields.io/badge/-t1__time-blue)](https://img.shields.io/badge/-t1__time-blue) - Start time - when the DP should be set to true in the format HH:MM<br />
[![t1_weekdays](https://img.shields.io/badge/-t1__weekdays-blue)](https://img.shields.io/badge/-t1__weekdays-blue) - On which days of the week switching should take place (Sunday = 0 to Saturday = 6)<br />
[![timer_1](https://img.shields.io/badge/-timer__1-blue)](https://img.shields.io/badge/-timer__1-blue) - After how many minutes the DP should be set to False again<br />
[![trigger_1_Start](https://img.shields.io/badge/-trigger__1__Start-blue)](https://img.shields.io/badge/-trigger__1__Start-blue) - if the value is set to 'true' the trigger is active<br />
[![trigger_1_is_set](https://img.shields.io/badge/-trigger__1__is__set-blue)](https://img.shields.io/badge/-trigger__1__is__set-blue) - if 'trigger_1_Start' is 'true' - the days of the week and the time are displayed here again /<br />
                             if trigger_1_Start is 'false', DP displays 'not scheduled'.<br /><br />


<b>about goforit_1</b>

The id of the corresponding data point is simply copied here:

![Screenshot_id](https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/img/Screenshot_id.png)
 
In 'goforit' it must be entered in the respective trigger,
which data point should be triggered. Simply copy the _id of the corresponding data point and paste it into goforit.
At the set time, this data point is then set to 'true'.

The individual triggers can be selected via 'SetTrigger'.
Simply the desired number of the trigger to be set in,
Enter 'SetTrigger' -- Example: for Trigger_1 enter a 1 in 'SetTrigger'.

Now you can use the data points: -01_Monday, 02_Tuesday, 03_Wednesday, 04_Thursday, 05_Friday, 06_Saturday & 07_Sunday-
set on which day the 'trigger_1' - 'trigger_6' should be triggered.

Bei -Uhrzeit- trägt man die Uhrzeit ein, um die der jeweilige -trigger_1 - trigger_6- ausgelöst werden soll.
Die -Uhrzeit- wird im Format -HH:MM- gesetzt. Wobei HH für Stunden und MM für Minuten steht.

Under 'timer' in the respective data point - you can set after how many minutes before
switched data point should be set to 'false' again.


If you have set all 'trigger_1' - 'trigger_6' as desired,
you should set 'SetTrigger' to e.g. 0 -- so that changes to the time
or days of the week have no effect to the triggers.
SetTrigger is automatically set to 0 after 2 minutes of inactivity.<br /><br />

<b>Activate extended data points:</b><br />

- in the mainsettings you can activate 'extended datapoints' separately for each trigger (1 - 6) <br />
if these are activated - you get two extra data points in the respective trigger, which you can use
'true' & 'false'- can defined by yourself.

[![t1_true](https://img.shields.io/badge/01_t1_true-blue)](https://img.shields.io/badge/01_t1_true-blue) <br />
[![02_t1_false](https://img.shields.io/badge/02_t1_false-blue)](https://img.shields.io/badge/02_t1_false-blue)<br />

For example, you can dim a Hue lamp by entering the desired 'level' in the data point,<br />
or you can also change the 'effect' of the nanoleafs... e.t.c.<br /><br />


This adapter is primarily intended and intended for processing with the VIS
facilitate the creation of a time switch.


Here is an example that can be imported into VIS as a view,

 - The Inventwo Widgets are required!

 - Simply import in VIS under VIEW - (copy & paste)
 
<a href="https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/example_View_inventwo"> example VIS View</a>

![Screenshot_VIS](https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/img/Screenshot_VIS.png)


## Changelog

### 0.0.8 (2022-08-06)
* added extended Datapoints in the Mainsetup,
so you can trigger own defined strings - not only 'true' & 'false'

### 0.0.7 (2022-08-01)
* some fixes

### 0.0.6 (2022-07-31)
* added bluefox to collaborators on NPM

### 0.0.5 (2022-07-31)
* NPM fix

### 0.0.4 (2022-07-31)
* Beta Version with example VIS View (needs Inventwo Widges)
and added some datapoints

### 0.0.3 (2022-07-12)
* Beta Version with example VIS View (needs Inventwo Widges)

### 0.0.2 (2022-07-11)
* (XSDiVer) initial release

## License
MIT License

Copyright (c) 2022 XSDiVer <Tachyonen@quantentunnel.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
