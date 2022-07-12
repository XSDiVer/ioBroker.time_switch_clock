![Logo](admin/time_switch_clock.png)
# ioBroker.time_switch_clock

[![NPM version](https://img.shields.io/npm/v/iobroker.time_switch_clock.svg)](https://www.npmjs.com/package/iobroker.time_switch_clock)
[![Downloads](https://img.shields.io/npm/dm/iobroker.time_switch_clock.svg)](https://www.npmjs.com/package/iobroker.time_switch_clock)
![Number of Installations](https://iobroker.live/badges/time_switch_clock-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/time_switch_clock-stable.svg)
[![Dependency Status](https://img.shields.io/david/XSDiVer/iobroker.time_switch_clock.svg)](https://david-dm.org/XSDiVer/iobroker.time_switch_clock)

[![NPM](https://nodei.co/npm/iobroker.time_switch_clock.png?downloads=true)](https://nodei.co/npm/iobroker.time_switch_clock/)

**Tests:** ![Test and Release](https://github.com/XSDiVer/ioBroker.time_switch_clock/workflows/Test%20and%20Release/badge.svg)

## time_switch_clock adapter for ioBroker

Timer for e.g. water valves or other things

Dieser Adapter löst bis zu 6 verschiedene Datenpunkte aus <trigger_1 - trigger_6>.
Dieser Trigger kann in einem Blockly verwendet werden um einen Datenpunkt nach Wahl auszulösen.

Die einzelnen trigger können über <SetTrigger> ausgewählt werden.
Einfach die gewünschte Nummer des Triggers der gesetzt werden soll in,
<SetTrigger> eintagen -- Bsp.: für Trigger_1 eine 1 in <SetTrigger> eintragen.

Jetzt kann man über die Datenpunkte: <Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag & Sonntag>
einstellen, an welchem Tag der <trigger_1 - trigger_6> ausgelöst werden soll.

Bei <Uhrzeit> trägt man die Uhrzeit ein, um die der jeweilige <trigger_1 - trigger_6> ausgelöst werden soll.
Die <Uhrzeit> wird im Format <HH:MM> gesetzt. Wobei HH für Stunden und MM für Minuten steht.

Hat man alle <trigger_1 - trigger_6> wie gewünscht eingestellt, 
sollte man  <SetTrigger> auf z.B. 0 setzen -- damit sich durch Änderungen an Uhrzeit
oder Wochentagen -- kein <trigger_1 - trigger_6> verstellt, bzw. neu gesetzt wird...

## Changelog
<!-- Platzhalter für nächstes Change Log. -->

### 0.0.3 (2022-07-12)
* Beta Version without VIS Widget

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
