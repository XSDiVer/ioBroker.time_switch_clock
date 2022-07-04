// @ts-nocheck
'use strict';

/*
 * Created with @iobroker/create-adapter v2.1.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
<<<<<<< HEAD
//const { get } = require('http');
//const { validatePackageFiles } = require('@iobroker/testing/build/tests/packageFiles');
//const { validatePackageFiles } = require('@iobroker/testing/build/tests/packageFiles');
//const { truncate } = require('fs');
const schedule = require('node-schedule');
const SetWochentage = [];
const SetSchedule = [];
=======
//const { truncate } = require('fs');
const schedule = require('node-schedule');
>>>>>>> c1f51792c6e6613115ea09cea193509aa0ffafc1

// Load your modules here, e.g.:
// const fs = require("fs");

class TimeSwitchClock extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'time_switch_clock',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		this.log.warn('Adapter gestartet!');

<<<<<<< HEAD
		//States der Datenpunkte auslesen:
		const SUN = await this.getStateAsync('Wochentage.Sonntag');
		const statusSUN = SUN.val;

		const MON = await this.getStateAsync('Wochentage.Montag');
		const statusMON = MON.val;

		const TUE = await this.getStateAsync('Wochentage.Dienstag');
		const statusTUE = TUE.val;

		const WED = await this.getStateAsync('Wochentage.Mittwoch');
		const statusWED = WED.val;

		const THU = await this.getStateAsync('Wochentage.Donnerstag');
		const statusTHU = THU.val;

		const FRI = await this.getStateAsync('Wochentage.Freitag');
		const statusFRI = FRI.val;

		const SAT = await this.getStateAsync('Wochentage.Samstag');
		const statusSAT = SAT.val;

		const Uhrzeit_1 = await this.getStateAsync('Zeitplan.Uhrzeit1');
		const status_Uhrzeit_1 = Uhrzeit_1.val;
		const [HH, MM] = status_Uhrzeit_1.split(':');

		this.log.warn('Uhrzeit_1 --  ' + status_Uhrzeit_1);
		this.log.warn('HH --  ' + HH);
		this.log.warn('MM --  ' + MM);


		//const hh_Ventil_1_ZP_2 = this.formatDate(this.getDateObject(this.getState("0_userdata.0.Bewässerung.Ventil_1.Ventil_1_ZP_2").val), "SS");

		//const mm = this.config.Minuten;

		this.log.error('-------------------');
		this.log.error('FR = ' + statusFRI);
		this.log.error('DO = ' + statusTHU);
		this.log.error('MI = ' + statusWED);
		this.log.error('DI = ' + statusTUE);
		this.log.error('MO = ' + statusMON);
		this.log.error('SO = ' + statusSUN);
		this.log.error('SA = ' + statusSAT);
		this.log.error ('Wochentage auslesen');

		//in Array einfügen oder löschen wenn false
		//Sonntag
		if (statusSUN == true) {
			SetWochentage.splice(0,1, 'Sonntag');
			SetSchedule.splice(0,0, 0);
			//SetWochentage.sort();
			//this.log.error('SetWochentage: ' + SetWochentage);

		}  else if (statusSUN == false) {
			//const kill = SetWochentage.indexOf('Sonntag');
			SetWochentage.splice(0,1, '');
			//this.log.error('kill: ' + kill);
			//this.log.error('Array ' + SetWochentage);

		}	else {
			this.log.error('else... ' + statusSUN);
		}

		//Montag
		if (statusMON == true) {
			SetWochentage.splice(1,1, 'Montag');
			SetSchedule.splice(0,0, 1);

		}  else if (statusMON == false) {
			SetWochentage.splice(1,1, '');

		}	else {
			this.log.error('else... ' + statusMON);
		}

		//Dienstag
		if (statusTUE == true) {
			SetWochentage.splice(2,1, 'Dienstag');
			SetSchedule.splice(0,0, 2);

		}  else if (statusTUE == false) {
			SetWochentage.splice(2,1, '');

		}	else {
			this.log.error('else... ' + statusTUE);
		}

		//Mittwoch
		if (statusWED == true) {
			SetWochentage.splice(3,1, 'Mittwoch');
			SetSchedule.splice(0,0, 3);

		}  else if (statusWED == false) {
			SetWochentage.splice(3,1, '');

		}	else {
			this.log.error('else... ' + statusWED);
		}

		//Donnerstag
		if (statusTHU == true) {
			SetWochentage.splice(4,1, 'Donnerstag');
			SetSchedule.splice(0,0, 4);

		}  else if (statusTHU == false) {
			SetWochentage.splice(4,1, '');

		}	else {
			this.log.error('else... ' + statusTHU);
		}

		//Freitag
		if (statusFRI == true) {
			SetWochentage.splice(5,1, 'Freitag');
			SetSchedule.splice(0,0, 5);

		}  else if (statusFRI == false) {
			SetWochentage.splice(5,1, '');

		}	else {
			this.log.error('else... ' + statusFRI);
		}

		//Samstag
		if (statusSAT == true) {
			SetWochentage.splice(6,1, 'Samstag');
			SetSchedule.splice(0,0, 6);

		}  else if (statusSAT == false) {
			SetWochentage.splice(6,1, '');

		}	else {
			this.log.error('else... ' + statusSAT);
		}

		//Array sortieren & Array 'SetWochentage' in Log ausgeben
		//SetWochentage.sort();
		this.log.error('SetWochentage: ' + SetWochentage);

		//Array SetSchedule sortieren und in Log ausgeben
		SetSchedule.sort();
		this.log.error('SetSchedule: ' + SetSchedule);

		//Schedule zusammen setzten

		this.log.warn('hh = ' + HH + ' - mm = ' + MM + ' - Wochentage = ' + SetSchedule);

		const startZeit = async () => {
			schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + SetSchedule.toString().trim(), async () =>
=======
		//Schedule mit Variablen
		await this.setStateAsync('Wochentage.Montag',  this.config.Montag, true);
		await this.setStateAsync('Wochentage.Dienstag',  this.config.Dienstag, true);
		await this.setStateAsync('Wochentage.Mittwoch',  this.config.Mittwoch, true);
		await this.setStateAsync('Wochentage.Donnerstag',  this.config.Donnerstag, true);
		await this.setStateAsync('Wochentage.Freitag',  this.config.Freitag, true);
		await this.setStateAsync('Wochentage.Samstag',  this.config.Samstag, true);
		await this.setStateAsync('Wochentage.Sonntag',  this.config.Sonntag, true);

		await this.setStateAsync('Zeitplan.Uhrzeit1', this.config.Stunden + ':' + this.config.Minuten);

		//Wochentage müssen noch geholt werden - sind noch manuell gesetzt.
		const Wochentage = '0,6';

		const hh = this.config.Stunden;
		const mm = this.config.Minuten;

		this.log.warn('hh = ' + hh + ' - mm = ' + mm + ' - Wochentage = ' + Wochentage);

		//Schedule zusammen setzten
		const startZeit = async () => {
			schedule.scheduleJob(mm.toString().trim() + ' ' + hh.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + Wochentage.toString().trim(), async () =>
>>>>>>> c1f51792c6e6613115ea09cea193509aa0ffafc1
				this.log.warn('Schedule ausgelöst!'));
		};
		//Schedule zusammen setzten - ENDE

		//Schedule starten
		startZeit();
		//Schedule starten -- ENDE

<<<<<<< HEAD

		//Überprüfen ob die Datenpunkte angelegt sind
		await this.setObjectNotExistsAsync('Wochentage.Sonntag', {
			type: 'state',
			common: {
				name: 'Sonntag',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Wochentage.Montag', {
			type: 'state',
			common: {
				name: 'Montag',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Wochentage.Dienstag', {
			type: 'state',
			common: {
				name: 'Dienstag',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Wochentage.Mittwoch', {
			type: 'state',
			common: {
				name: 'Mittwoch',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Wochentage.Donnerstag', {
			type: 'state',
			common: {
				name: 'Donnerstag',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Wochentage.Freitag', {
			type: 'state',
			common: {
				name: 'Freitag',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Wochentage.Samstag', {
			type: 'state',
			common: {
				name: 'Samstag',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

		// Reset the connection indicator during startup
		this.setState('info.connection', true, true);

		//hier werden Datenpunkt Änderungen im Log angezeigt

		this.subscribeStates('Wochentage.Montag');
		this.subscribeStates('Wochentage.Dienstag');
		this.subscribeStates('Wochentage.Mittwoch');
		this.subscribeStates('Wochentage.Donnerstag');
		this.subscribeStates('Wochentage.Freitag');
		this.subscribeStates('Wochentage.Samstag');
		this.subscribeStates('Wochentage.Sonntag');

=======
		//Schedule mit Variablen -- ENDE

		// Reset the connection indicator during startup
		this.setState('info.connection', true, true);

		//hier werden Datenpunkt Änderungen im Log angezeigt

		this.subscribeStates('Wochentage.Montag');
		this.subscribeStates('Wochentage.Dienstag');
		this.subscribeStates('Wochentage.Mittwoch');
		this.subscribeStates('Wochentage.Donnerstag');
		this.subscribeStates('Wochentage.Freitag');
		this.subscribeStates('Wochentage.Samstag');
		this.subscribeStates('Wochentage.Sonntag');

>>>>>>> c1f51792c6e6613115ea09cea193509aa0ffafc1
	}


	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active

			this.setStateAsync('info.connection', { val: false, ack: true });
			schedule.gracefulShutdown();
			this.log.warn('Adapter gestoppt! - Alle Schedules gelöscht!');

			callback();
		} catch (e) {
			callback();
		}
	}

<<<<<<< HEAD
	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	/**
	  * Is called if a subscribed object changes
	  * @param {string} id
	  * @param {ioBroker.Object | null | undefined} obj
	 */
	onObjectChange(id, obj) {
		if (obj) {
			// The object was changed
			this.log.error(`object ${id} changed: ${JSON.stringify(obj)}`);

		} else {
			// The object was deleted
			this.log.error(`object ${id} deleted`);
		}
	}

