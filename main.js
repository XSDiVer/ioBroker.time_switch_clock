// @ts-nocheck
'use strict';

//const { Adapter } = require('@iobroker/adapter-core');
/*
 * Created with @iobroker/create-adapter v2.1.1
 */

const utils = require('@iobroker/adapter-core');
//const { info } = require('console');
//const { triggerAsyncId } = require('async_hooks');
const schedule = require('node-schedule');
//const { runInThisContext } = require('vm');
//const { runInThisContext } = require('vm');
const SetWochentage = [];
const SetSchedule = [];
const Uhrzeit = [];

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
		this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		this.log.info('Adapter TimeSwitchClock gestartet!');

		//States der Datenpunkte auslesen:
		const SUN = await this.getStateAsync('Wochentage.Sonntag');
		const statusSUN = SUN ? SUN.val: false;

		const MON = await this.getStateAsync('Wochentage.Montag');
		const statusMON = MON ? MON.val: false;

		const TUE = await this.getStateAsync('Wochentage.Dienstag');
		const statusTUE = TUE ? TUE.val: false;

		const WED = await this.getStateAsync('Wochentage.Mittwoch');
		const statusWED = WED ? WED.val: false;

		const THU = await this.getStateAsync('Wochentage.Donnerstag');
		const statusTHU = THU ? THU.val: false;

		const FRI = await this.getStateAsync('Wochentage.Freitag');
		const statusFRI = FRI ? FRI.val: false;

		const SAT = await this.getStateAsync('Wochentage.Samstag');
		const statusSAT = SAT ? SAT.val: false;

		const Uhrzeit_1 = await this.getStateAsync('Zeitplan.Uhrzeit1');
		const status_Uhrzeit_1 = Uhrzeit_1 ? Uhrzeit_1.val: '00:00';

		const [HH_1, MM_1] = status_Uhrzeit_1.split(':');

		//HH:MM
		Uhrzeit.splice(0,1, HH_1);
		Uhrzeit.splice(1,1, MM_1);

		//in Array einfügen oder löschen wenn false
		//Sonntag
		if (statusSUN == true) {
			SetWochentage.splice(0,1, 'Sonntag');
			SetSchedule.splice(0,0, 0);

		}  else if (statusSUN == false) {
			SetWochentage.splice(0,1, '');

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

		//Array sortieren
		SetWochentage.sort();

		//Array SetSchedule sortieren
		SetSchedule.sort();

		await this.setObjectNotExistsAsync('trigger_1.trigger_1_is_set', {
			type: 'state',
			common: {
				name: 'trigger_1_is_set',
				type: 'string',
				role: 'text',
				read: true,
				write: false,
			},
			native: {},
		});

		//Schedule zusammen setzten
		this.Schedule_1 = async () => {
			const HH = Uhrzeit[0];
			const MM = Uhrzeit[1];

			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59) {
				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + SetSchedule.toString().trim(), async () =>
					this.setState('trigger_1.trigger_1', true, true) && this.log.info('Schedule 1 ausgelöst!')); +
				(this.setState('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + SetWochentage, true) /*&& this.log.info('next Schedule 1 - ' + this.mySchedule_1.nextInvocation())*/);

			} else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 1 -- ' + HH + ':' + MM);
				this.setState('trigger_1.trigger_1_Start', false, true);

			} else {
				this.log.error('irgendwas stimmt nicht bei Schedule 1--- Uhrzeit = ' + Uhrzeit);
				this.setState('trigger_1.trigger_1_Start', false, true);

			}
		};


		this.Schedule_2 = async () => {
			const HH = Uhrzeit[0];
			const MM = Uhrzeit[1];

			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59) {
				this.mySchedule_2 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + SetSchedule.toString().trim(), async () =>
					this.setState('trigger_2.trigger_2', true, true) && this.log.info('Schedule 2 ausgelöst!')); +
				(this.setState('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + SetWochentage, true) /*&& this.log.info('next Schedule 2 -- ' + this.mySchedule_2.nextInvocation())*/);

			} else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 2 -- ' + HH + ':' + MM);
				this.setState('trigger_2.trigger_2_Start', false, true);

			} else {
				this.log.error('irgendwas stimmt nicht bei Schedule 2 --- Uhrzeit = ' + Uhrzeit);
				this.setState('trigger_2.trigger_2_Start', false, true);

			}
		};


		this.Schedule_3 = async () => {
			const HH = Uhrzeit[0];
			const MM = Uhrzeit[1];

			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59) {
				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + SetSchedule.toString().trim(), async () =>
					this.setState('trigger_3.trigger_3', true, true) && this.log.info('Schedule 3 ausgelöst!')); +
				(this.setState('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + SetWochentage, true) /*&& this.log.info('next Schedule 3 -- ' + this.mySchedule_3.nextInvocation())*/);

			} else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 3 -- ' + HH + ':' + MM);
				this.setState('trigger_3.trigger_3_Start', false, true);

			} else {
				this.log.error('irgendwas stimmt nicht bei Schedule 3 --- Uhrzeit = ' + Uhrzeit);
				this.setState('trigger_3.trigger_3_Start', false, true);

			}
		};


		this.Schedule_4 = async () => {
			const HH = Uhrzeit[0];
			const MM = Uhrzeit[1];

			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59) {
				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + SetSchedule.toString().trim(), async () =>
					this.setState('trigger_4.trigger_4', true, true) && this.log.info('Schedule 4 ausgelöst!')); +
				(this.setState('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + SetWochentage, true) /*&& this.log.info('next Schedule 4 -- ' + this.mySchedule_4.nextInvocation())*/);

			} else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 4 -- ' + HH + ':' + MM);
				this.setState('trigger_4.trigger_4_Start', false, true);

			} else {
				this.log.error('irgendwas stimmt nicht bei Schedule 4 --- Uhrzeit = ' + Uhrzeit);
				this.setState('trigger_4.trigger_4_Start', false, true);

			}
		};


		this.Schedule_5 = async () => {
			const HH = Uhrzeit[0];
			const MM = Uhrzeit[1];

			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59) {
				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + SetSchedule.toString().trim(), async () =>
					this.setState('trigger_5.trigger_5', true, true) && this.log.info('Schedule 5 ausgelöst!')); +
				(this.setState('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + SetWochentage, true) /*&& this.log.info('next Schedule 5 -- ' + this.mySchedule_5.nextInvocation())*/);

			} else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 5 -- ' + HH + ':' + MM);
				this.setState('trigger_5.trigger_5_Start', false, true);

			} else {
				this.log.error('irgendwas stimmt nicht bei Schedule 5 --- Uhrzeit = ' + Uhrzeit);
				this.setState('trigger_5.trigger_5_Start', false, true);

			}
		};


		this.Schedule_6 = async () => {
			const HH = Uhrzeit[0];
			const MM = Uhrzeit[1];

			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59) {
				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + SetSchedule.toString().trim(), async () =>
					this.setState('trigger_6.trigger_6', true, true) && this.log.info('Schedule 6 ausgelöst!')); +
				(this.setState('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + SetWochentage, true) /*&& this.log.info('next Schedule 6 -- ' + this.mySchedule_6.nextInvocation())*/);

			} else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 6 -- ' + HH + ':' + MM);
				this.setState('trigger_6.trigger_6_Start', false, true);

			} else {
				this.log.error('irgendwas stimmt nicht bei Schedule 6 --- Uhrzeit = ' + Uhrzeit);
				this.setState('trigger_6.trigger_6_Start', false, true);

			}
		};

		//Schedule zusammen setzten - ENDE


		//Cancel Schedules
		this.cancelSchedule_1 = async () => {

			try {
				this.HH = Uhrzeit[0];
				this.MM = Uhrzeit[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_1.cancel() && this.log.info('Schedule 1 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					this.log.error('Kein Wochentag gesetzt!');

				}
			} catch (notinuse) {

				this.log.info('Schedule_1_Start ist false');

			}
		};


		this.cancelSchedule_2 = async () => {

			try {
				this.HH = Uhrzeit[0];
				this.MM = Uhrzeit[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_2.cancel() && this.log.info('Schedule 2 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_2_Start ist false');

			}
		};


		this.cancelSchedule_3 = async () => {

			try {
				this.HH = Uhrzeit[0];
				this.MM = Uhrzeit[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_3.cancel() && this.log.info('Schedule 3 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_3_Start ist false');

			}
		};


		this.cancelSchedule_4 = async () => {

			try {
				this.HH = Uhrzeit[0];
				this.MM = Uhrzeit[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_4.cancel() && this.log.info('Schedule 4 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_4_Start ist false');

			}
		};


		this.cancelSchedule_5 = async () => {

			try {
				this.HH = Uhrzeit[0];
				this.MM = Uhrzeit[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_5.cancel() && this.log.info('Schedule 5 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_5_Start ist false');

			}
		};


		this.cancelSchedule_6 = async () => {

			try {
				this.HH = Uhrzeit[0];
				this.MM = Uhrzeit[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_6.cancel() && this.log.info('Schedule 6 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_6_Start ist false');

			}
		};

		//Cancel Schedules ENDE

		//Schedule starten
		this.Schedule_1();

		this.setStateAsync('info.Anzahl', + this.config.Anzahl, true );

		if (this.config.Anzahl == null) {

			this.log.error('Anzahl ist NULL!');

		} else if (this.config.Anzahl !== null) {

			this.log.info('Schedule Anzahl ist -- ' + this.config.Anzahl);

		}

		/*
		//Diese 3 Datenpunkte immer anlegen - unabhängig von der this.config.Anzahl
		//ggf. in die io-package.json aufnehmen?
		await this.setObjectNotExistsAsync('trigger_1.trigger_1', {
			type: 'state',
			common: {
				name: 'trigger_1',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: false,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('trigger_1.trigger_1_is_set', {
			type: 'state',
			common: {
				name: 'trigger_1_is_set',
				type: 'string',
				role: 'text',
				read: true,
				write: false,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('trigger_1.trigger_1_Start', {
			type: 'state',
			common: {
				name: 'trigger_1_Start',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});
		*/

		//Überprüfen ob die Datenpunkte angelegt sind, wenn nicht werden sie neu angelegt
		if (this.config.Anzahl == 1) {

			await this.setObjectNotExistsAsync('trigger_1.trigger_1', {
				type: 'state',
				common: {
					name: 'trigger_1',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_1.trigger_1_is_set', {
				type: 'state',
				common: {
					name: 'trigger_1_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_1.trigger_1_Start', {
				type: 'state',
				common: {
					name: 'trigger_1_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});


			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 1 sind
			const trigger_2 = await this.getObjectAsync('trigger_2.trigger_2') || await this.getObjectAsync('trigger_2.trigger_2_is_set') || await this.getObjectAsync('trigger_2.trigger_2_Start');
			if (trigger_2) {

				//this.log.warn('datenpunkte trigger_2 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_2.trigger_2');
				await this.delObjectAsync('trigger_2.trigger_2_is_set');
				await this.delObjectAsync('trigger_2.trigger_2_Start');

			} else {

				//this.log.warn('datenpunkte trigger_2 existieren NICHT');

			}

			const trigger_3 = await this.getObjectAsync('trigger_3.trigger_3') || await this.getObjectAsync('trigger_3.trigger_3_is_set') || await this.getObjectAsync('trigger_3.trigger_3_Start');
			if (trigger_3) {

				//this.log.warn('datenpunkte trigger_3 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_3.trigger_3');
				await this.delObjectAsync('trigger_3.trigger_3_is_set');
				await this.delObjectAsync('trigger_3.trigger_3_Start');

			} else {

				//this.log.warn('datenpunkte trigger_3 existieren NICHT');

			}

			const trigger_4 = await this.getObjectAsync('trigger_4.trigger_4') || await this.getObjectAsync('trigger_4.trigger_4_is_set') || await this.getObjectAsync('trigger_4.trigger_4_Start');
			if (trigger_4) {

				//this.log.warn('datenpunkte trigger_4 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_4.trigger_4');
				await this.delObjectAsync('trigger_4.trigger_4_is_set');
				await this.delObjectAsync('trigger_4.trigger_4_Start');

			} else {

				//this.log.warn('datenpunkte trigger_4 existieren NICHT');

			}

			const trigger_5 = await this.getObjectAsync('trigger_5.trigger_5') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				//this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_5.trigger_5');
				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');

			} else {

				//this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.trigger_6') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_6.trigger_6');
				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}


		} else if (this.config.Anzahl == 2) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_is_set', {
				type: 'state',
				common: {
					name: 'trigger_2_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_Start', {
				type: 'state',
				common: {
					name: 'trigger_2_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.trigger_2');
			this.subscribeStates('trigger_2.trigger_2_Start');

			this.setState('trigger_2.trigger_2', false, true);
			this.setState('trigger_2.trigger_2_Start', false, true);

			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 2 sind
			const trigger_3 = await this.getObjectAsync('trigger_3.trigger_3') || await this.getObjectAsync('trigger_3.trigger_3_is_set') || await this.getObjectAsync('trigger_3.trigger_3_Start');
			if (trigger_3) {

				this.log.warn('datenpunkte trigger_3 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_3.trigger_3');
				await this.delObjectAsync('trigger_3.trigger_3_is_set');
				await this.delObjectAsync('trigger_3.trigger_3_Start');

			} else {

				this.log.warn('datenpunkte trigger_3 existieren NICHT');

			}

			const trigger_4 = await this.getObjectAsync('trigger_4.trigger_4') || await this.getObjectAsync('trigger_4.trigger_4_is_set') || await this.getObjectAsync('trigger_4.trigger_4_Start');
			if (trigger_4) {

				this.log.warn('datenpunkte trigger_4 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_4.trigger_4');
				await this.delObjectAsync('trigger_4.trigger_4_is_set');
				await this.delObjectAsync('trigger_4.trigger_4_Start');

			} else {

				this.log.warn('datenpunkte trigger_4 existieren NICHT');

			}

			const trigger_5 = await this.getObjectAsync('trigger_5.trigger_5') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_5.trigger_5');
				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');

			} else {

				this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.trigger_6') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_6.trigger_6');
				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.Anzahl == 3) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_is_set', {
				type: 'state',
				common: {
					name: 'trigger_2_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_Start', {
				type: 'state',
				common: {
					name: 'trigger_2_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3', {
				type: 'state',
				common: {
					name: 'trigger_3',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_is_set', {
				type: 'state',
				common: {
					name: 'trigger_3_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_Start', {
				type: 'state',
				common: {
					name: 'trigger_3_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});


			this.subscribeStates('trigger_2.trigger_2');
			this.subscribeStates('trigger_2.trigger_2_Start');

			this.subscribeStates('trigger_3.trigger_3');
			this.subscribeStates('trigger_3.trigger_3_Start');

			this.setState('trigger_2.trigger_2', false, true);
			this.setState('trigger_3.trigger_3', false, true);

			this.setState('trigger_2.trigger_2_Start', false, true);
			this.setState('trigger_3.trigger_3_Start', false, true);


			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 3 sind
			const trigger_4 = await this.getObjectAsync('trigger_4.trigger_4') || await this.getObjectAsync('trigger_4.trigger_4_is_set') || await this.getObjectAsync('trigger_4.trigger_4_Start');
			if (trigger_4) {

				this.log.warn('datenpunkte trigger_4 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_4.trigger_4');
				await this.delObjectAsync('trigger_4.trigger_4_is_set');
				await this.delObjectAsync('trigger_4.trigger_4_Start');

			} else {

				this.log.warn('datenpunkte trigger_4 existieren NICHT');

			}

			const trigger_5 = await this.getObjectAsync('trigger_5.trigger_5') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_5.trigger_5');
				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');

			} else {

				this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.trigger_6') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_6.trigger_6');
				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');

			} else {

				this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.Anzahl == 4) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_is_set', {
				type: 'state',
				common: {
					name: 'trigger_2_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_Start', {
				type: 'state',
				common: {
					name: 'trigger_2_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3', {
				type: 'state',
				common: {
					name: 'trigger_3',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_is_set', {
				type: 'state',
				common: {
					name: 'trigger_3_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_Start', {
				type: 'state',
				common: {
					name: 'trigger_3_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4', {
				type: 'state',
				common: {
					name: 'trigger_4',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4_is_set', {
				type: 'state',
				common: {
					name: 'trigger_4_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4_Start', {
				type: 'state',
				common: {
					name: 'trigger_4_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.trigger_2');
			this.subscribeStates('trigger_2.trigger_2_Start');

			this.subscribeStates('trigger_3.trigger_3');
			this.subscribeStates('trigger_3.trigger_3_Start');

			this.subscribeStates('trigger_4.trigger_4');
			this.subscribeStates('trigger_4.trigger_4_Start');

			this.setState('trigger_2.trigger_2', false, true);
			this.setState('trigger_3.trigger_3', false, true);
			this.setState('trigger_4.trigger_4', false, true);

			this.setState('trigger_2.trigger_2_Start', false, true);
			this.setState('trigger_3.trigger_3_Start', false, true);
			this.setState('trigger_4.trigger_4_Start', false, true);

			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 4 sind
			const trigger_5 = await this.getObjectAsync('trigger_5.trigger_5') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_5.trigger_5');
				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');

			} else {

				this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.trigger_6') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_6.trigger_6');
				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');

			} else {

				this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.Anzahl == 5) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_is_set', {
				type: 'state',
				common: {
					name: 'trigger_2_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_Start', {
				type: 'state',
				common: {
					name: 'trigger_2_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3', {
				type: 'state',
				common: {
					name: 'trigger_3',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_is_set', {
				type: 'state',
				common: {
					name: 'trigger_3_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_Start', {
				type: 'state',
				common: {
					name: 'trigger_3_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4', {
				type: 'state',
				common: {
					name: 'trigger_4',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4_is_set', {
				type: 'state',
				common: {
					name: 'trigger_4_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4_Start', {
				type: 'state',
				common: {
					name: 'trigger_4_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.trigger_5', {
				type: 'state',
				common: {
					name: 'trigger_5',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.trigger_5_is_set', {
				type: 'state',
				common: {
					name: 'trigger_5_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.trigger_5_Start', {
				type: 'state',
				common: {
					name: 'trigger_5_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.trigger_2');
			this.subscribeStates('trigger_2.trigger_2_Start');

			this.subscribeStates('trigger_3.trigger_3');
			this.subscribeStates('trigger_3.trigger_3_Start');

			this.subscribeStates('trigger_4.trigger_4');
			this.subscribeStates('trigger_4.trigger_4_Start');

			this.subscribeStates('trigger_5.trigger_5');
			this.subscribeStates('trigger_5.trigger_5_Start');

			this.setState('trigger_2.trigger_2', false, true);
			this.setState('trigger_3.trigger_3', false, true);
			this.setState('trigger_4.trigger_4', false, true);
			this.setState('trigger_5.trigger_5', false, true);

			this.setState('trigger_2.trigger_2_Start', false, true);
			this.setState('trigger_3.trigger_3_Start', false, true);
			this.setState('trigger_4.trigger_4_Start', false, true);
			this.setState('trigger_5.trigger_5_Start', false, true);

			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 5 sind
			const trigger_6 = await this.getObjectAsync('trigger_6.trigger_6') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_6.trigger_6');
				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');

			} else {

				this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.Anzahl == 6) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_is_set', {
				type: 'state',
				common: {
					name: 'trigger_2_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.trigger_2_Start', {
				type: 'state',
				common: {
					name: 'trigger_2_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3', {
				type: 'state',
				common: {
					name: 'trigger_3',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_is_set', {
				type: 'state',
				common: {
					name: 'trigger_3_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.trigger_3_Start', {
				type: 'state',
				common: {
					name: 'trigger_3_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4', {
				type: 'state',
				common: {
					name: 'trigger_4',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4_is_set', {
				type: 'state',
				common: {
					name: 'trigger_4_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.trigger_4_Start', {
				type: 'state',
				common: {
					name: 'trigger_4_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.trigger_5', {
				type: 'state',
				common: {
					name: 'trigger_5',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.trigger_5_is_set', {
				type: 'state',
				common: {
					name: 'trigger_5_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.trigger_5_Start', {
				type: 'state',
				common: {
					name: 'trigger_5_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_6.trigger_6', {
				type: 'state',
				common: {
					name: 'trigger_6',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_6.trigger_6_is_set', {
				type: 'state',
				common: {
					name: 'trigger_6_is_set',
					type: 'string',
					role: 'text',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_6.trigger_6_Start', {
				type: 'state',
				common: {
					name: 'trigger_6_Start',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.trigger_2');
			this.subscribeStates('trigger_2.trigger_2_Start');

			this.subscribeStates('trigger_3.trigger_3');
			this.subscribeStates('trigger_3.trigger_3_Start');

			this.subscribeStates('trigger_4.trigger_4');
			this.subscribeStates('trigger_4.trigger_4_Start');

			this.subscribeStates('trigger_5.trigger_5');
			this.subscribeStates('trigger_5.trigger_5_Start');

			this.subscribeStates('trigger_5.trigger_6');
			this.subscribeStates('trigger_5.trigger_6_Start');

			this.setState('trigger_2.trigger_2', false, true);
			this.setState('trigger_3.trigger_3', false, true);
			this.setState('trigger_4.trigger_4', false, true);
			this.setState('trigger_5.trigger_5', false, true);
			this.setState('trigger_6.trigger_6', false, true);

			this.setState('trigger_2.trigger_2_Start', false, true);
			this.setState('trigger_3.trigger_3_Start', false, true);
			this.setState('trigger_4.trigger_4_Start', false, true);
			this.setState('trigger_5.trigger_5_Start', false, true);
			this.setState('trigger_6.trigger_6_Start', false, true);
		}
		//Datepunkt abfragen erstellen / löschen ENDE
		//*****************************************

		await this.setObjectNotExistsAsync('info.SetTrigger', {
			type: 'state',
			common: {
				name: 'SetTrigger',
				type: 'string',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});

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

		//Datenpunkt trigger 1 auf false setzen
		this.setState('trigger_1.trigger_1', false, true);
		this.setState('trigger_1.trigger_1_Start', false, true);

		//hier werden Datenpunkt Änderungen im Log angezeigt

		this.subscribeStates('Zeitplan.Uhrzeit1');

		this.subscribeStates('info.SetTrigger');

		this.subscribeStates('trigger_1.trigger_1');
		this.subscribeStates('trigger_1.trigger_1_Start');

		this.subscribeStates('Wochentage.Montag');
		this.subscribeStates('Wochentage.Dienstag');
		this.subscribeStates('Wochentage.Mittwoch');
		this.subscribeStates('Wochentage.Donnerstag');
		this.subscribeStates('Wochentage.Freitag');
		this.subscribeStates('Wochentage.Samstag');
		this.subscribeStates('Wochentage.Sonntag');

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
			this.log.info('Adapter gestoppt! - Alle Schedules gelöscht!');

			callback();
		} catch (e) {
			callback();
		}
	}

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

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */

	async onStateChange(id, state) {

		if (state) {

			//bei Änderung der Datenpunkte true oder false auswerten
			const SUN = await this.getStateAsync('Wochentage.Sonntag');
			const statusSUN = SUN ? SUN.val: false;

			const Sunday = async () => {
				if (statusSUN == true) {
					this.log.info('SO ist ' + statusSUN);
				} else if (statusSUN == false) {
					this.log.info('So ist ' + statusSUN);
				} else {
					this.log.error('Error SO = ' + statusSUN);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Sonntag') {
				Sunday();
			}

			const MON = await this.getStateAsync('Wochentage.Montag');
			const statusMON = MON ? MON.val: false;

			const Monday = async () => {
				if (statusMON == true) {
					this.log.info('MO ist ' + statusMON);
				} else if (statusMON == false) {
					this.log.info('MO ist ' + statusMON);
				} else {
					this.log.error('Error MO = ' + statusMON);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Montag') {
				Monday();
			}

			const TUE = await this.getStateAsync('Wochentage.Dienstag');
			const statusTUE = TUE ? TUE.val: false;

			const Tuesday = async () => {
				if (statusTUE == true) {
					this.log.info('DI ist ' + statusTUE);
				} else if (statusTUE == false) {
					this.log.info('DI ist ' + statusTUE);
				} else {
					this.log.error('Error DI = ' + statusTUE);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Dienstag') {
				Tuesday();
			}

			const WED = await this.getStateAsync('Wochentage.Mittwoch');
			const statusWED = WED ? WED.val: false;

			const Wednesday = async () => {
				if (statusWED == true) {
					this.log.info('MI ist ' + statusWED);
				} else if (statusWED == false) {
					this.log.info('MI ist ' + statusWED);
				} else {
					this.log.error('Error MI = ' + statusWED);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Mittwoch') {
				Wednesday();
			}

			const THU = await this.getStateAsync('Wochentage.Donnerstag');
			const statusTHU = THU ? THU.val: false;

			const Thursday = async () => {
				if (statusTHU == true) {
					this.log.info('DO ist ' + statusTHU);
				} else if (statusTHU == false) {
					this.log.info('DO ist ' + statusTHU);
				} else {
					this.log.error('Error DO = ' + statusTHU);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Donnerstag') {
				Thursday();
			}

			const FRI = await this.getStateAsync('Wochentage.Freitag');
			const statusFRI = FRI ? FRI.val: false;

			const Friday = async () => {
				if (statusFRI == true) {
					this.log.info('FR ist ' + statusFRI);
				} else if (statusFRI == false) {
					this.log.info('FR ist ' + statusFRI);
				} else {
					this.log.error('Error FR = ' + statusFRI);
				}};

			if (id == 'time_switch_clock.0.Wochentage.Freitag') {
				Friday();
			}

			const SAT = await this.getStateAsync('Wochentage.Samstag');
			const statusSAT = SAT ? SAT.val: true;

			const Saturday = async () => {
				if (statusSAT == true) {
					this.log.info ('SA ist ' + statusSAT);
				} else if (statusSAT == false) {
					this.log.info('SA ist ' + statusSAT);
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

			//Uhrzeit geändert:
			const Uhrzeit_1 = await this.getStateAsync('Zeitplan.Uhrzeit1');
			if (Uhrzeit_1) {

				const status_Uhrzeit_1 = Uhrzeit_1.val;
				const [HH_1, MM_1] = status_Uhrzeit_1.split(':');

				Uhrzeit.splice(0,1, HH_1);
				Uhrzeit.splice(1,1, MM_1);

			} else {

				this.log.error('Uhrzeit1 Error');

			}

			//trigger_1_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Wochentage Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_1Start_test = await this.getObjectAsync('trigger_1.trigger_1_Start');

			if (trigger_1Start_test) {

				const triggerStart_1 = await this.getStateAsync('trigger_1.trigger_1_Start');
				const StatusTriggerStart = triggerStart_1.val;

				const SetTrigger_1 = await this.getStateAsync('info.SetTrigger');
				const SetTrigger_now_1 = SetTrigger_1 ? SetTrigger_1.val: false;

				const triggerStartAction_true = async () => {
					if (StatusTriggerStart == true && SetSchedule.length !== 0 && SetTrigger_now_1 == 1) {

						this.Schedule_1();
						//this.SetMyTrigger(); siehe oebn - brauch man das?

					} else if (StatusTriggerStart == true && SetSchedule.length == 0) {

						this.setState('trigger_1.trigger_1_is_set', 'not scheduled', true);
						this.cancelSchedule_1();

					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_1();
						this.setState('trigger_1.trigger_1_is_set', 'not scheduled', true);

					}};

				triggerStartAction_true();

			} else {

				this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_2_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Wochentage Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_2Start_test = await this.getObjectAsync('trigger_2.trigger_2_Start');

			if (trigger_2Start_test) {

				const triggerStart_2 = await this.getStateAsync('trigger_2.trigger_2_Start');
				const StatusTriggerStart2 = triggerStart_2.val;

				const SetTrigger_2 = await this.getStateAsync('info.SetTrigger');
				const SetTrigger_now_2 = SetTrigger_2.val;

				const triggerStartAction_2_true = async () => {
					if (StatusTriggerStart2 == true && SetSchedule.length !== 0 && SetTrigger_now_2 == 2) {

						this.Schedule_2();

					} else if (StatusTriggerStart2 == true && SetSchedule.length == 0) {

						this.setState('trigger_2.trigger_2_is_set', 'not scheduled', true);
						this.cancelSchedule_2();

					} else if (StatusTriggerStart2 == false) {

						this.cancelSchedule_2();
						this.setState('trigger_2.trigger_2_is_set', 'not scheduled', true);

					}};

				triggerStartAction_2_true();

			} else {

				this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_3_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Wochentage Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_3Start_test = await this.getObjectAsync('trigger_3.trigger_3_Start');

			if (trigger_3Start_test) {

				const triggerStart_3 = await this.getStateAsync('trigger_3.trigger_3_Start');
				const StatusTriggerStart3 = triggerStart_3.val;

				const SetTrigger_3 = await this.getStateAsync('info.SetTrigger');
				const SetTrigger_now_3 = SetTrigger_3.val;

				const triggerStartAction_3_true = async () => {
					if (StatusTriggerStart3 == true && SetSchedule.length !== 0 && SetTrigger_now_3 == 3) {

						this.Schedule_3();

					} else if (StatusTriggerStart3 == true && SetSchedule.length == 0) {

						this.setState('trigger_3.trigger_3_is_set', 'not scheduled', true);
						this.cancelSchedule_3();

					} else if (StatusTriggerStart3 == false) {

						this.cancelSchedule_3();
						this.setState('trigger_3.trigger_3_is_set', 'not scheduled', true);

					}};

				triggerStartAction_3_true();

			} else {

				this.log.error('datenpunkte trigger_3 existieren NICHT');

			}


			//trigger_4_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Wochentage Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll


			const trigger_4Start_test = await this.getObjectAsync('trigger_4.trigger_4_Start');

			if (trigger_4Start_test) {

				//this.log.error('datenpunkte trigger_4 existieren alles ok!');

				const triggerStart_4 = await this.getStateAsync('trigger_4.trigger_4_Start');
				const StatusTriggerStart4 = triggerStart_4.val;

				const SetTrigger_4 = await this.getStateAsync('info.SetTrigger');
				const SetTrigger_now_4 = SetTrigger_4.val;

				const triggerStartAction_4_true = async () => {

					if (StatusTriggerStart4 == true && SetSchedule.length !== 0 && SetTrigger_now_4 == 4) {

						this.Schedule_4();

					} else if (StatusTriggerStart4 == true && SetSchedule.length == 0) {

						this.setState('trigger_4.trigger_4_is_set', 'not scheduled', true);
						this.cancelSchedule_4();

					} else if (StatusTriggerStart4 == false) {

						this.cancelSchedule_4();
						this.setState('trigger_4.trigger_4_is_set', 'not scheduled', true);

					}

				};

				triggerStartAction_4_true();

			} else {

				this.log.error('datenpunkte trigger_4 existieren NICHT');

			}



			//trigger_5_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Wochentage Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_5Start_test = await this.getObjectAsync('trigger_5.trigger_5_Start');

			if (trigger_5Start_test) {

				const triggerStart_5 = await this.getStateAsync('trigger_5.trigger_5_Start');
				const StatusTriggerStart5 = triggerStart_5.val;

				const SetTrigger_5 = await this.getStateAsync('info.SetTrigger');
				const SetTrigger_now_5 = SetTrigger_5.val;

				const triggerStartAction_5_true = async () => {

					if (StatusTriggerStart5 == true && SetSchedule.length !== 0 && SetTrigger_now_5 == 5) {

						this.Schedule_5();

					} else if (StatusTriggerStart5 == true && SetSchedule.length == 0) {

						this.setState('trigger_5.trigger_5_is_set', 'not scheduled', true);
						this.cancelSchedule_5();

					} else if (StatusTriggerStart5 == false) {

						this.cancelSchedule_5();
						this.setState('trigger_5.trigger_5_is_set', 'not scheduled', true);

					}

				};

				triggerStartAction_5_true();

			} else {

				this.log.error('datenpunkte trigger_5 existieren NICHT');

			}


			//trigger_6_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Wochentage Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_6Start_test = await this.getObjectAsync('trigger_6.trigger_6_Start');

			if (trigger_6Start_test) {

				const triggerStart_6 = await this.getStateAsync('trigger_6.trigger_6_Start');
				const StatusTriggerStart6 = triggerStart_6.val;

				const SetTrigger_6 = await this.getStateAsync('info.SetTrigger');
				const SetTrigger_now_6 = SetTrigger_6.val;

				const triggerStartAction_6_true = async () => {

					if (StatusTriggerStart6 == true && SetSchedule.length !== 0 && SetTrigger_now_6 == 6) {

						this.Schedule_6();

					} else if (StatusTriggerStart6 == true && SetSchedule.length == 0) {

						this.setState('trigger_6.trigger_6_is_set', 'not scheduled', true);
						this.cancelSchedule_6();

					} else if (StatusTriggerStart6 == false) {

						this.cancelSchedule_6();
						this.setState('trigger_6.trigger_6_is_set', 'not scheduled', true);

					}

				};

				triggerStartAction_6_true();

			} else {

				this.log.error('datenpunkte trigger_6 existieren NICHT');

			}










			//trigger_1 Datenpunkt wenn true - wieder auf false setzen - weil nur als Auslöser gedacht für z.B. Blockly
			const triggerState = await this.getStateAsync('trigger_1.trigger_1');
			const StatusTrigger = triggerState.val;

			const triggerAction_true = async () => {
				if (StatusTrigger == true) {

					this.log.info('StatusTrigger 1 -- ' + StatusTrigger);
					this.setState('trigger_1.trigger_1', false, true);

				} else if (StatusTrigger == false) {

					//this.log.info('Trigger 1 wurde wieder auf ' + StatusTrigger + ' gesetzt');

				} else {
					this.log.error('Error StatusTrigger 1 ' + StatusTrigger);
				}};

			triggerAction_true();

			SetSchedule.sort();
			SetWochentage.sort();

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
