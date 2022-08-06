![Logo](admin/time_switch_clock.png)
# ioBroker.time_switch_clock

[![NPM version](https://img.shields.io/npm/v/iobroker.time_switch_clock.svg)](https://www.npmjs.com/package/iobroker.time_switch_clock)
[![Downloads](https://img.shields.io/npm/dm/iobroker.time_switch_clock.svg)](https://www.npmjs.com/package/iobroker.time_switch_clock)
[![XSD](https://img.shields.io/badge/creator-XSDiVer-blueviolet)](https://img.shields.io/badge/creator-XSDiVer-blueviolet)
![Number of Installations](https://iobroker.live/badges/time_switch_clock-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/time_switch_clock-stable.svg)


[![NPM](https://nodei.co/npm/iobroker.time_switch_clock.png?downloads=true)](https://nodei.co/npm/iobroker.time_switch_clock/)

**Tests:** ![Test and Release](https://github.com/XSDiVer/ioBroker.time_switch_clock/workflows/Test%20and%20Release/badge.svg)

## time_switch_clock adapter for ioBroker

Timer for e.g. water valves or lamps e.t.c.

Dieser Adapter löst bis zu 6 verschiedene Datenpunkte aus.

[![trigger_1_is_set](https://img.shields.io/badge/-Setup.SetTrigger-blue)](https://img.shields.io/badge/-Setup.SetTrigger-blue) - als erstes unter SetTrigger, den Trigger (1 - 6) einstellen, welcher geändert werden soll.<br />

Dann kann man unter Setup & Weekdays die Uhrzeit & die Wochentage für den entsprechend gewählten Trigger einstellen.<br /><br />


<b>Funktion der Datenpunkte im Trigger:</b><br />
![Screenshot_1](https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/img/Screenshot_1.png)

 
[![goforit_1](https://img.shields.io/badge/-goforit__1-blue)](https://img.shields.io/badge/-goforit__1-blue) - der Datenpunkt der geschaltet werden soll (siehe auch Screenshot unten)<br />
[![t1_time](https://img.shields.io/badge/-t1__time-blue)](https://img.shields.io/badge/-t1__time-blue) - Startuhrzeit - wann der DP auf True gsetzt werden soll im Format HH:MM<br />
[![t1_weekdays](https://img.shields.io/badge/-t1__weekdays-blue)](https://img.shields.io/badge/-t1__weekdays-blue) - An welchen Wochentagen geschaltet werden soll (Sonntag = 0 bis Samstag = 6)<br />
[![timer_1](https://img.shields.io/badge/-timer__1-blue)](https://img.shields.io/badge/-timer__1-blue) - Nach wievielen Minuten der DP wieder auf False gesetzt werden soll<br />
[![trigger_1_Start](https://img.shields.io/badge/-trigger__1__Start-blue)](https://img.shields.io/badge/-trigger__1__Start-blue) - wenn der wert auf True gesetzt wird ist der Trigger aktiv und schaltet<br />
[![trigger_1_is_set](https://img.shields.io/badge/-trigger__1__is__set-blue)](https://img.shields.io/badge/-trigger__1__is__set-blue) - wenn trigger_1_Start True ist- werden hier nochmal Wochentage und Uhrzeit angezeigt /<br />
                             wenn trigger_1_Start auf False steht zeigt DP 'not scheduled' an.<br /><br />


<b>zu goforit_1</b>

Hier wird einfach die id des entsprechenden Datenpunkts rein kopiert:

![Screenshot_id](https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/img/Screenshot_id.png)
 
In "goforit" muss im jeweiligen Trigger eingetragen werden,
welcher Datenpunkt ausgelöst werden soll. Einfach die _id des ensprechenden Datenpunktes kopieren und in goforit einfügen.
Zur eingestellten Zeit wird dieser Datenpunkt dann auf "true" gesetzt.

Die einzelnen trigger können über -SetTrigger- ausgewählt werden.
Einfach die gewünschte Nummer des Triggers der gesetzt werden soll in,
-SetTrigger- eintragen -- Bsp.: für Trigger_1 eine 1 in -SetTrigger- eintragen.

Jetzt kann man über die Datenpunkte: -Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag & Sonntag-
einstellen, an welchem Tag der -trigger_1 - trigger_6- ausgelöst werden soll.

Bei -Uhrzeit- trägt man die Uhrzeit ein, um die der jeweilige -trigger_1 - trigger_6- ausgelöst werden soll.
Die -Uhrzeit- wird im Format -HH:MM- gesetzt. Wobei HH für Stunden und MM für Minuten steht.

Unter "timer" im jeweiligen Datenpunkt - kann man einstellen nach wievielen Minuten der vorher
geschaltete Datenpunkt wieder auf "false" gesetzt werden soll.


Hat man alle -trigger_1 - trigger_6- wie gewünscht eingestellt, 
sollte man  -SetTrigger- auf z.B. 0 setzen -- damit sich durch Änderungen an Uhrzeit
oder Wochentagen -- kein -trigger_1 - trigger_6- verstellt, bzw. neu gesetzt wird.
SetTrigger wird nach 2 Minuten Inaktivität automatisch auf 0 gesetzt.<br /><br />

<b>extended Datapoints aktivieren:</b><br />

- in den Einstellungen kann man 'extended Datapoints' für jeden Trigger (1 - 6) separat aktivieren <br />
sind diese aktiviert - erhält man im jeweiligen Trigger zwei extra Datenpunkte, über die man
'true' & 'false'- selbst definieren kann. 

[![t1_true](https://img.shields.io/badge/01_t1_true-blue)](https://img.shields.io/badge/01_t1_true-blue) <br />
[![02_t1_false](https://img.shields.io/badge/02_t1_false-blue)](https://img.shields.io/badge/02_t1_false-blue)<br />

so kann man z.B. ein Hue - Lampe dimmen, indem man das gewünschte 'Level' im Datenpunkt einbringt.<br />
(kommt ein kleiner Fehler im Log.: State value to set for "hue.0.device" has to be type "number" but received type "string" - 
muss noch gefixed werden - funktioniert aber.) <br />
Man kann z.B. auch bei den nanoleafs 'effect' ändern... e.t.c.<br /><br />


Dieser Adapter ist vorallem zur Verarbeitung mit der VIS gedacht und soll
das erstellen einer Zeitschaltung erleichtern.


Hier ist ein Beispiel den man im VIS als View importieren kann,

 - Die Inventwo Widges werden benötigt!

 - Einfach im VIS unter VIEW importieren - (copy & paste)
 
<a href="https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/example_View_inventwo"> example VIS View</a>

![Screenshot_VIS](https://github.com/XSDiVer/ioBroker.time_switch_clock/blob/main/Docs/img/Screenshot_VIS.png)

-- todo: Astro Funktionen sollten implementiert werden.

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