=======
>>>>>>> c1f51792c6e6613115ea09cea193509aa0ffafc1
	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */

	async onStateChange(id, state) {

		if (state) {
<<<<<<< HEAD

			//bei Änderung der Datenpunkte true oder false auswerten
			const SUN = await this.getStateAsync('Wochentage.Sonntag');
			const statusSUN = SUN.val;
			const Sunday = async () => {
				if (statusSUN == true) {
					this.log.error ('SO ist ' + statusSUN);
				} else if (statusSUN == false) {
					this.log.error('So ist ' + statusSUN);
				} else {
					this.log.error('Error SO = ' + statusSUN);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Sonntag') {
				Sunday();
			}

			const MON = await this.getStateAsync('Wochentage.Montag');
			const statusMON = MON.val;
			const Monday = async () => {
				if (statusMON == true) {
					this.log.error ('MO ist ' + statusMON);
				} else if (statusMON == false) {
					this.log.error('MO ist ' + statusMON);
				} else {
					this.log.error('Error MO = ' + statusMON);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Montag') {
				Monday();
			}

			const TUE = await this.getStateAsync('Wochentage.Dienstag');
			const statusTUE = TUE.val;
			const Tuesday = async () => {
				if (statusTUE == true) {
					this.log.error ('DI ist ' + statusTUE);
				} else if (statusTUE == false) {
					this.log.error('DI ist ' + statusTUE);
				} else {
					this.log.error('Error DI = ' + statusTUE);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Dienstag') {
				Tuesday();
			}

			const WED = await this.getStateAsync('Wochentage.Mittwoch');
			const statusWED = WED.val;
			const Wednesday = async () => {
				if (statusWED == true) {
					this.log.error ('MI ist ' + statusWED);
				} else if (statusWED == false) {
					this.log.error('MI ist ' + statusWED);
				} else {
					this.log.error('Error MI = ' + statusWED);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Mittwoch') {
				Wednesday();
			}

			const THU = await this.getStateAsync('Wochentage.Donnerstag');
			const statusTHU = THU.val;
			const Thursday = async () => {
				if (statusTHU == true) {
					this.log.error ('DO ist ' + statusTHU);
				} else if (statusTHU == false) {
					this.log.error('DO ist ' + statusTHU);
				} else {
					this.log.error('Error DO = ' + statusTHU);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Donnerstag') {
				Thursday();
			}

			const FRI = await this.getStateAsync('Wochentage.Freitag');
			const statusFRI = FRI.val;
			const Friday = async () => {
				if (statusFRI == true) {
					this.log.error ('FR ist ' + statusFRI);
				} else if (statusFRI == false) {
					this.log.error('FR ist ' + statusFRI);
				} else {
					this.log.error('Error FR = ' + statusFRI);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Freitag') {
				Friday();
			}

			const SAT = await this.getStateAsync('Wochentage.Samstag');
			const statusSAT = SAT.val;
			const Saturday = async () => {
				if (statusSAT == true) {
					this.log.error ('SA ist ' + statusSAT);
				} else if (statusSAT == false) {
					this.log.error('SA ist ' + statusSAT);
				} else {
					this.log.error('Error SA = ' + statusSAT);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Samstag') {
				Saturday();
			}

			//bei Änderung des der Datenpunkte Array neu schreiben
			//Sonntag
			if (statusSUN == true) {
				SetWochentage.splice(0,1, 'Sonntag');

			}  else if (statusSUN == false) {
				SetWochentage.splice(0,1, 'x');

			}	else {
				this.log.error('else... ' + statusSUN);
			}

			//Montag
			if (statusMON == true) {
				SetWochentage.splice(1,1, 'Montag');

			}  else if (statusMON == false) {
				SetWochentage.splice(1,1, 'x');

			}	else {
				this.log.error('else... ' + statusMON);
			}

			//Dienstag
			if (statusTUE == true) {
				SetWochentage.splice(2,1, 'Dienstag');

			}  else if (statusTUE == false) {
				SetWochentage.splice(2,1, 'x');

			}	else {
				this.log.error('else... ' + statusTUE);
			}

			//Mittwoch
			if (statusWED == true) {
				SetWochentage.splice(3,1, 'Mittwoch');

			}  else if (statusWED == false) {
				SetWochentage.splice(3,1, 'x');

			}	else {
				this.log.error('else... ' + statusWED);
			}

			//Donnerstag
			if (statusTHU == true) {
				SetWochentage.splice(4,1, 'Donnerstag');

			}  else if (statusTHU == false) {
				SetWochentage.splice(4,1, 'x');

			}	else {
				this.log.error('else... ' + statusTHU);
			}

			//Freitag
			if (statusFRI == true) {
				SetWochentage.splice(5,1, 'Freitag');

			}  else if (statusFRI == false) {
				SetWochentage.splice(5,1, 'x');

			}	else {
				this.log.error('else... ' + statusFRI);
			}

			//Samstag
			if (statusSAT == true) {
				SetWochentage.splice(6,1, 'Samstag');

			}  else if (statusSAT == false) {
				SetWochentage.splice(6,1, 'x');

			}	else {
				this.log.error('else... ' + statusSAT);
			}


			//Array SetWochentage auf Werte überprüfen und neues Array SetSchedule schreiben
			const killSO = SetWochentage.indexOf('Sonntag');
			if (killSO !== -1 && SetSchedule.indexOf(0) == -1) {
				SetSchedule.splice(0,0, 0);

			} else if (killSO == -1 && SetSchedule.indexOf(0) == 0) {

				const searchSO = (element) => element == 0;
				SetSchedule.splice(SetSchedule.findIndex(searchSO),1);
			}

			const killMO = SetWochentage.indexOf('Montag');
			if (killMO != -1 && SetSchedule.indexOf(1) == -1) {
				SetSchedule.splice(0,0, 1);

			} else if (killMO == -1 && SetSchedule.indexOf(1) !== -1) {

				const searchMO = (element) => element == 1;
				SetSchedule.splice(SetSchedule.findIndex(searchMO),1);
			}

			const killDI = SetWochentage.indexOf('Dienstag');
			if (killDI != -1 && SetSchedule.indexOf(2) == -1) {
				SetSchedule.splice(0,0, 2);

			} else if (killDI == -1 && SetSchedule.indexOf(2) !==-1) {

				const searchDI = (element) => element == 2;
				SetSchedule.splice(SetSchedule.findIndex(searchDI),1);
			}

			const killMI = SetWochentage.indexOf('Mittwoch');
			if (killMI != -1 && SetSchedule.indexOf(3) == -1) {
				SetSchedule.splice(0,0, 3);

			} else if (killMI == -1 && SetSchedule.indexOf(3) !== -1) {

				const searchMI = (element) => element == 3;
				SetSchedule.splice(SetSchedule.findIndex(searchMI),1);
			}

			const killDO = SetWochentage.indexOf('Donnerstag');
			if (killDO != -1 && SetSchedule.indexOf(4) == -1) {
				SetSchedule.splice(0,0, 4);

			} else if (killDO == -1 && SetSchedule.indexOf(4) !== -1) {

				const searchDO = (element) => element == 4;
				SetSchedule.splice(SetSchedule.findIndex(searchDO),1);
			}

			const killFR = SetWochentage.indexOf('Freitag');
			if (killFR != -1 && SetSchedule.indexOf(5) == -1) {
				SetSchedule.splice(0,0, 5);

			} else if (killFR == -1 && SetSchedule.indexOf(5) !== -1) {

				const searchFR = (element) => element == 5;
				SetSchedule.splice(SetSchedule.findIndex(searchFR),1);
			}

			const killSA = SetWochentage.indexOf('Samstag');
			if (killSA != -1 && SetSchedule.indexOf(6) == -1) {
				SetSchedule.splice(0,0, 6);

			} else if (killSA == -1 && SetSchedule.indexOf(6) !== -1) {

				const searchSA = (element) => element == 6;
				SetSchedule.splice(SetSchedule.findIndex(searchSA),1);
			}

			//Array sortieren & Array 'SetWochentage' in Log ausgeben
			//SetWochentage.sort();
			this.log.error('SetWochentage: ' + SetWochentage);

			//Array SetSchedule sortieren und in Log ausgeben
			SetSchedule.sort();
			this.log.error('SetSchedule: ' + SetSchedule);
			//Ende von Setstate


=======
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);

			//Hier wird in gelb im Log id ist true ausgegeben, wenn der Wert auf true gesetzt wird.
			if (state.val == true) {
				this.log.error(id + ' ist = true !');
			}

			if (state.val == false) {
				this.log.error(id + ' ist = false !');
			}

>>>>>>> c1f51792c6e6613115ea09cea193509aa0ffafc1
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}


}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new TimeSwitchClock(options);
} else {
	// otherwise start the instance directly
	new TimeSwitchClock();
}