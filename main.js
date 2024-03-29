// @ts-nocheck
'use strict';

//const { Adapter } = require('@iobroker/adapter-core');
/*
 * Created with @iobroker/create-adapter v2.1.1
 */

const utils = require('@iobroker/adapter-core');
const schedule = require('node-schedule');
//const { stringify } = require('querystring');
const SetWeekdays = [];
const SetSchedule = [];
const Time = [];

//Array für Zeit pro Schedule
const time_t1arr = [];
const time_t2arr = [];
const time_t3arr = [];
const time_t4arr = [];
const time_t5arr = [];
const time_t6arr = [];

//Array für Wochentage pro Schedule
let weekdays_t1arr = [];
let weekdays_t2arr = [];
let weekdays_t3arr = [];
let weekdays_t4arr = [];
let weekdays_t5arr = [];
let weekdays_t6arr = [];

//Array für Datenpunkte die geschaltet werden sollen - goforit
let DP_1arr = [];
let DP_2arr = [];
let DP_3arr = [];
let DP_4arr = [];
let DP_5arr = [];
let DP_6arr = [];

//Array für typeof.Datenpunkte die in goforit eingetragen sind / number oder string oder boolean
let typeofarr1 = [];


//Zeit bis der Timer Datenpunkt wieder auf false gesetzt wird in Sekunden
let timer_t1arr = [];
let timer_t2arr = [];
let timer_t3arr = [];
let timer_t4arr = [];
let timer_t5arr = [];
let timer_t6arr = [];

//nach SetTimeout die TimeOut ID in Array schreiben
let stopp_timer1_arr = [];
let stopp_timer2_arr = [];
let stopp_timer3_arr = [];
let stopp_timer4_arr = [];
let stopp_timer5_arr = [];
let stopp_timer6_arr = [];

//extended Datapoints Trigger 1
let t1_true_arr = [];
let t1_false_arr = [];

//extended Datapoints Trigger 2
let t2_true_arr = [];
let t2_false_arr = [];

//extended Datapoints Trigger 3
let t3_true_arr = [];
let t3_false_arr = [];

//extended Datapoints Trigger 4
let t4_true_arr = [];
let t4_false_arr = [];

//extended Datapoints Trigger 5
let t5_true_arr = [];
let t5_false_arr = [];

//extended Datapoints Trigger 6
let t6_true_arr = [];
let t6_false_arr = [];


//nach SetTimeout die TimeOut ID in Array schreiben um SetTrigger wieder auf '0' zu setzten
let SetTrigger_Stop_arr = [];


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
		this.log.info('Adapter TimeSwitchClock gestartet!');


		//Die Anzahl der Trigger die in der Konfig ausgewählt wurde
		this.setStateAsync('Setup.number_of_triggers', + this.config.numberoftriggers, true);

		if (this.config.numberoftriggers == null) {

			this.log.error('numberoftriggers is NULL!');

		} else if (this.config.numberoftriggers !== null) {

			this.log.info('Schedule Anzahl ist -- ' + this.config.numberoftriggers);

		}


		//Überprüfen ob die Datenpunkte angelegt sind, wenn nicht werden sie neu angelegt
		//in Abhängigkeit zur Anzahl der Trigger die in der this.config eingestellt sind
		for (let i = 1; i <= this.config.numberoftriggers; i++) {

			//Datenpunkte erstellen - in Abhängigkeit wie viele in numberoftriggers eingestellt sind

			await this.setObjectNotExistsAsync('trigger_' + i, {
				type: 'folder',
				common: {
					name: 'trigger_' + i,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_' + i + '.trigger_' + i + '_is_set', {
				type: 'state',
				common: {
					name: 'trigger_' + i + '_is_set',
					type: 'string',
					role: 'state',
					read: true,
					write: false,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_' + i + '.trigger_' + i + '_Start', {
				type: 'state',
				common: {
					name: 'trigger_' + i + '_Start',
					type: 'boolean',
					role: 'state',
					def: false,
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_' + i + '.t' + i + '_weekdays', {
				type: 'state',
				common: {
					name: 't' + i + '_weekdays',
					type: 'array',
					role: 'list',
					def: '[0,6]',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_' + i + '.t' + i + '_time', {
				type: 'state',
				common: {
					name: 't' + i + '_time',
					type: 'string',
					role: 'state',
					def: '00:00',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_' + i + '.goforit_' + i, {
				type: 'state',
				common: {
					name: 'goforit_' + i,
					type: 'string',
					role: 'state',
					def: 'please_Set',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_' + i + '.timer_' + i, {
				type: 'state',
				common: {
					name: 'timer_' + i,
					type: 'number',
					role: 'state',
					def: i,
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_' + i + '.trigger_' + i + '_Start');
			this.subscribeStates('trigger_' + i + '.goforit_' + i);
			this.subscribeStates('trigger_' + i + '.timer_' + i);

			this.setStateAsync('trigger_' + i + '.trigger_' + i + '_Start', false, true);

		}



		for (let del = 6; del > this.config.numberoftriggers; del--) {

			//Überflüssige Datenpunkte löschen - alle die > numberoftriggers Anzahl ist, werden gelöscht

			this.delObjectAsync('trigger_' + del, { recursive: true });

		}

		//Datenpunkte für Trigger erstellen/löschen Ende


		//Permanente Datenpunkte erstellen
		await this.setObjectNotExistsAsync('Setup.HH', {
			type: 'state',
			common: {
				name: 'HH',
				type: 'string',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		this.setStateAsync('Setup.HH', '00', true);

		await this.setObjectNotExistsAsync('Setup.mm', {
			type: 'state',
			common: {
				name: 'mm',
				type: 'string',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		this.setStateAsync('Setup.mm', '00', true);

		await this.setObjectNotExistsAsync('Setup.SetTrigger', {
			type: 'state',
			common: {
				name: 'SetTrigger',
				type: 'string',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Weekdays.07_Sunday', {
			type: 'state',
			common: {
				name: 'Sunday',
				type: 'boolean',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Weekdays.01_Monday', {
			type: 'state',
			common: {
				name: 'Monday',
				type: 'boolean',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Weekdays.02_Tuesday', {
			type: 'state',
			common: {
				name: 'Tuesday',
				type: 'boolean',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Weekdays.03_Wednesday', {
			type: 'state',
			common: {
				name: 'Wednesday',
				type: 'boolean',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Weekdays.04_Thursday', {
			type: 'state',
			common: {
				name: 'Thursday',
				type: 'boolean',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Weekdays.05_Friday', {
			type: 'state',
			common: {
				name: 'Friday',
				type: 'boolean',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('Weekdays.06_Saturday', {
			type: 'state',
			common: {
				name: 'Saturday',
				type: 'boolean',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		//Permanente Datenpunkte erstellen ENDE


		//extended Datapoint setup:

		//Extended DP for Trigger 1:
		if (this.config.extended_Datapoints_T1 == true) {

			this.log.info('extended_Datapoints - are enabled for Trigger 1');

			await this.setObjectNotExistsAsync('trigger_1.01_t1_true', {
				type: 'state',
				common: {
					name: 't1_true',
					type: 'string',
					role: 'state',
					def: 'true',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_1.01_t1_true');


			await this.setObjectNotExistsAsync('trigger_1.02_t1_false', {
				type: 'state',
				common: {
					name: 't1_false',
					type: 'string',
					role: 'state',
					def: 'false',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_1.02_t1_false');


		} else if (this.config.extended_Datapoints_T1 == false) {

			await this.delObjectAsync('trigger_1.01_t1_true');
			await this.delObjectAsync('trigger_1.02_t1_false');

		}


		//Extended DP for Trigger 2:
		if (this.config.extended_Datapoints_T2 == true && this.config.numberoftriggers >= 2) {

			this.log.info('extended_Datapoints - are enabled for Trigger 2');

			await this.setObjectNotExistsAsync('trigger_2.01_t2_true', {
				type: 'state',
				common: {
					name: 't2_true',
					type: 'string',
					role: 'state',
					def: 'true',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.01_t2_true');


			await this.setObjectNotExistsAsync('trigger_2.02_t2_false', {
				type: 'state',
				common: {
					name: 't2_false',
					type: 'string',
					role: 'state',
					def: 'false',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.02_t2_false');


		} else if (this.config.extended_Datapoints_T2 == false || this.config.numberoftriggers < 2) {

			await this.delObjectAsync('trigger_2.01_t2_true');
			await this.delObjectAsync('trigger_2.02_t2_false');

		}


		//Extended DP for Trigger 3:
		if (this.config.extended_Datapoints_T3 == true && this.config.numberoftriggers >= 3) {

			this.log.info('extended_Datapoints - are enabled for Trigger 3');

			await this.setObjectNotExistsAsync('trigger_3.01_t3_true', {
				type: 'state',
				common: {
					name: 't3_true',
					type: 'string',
					role: 'state',
					def: 'true',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_3.01_t3_true');


			await this.setObjectNotExistsAsync('trigger_3.02_t3_false', {
				type: 'state',
				common: {
					name: 't3_false',
					type: 'string',
					role: 'state',
					def: 'false',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_3.02_t3_false');


		} else if (this.config.extended_Datapoints_T3 == false || this.config.numberoftriggers < 3) {

			await this.delObjectAsync('trigger_3.01_t3_true');
			await this.delObjectAsync('trigger_3.02_t3_false');

		}


		//Extended DP for Trigger 4:
		if (this.config.extended_Datapoints_T4 == true && this.config.numberoftriggers >= 4) {

			this.log.info('extended_Datapoints - are enabled for Trigger 4');

			await this.setObjectNotExistsAsync('trigger_4.01_t4_true', {
				type: 'state',
				common: {
					name: 't4_true',
					type: 'string',
					role: 'state',
					def: 'true',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_4.01_t4_true');


			await this.setObjectNotExistsAsync('trigger_4.02_t4_false', {
				type: 'state',
				common: {
					name: 't4_false',
					type: 'string',
					role: 'state',
					def: 'false',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_4.02_t4_false');


		} else if (this.config.extended_Datapoints_T4 == false || this.config.numberoftriggers < 4) {

			await this.delObjectAsync('trigger_4.01_t4_true');
			await this.delObjectAsync('trigger_4.02_t4_false');

		}


		//Extended DP for Trigger 5:
		if (this.config.extended_Datapoints_T5 == true && this.config.numberoftriggers >= 5) {

			this.log.info('extended_Datapoints - are enabled for Trigger 5');

			await this.setObjectNotExistsAsync('trigger_5.01_t5_true', {
				type: 'state',
				common: {
					name: 't5_true',
					type: 'string',
					role: 'state',
					def: 'true',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_5.01_t5_true');


			await this.setObjectNotExistsAsync('trigger_5.02_t5_false', {
				type: 'state',
				common: {
					name: 't5_false',
					type: 'string',
					role: 'state',
					def: 'false',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_5.02_t5_false');


		} else if (this.config.extended_Datapoints_T5 == false || this.config.numberoftriggers < 5) {

			await this.delObjectAsync('trigger_5.01_t5_true');
			await this.delObjectAsync('trigger_5.02_t5_false');

		}


		//Extended DP for Trigger 6:
		if (this.config.extended_Datapoints_T6 == true && this.config.numberoftriggers == 6) {

			this.log.info('extended_Datapoints - are enabled for Trigger 6');

			await this.setObjectNotExistsAsync('trigger_6.01_t6_true', {
				type: 'state',
				common: {
					name: 't6_true',
					type: 'string',
					role: 'state',
					def: 'true',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_6.01_t6_true');


			await this.setObjectNotExistsAsync('trigger_6.02_t6_false', {
				type: 'state',
				common: {
					name: 't6_false',
					type: 'string',
					role: 'state',
					def: 'false',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_6.02_t6_false');


		} else if (this.config.extended_Datapoints_T6 == false || this.config.numberoftriggers < 6) {

			await this.delObjectAsync('trigger_6.01_t6_true');
			await this.delObjectAsync('trigger_6.02_t6_false');

		}

		//extended Datapoints ENDE


		//States der Datenpunkte auslesen:
		const SUN = await this.getStateAsync('Weekdays.07_Sunday');
		const statusSUN = SUN ? SUN.val : true;

		const MON = await this.getStateAsync('Weekdays.01_Monday');
		const statusMON = MON ? MON.val : false;

		const TUE = await this.getStateAsync('Weekdays.02_Tuesday');
		const statusTUE = TUE ? TUE.val : false;

		const WED = await this.getStateAsync('Weekdays.03_Wednesday');
		const statusWED = WED ? WED.val : false;

		const THU = await this.getStateAsync('Weekdays.04_Thursday');
		const statusTHU = THU ? THU.val : false;

		const FRI = await this.getStateAsync('Weekdays.05_Friday');
		const statusFRI = FRI ? FRI.val : false;

		const SAT = await this.getStateAsync('Weekdays.06_Saturday');
		const statusSAT = SAT ? SAT.val : true;


		//Wochentage auf einen Wert setzten

		this.setStateAsync('Weekdays.01_Monday', false, true);
		this.setStateAsync('Weekdays.02_Tuesday', false, true);
		this.setStateAsync('Weekdays.03_Wednesday', false, true);
		this.setStateAsync('Weekdays.04_Thursday', false, true);
		this.setStateAsync('Weekdays.05_Friday', false, true);
		this.setStateAsync('Weekdays.06_Saturday', true, true);
		this.setStateAsync('Weekdays.07_Sunday', true, true);

		//Setup.SetTrigger auf 0 setzen - somit wird keine Uhrzeit oder Wochentag versehentlich verstellt
		//wenn an Uhrzeit oder Wochentagen etwas geändert wird
		this.setStateAsync('Setup.SetTrigger', '0', true);

		//hier werden Datenpunkt Änderungen im Log angezeigt

		this.subscribeStates('Setup.HH');
		this.subscribeStates('Setup.mm');

		this.subscribeStates('Setup.SetTrigger');

		//this.subscribeStates('trigger_1.trigger_1');
		this.subscribeStates('trigger_1.trigger_1_Start');

		this.subscribeStates('Weekdays.07_Sunday');
		this.subscribeStates('Weekdays.01_Monday');
		this.subscribeStates('Weekdays.02_Tuesday');
		this.subscribeStates('Weekdays.03_Wednesday');
		this.subscribeStates('Weekdays.04_Thursday');
		this.subscribeStates('Weekdays.05_Friday');
		this.subscribeStates('Weekdays.06_Saturday');


		//in Array einfügen oder löschen wenn false
		//Sunday
		if (statusSUN == true) {
			SetWeekdays[0] = 'Sunday';
			SetSchedule[0] = 0;

		} else if (statusSUN == false) {
			SetWeekdays[0] = '';

		} else {
			this.log.error('else... ' + statusSUN);
		}

		//Monday
		if (statusMON == true) {
			SetWeekdays[1] = 'Monday';
			SetSchedule[1] = 1;

		} else if (statusMON == false) {
			SetWeekdays[1] = '';

		} else {
			this.log.error('else... ' + statusMON);
		}

		//Tuesday
		if (statusTUE == true) {
			SetWeekdays[2] = 'Tuesday';
			SetSchedule[2] = 2;

		} else if (statusTUE == false) {
			SetWeekdays[2] = '';

		} else {
			this.log.error('else... ' + statusTUE);
		}

		//Wednesday
		if (statusWED == true) {
			SetWeekdays[3] = 'Wednesday';
			SetSchedule[3] = 3;

		} else if (statusWED == false) {
			SetWeekdays[3] = '';

		} else {
			this.log.error('else... ' + statusWED);
		}

		//Thursday
		if (statusTHU == true) {
			SetWeekdays[4] = 'Thursday';
			SetSchedule[4] = 4;

		} else if (statusTHU == false) {
			SetWeekdays[4] = '';

		} else {
			this.log.error('else... ' + statusTHU);
		}

		//Friday
		if (statusFRI == true) {
			SetWeekdays[5] = 'Friday';
			SetSchedule[5] = 5;

		} else if (statusFRI == false) {
			SetWeekdays[5] = '';

		} else {
			this.log.error('else... ' + statusFRI);
		}

		//Saturday
		if (statusSAT == true) {
			SetWeekdays[6] = 'Saturday';
			SetSchedule[6] = 6;

		} else if (statusSAT == false) {
			SetWeekdays[6] = '';

		} else {
			this.log.error('else... ' + statusSAT);
		}


		/*vereinfachung von this.Schedule_1 bis this.Schedule_6*/

		const createSchedule = async (scheduleNumber, timeArr, setTrigger, setSchedule, weekdaysArr, dpArr, trueArr) => {
			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val : '0';

			const HH = timeArr[0];
			const MM = timeArr[1];

			const WDays = [setSchedule];

			let setDataPoint = [trueArr];

			if (setDataPoint == 'true' || setDataPoint == '') {
				setDataPoint = true;
			} else {
				setDataPoint = trueArr;
			}

			const WDaysArr = [weekdaysArr];
			const goAndTrigger = [dpArr];

			if (
				HH >= 0 &&
				HH <= 23 &&
				MM >= 0 &&
				MM <= 59 &&
				typeof this['mySchedule_' + scheduleNumber] !== 'undefined' &&
				SetTrigger == scheduleNumber &&
				setSchedule.length !== 0
			) {
				this['mySchedule_' + scheduleNumber].cancel();
				this['mySchedule_' + scheduleNumber] = schedule.scheduleJob(
					MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDays.toString().trim(),
					async () => this.setForeignStateAsync(goAndTrigger.toString(), setDataPoint) && this['Schedule_' + scheduleNumber + '_go']()
				);
				this.setStateAsync('trigger_' + scheduleNumber + '.trigger_' + scheduleNumber + '_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);
			} else if (
				HH >= 0 &&
				HH <= 23 &&
				MM >= 0 &&
				MM <= 59 &&
				typeof this['mySchedule_' + scheduleNumber] == 'undefined' &&
				SetTrigger == scheduleNumber &&
				setSchedule.length !== 0
			) {
				this['mySchedule_' + scheduleNumber] = schedule.scheduleJob(
					MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDays.toString().trim(),
					async () => this.setForeignStateAsync(goAndTrigger.toString(), setDataPoint) && this['Schedule_' + scheduleNumber + '_go']()
				);
				this.setStateAsync('trigger_' + scheduleNumber + '.trigger_' + scheduleNumber + '_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);
			} else if (
				HH >= 0 &&
				HH <= 23 &&
				MM >= 0 &&
				MM <= 59 &&
				typeof this['mySchedule_' + scheduleNumber] !== 'undefined' &&
				SetTrigger !== scheduleNumber &&
				weekdaysArr.length !== 0
			) {
				this['mySchedule_' + scheduleNumber].cancel();
				this['mySchedule_' + scheduleNumber] = schedule.scheduleJob(
					MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDaysArr.toString().trim(),
					async () => this.setForeignStateAsync(goAndTrigger.toString(), setDataPoint) && this['Schedule_' + scheduleNumber + '_go']()
				);
				this.setStateAsync('trigger_' + scheduleNumber + '.trigger_' + scheduleNumber + '_is_set', '' + HH + ':' + MM + ' -- ' + WDaysArr, true);
			} else if (
				HH >= 0 &&
				HH <= 23 &&
				MM >= 0 &&
				MM <= 59 &&
				typeof this['mySchedule_' + scheduleNumber] == 'undefined' &&
				SetTrigger !== scheduleNumber &&
				weekdaysArr.length !== 0
			) {
				this['mySchedule_' + scheduleNumber] = schedule.scheduleJob(
					MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDaysArr.toString().trim(),
					async () => this.setForeignStateAsync(goAndTrigger.toString(), setDataPoint) && this['Schedule_' + scheduleNumber + '_go']()
				);
				this.setStateAsync('trigger_' + scheduleNumber + '.trigger_' + scheduleNumber + '_is_set', '' + HH + ':' + MM + ' -- ' + WDaysArr, true);
			} else if (setSchedule.length == 0 || weekdaysArr.length == 0) {
				this.log.error('Kein Wochentag gesetzt bei Schedule ' + scheduleNumber);
				this.setStateAsync('trigger_' + scheduleNumber + '.trigger_' + scheduleNumber + '_Start', false, true);
			} else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {
				this.log.error('Uhrzeit stimmt nicht! bei Schedule ' + scheduleNumber + ' -- ' + HH + ':' + MM);
				this.setStateAsync('trigger_' + scheduleNumber + '.trigger_' + scheduleNumber + '_Start', false, true);
			} else {
				this.log.error('irgendwas stimmt nicht bei Schedule ' + scheduleNumber + ' -- Uhrzeit ' + HH + ':' + MM);
				this.setStateAsync('trigger_' + scheduleNumber + '.trigger_' + scheduleNumber + '_Start', false, true);
			}
		};

		this.Schedule_1 = async () => {
			await createSchedule(1, time_t1arr, 'Setup.SetTrigger', SetSchedule, weekdays_t1arr, DP_1arr, t1_true_arr);
		};

		this.Schedule_2 = async () => {
			await createSchedule(2, time_t2arr, 'Setup.SetTrigger', SetSchedule, weekdays_t2arr, DP_2arr, t2_true_arr);
		};

		this.Schedule_3 = async () => {
			await createSchedule(3, time_t3arr, 'Setup.SetTrigger', SetSchedule, weekdays_t3arr, DP_3arr, t3_true_arr);
		};

		this.Schedule_4 = async () => {
			await createSchedule(4, time_t4arr, 'Setup.SetTrigger', SetSchedule, weekdays_t4arr, DP_4arr, t4_true_arr);
		};

		this.Schedule_5 = async () => {
			await createSchedule(5, time_t5arr, 'Setup.SetTrigger', SetSchedule, weekdays_t5arr, DP_5arr, t5_true_arr);
		};

		this.Schedule_6 = async () => {
			await createSchedule(6, time_t6arr, 'Setup.SetTrigger', SetSchedule, weekdays_t6arr, DP_6arr, t6_true_arr);
		};

		/*Hier werden die Schedules ausgelöst, nachdem der Timer abgelaufen ist:*/
		/***********************************************************************/

		const runSchedule = async (scheduleNumber, timer, setdatapoint_false, datapoint) => {
			this.log.info(`Schedule ${scheduleNumber} ausgelöst!`);

			let setdatapoint = setdatapoint_false;

			if (setdatapoint_false == 'false' || setdatapoint_false == '') {
				setdatapoint = false;
			}

			const wait = setTimeout(() => {
				this.log.info(`Schedule ${scheduleNumber} auf false gesetzt! - ${timer} Minuten später`);
				this.setForeignState(datapoint.toString(), setdatapoint);
			}, timer * 10000);

			return wait;
		};

		this.Schedule_1_go = async () => {
			const waitS1 = await runSchedule(1, timer_t1arr, t1_false_arr, DP_1arr);
			stopp_timer1_arr = waitS1;
		};

		this.Schedule_2_go = async () => {
			const waitS2 = await runSchedule(2, timer_t2arr, t2_false_arr, DP_2arr);
			stopp_timer2_arr = waitS2;
		};

		this.Schedule_3_go = async () => {
			const waitS3 = await runSchedule(3, timer_t3arr, t3_false_arr, DP_3arr);
			stopp_timer3_arr = waitS3;
		};

		this.Schedule_4_go = async () => {
			const waitS4 = await runSchedule(4, timer_t4arr, t4_false_arr, DP_4arr);
			stopp_timer4_arr = waitS4;
		};

		this.Schedule_5_go = async () => {
			const waitS5 = await runSchedule(5, timer_t5arr, t5_false_arr, DP_5arr);
			stopp_timer5_arr = waitS5;
		};

		this.Schedule_6_go = async () => {
			const waitS6 = await runSchedule(6, timer_t6arr, t6_false_arr, DP_6arr);
			stopp_timer6_arr = waitS6;
		};

		/***********************************************************************/
		//Schedule zusammen setzten - ENDE *************************************

	}

	//onReady Ende


	//Cancel Schedules Start
	//hier weiter...

	async cancelSchedule(x) {
		const timeArr = [time_t1arr, time_t2arr, time_t3arr, time_t4arr, time_t5arr, time_t6arr];
		const myScheduleArr = [this.mySchedule_1, this.mySchedule_2, this.mySchedule_3, this.mySchedule_4, this.mySchedule_5, this.mySchedule_6];

		if (x >= 1 && x <= 6) {
			const HH = timeArr[x - 1][0];
			const MM = timeArr[x - 1][1];

			if (
				SetSchedule.length !== 0 &&
				HH >= 0 && HH <= 23 &&
				MM >= 0 && MM <= 59 &&
				typeof myScheduleArr[x - 1] !== 'undefined'
			) {
				myScheduleArr[x - 1].cancel();

			}
		}
	}

	//Cancel Schedules ENDE

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active

			//this.setStateAsync('info.connection', { val: false, ack: true });
			schedule.gracefulShutdown();

			this.clearTimeout(SetTrigger_Stop_arr);
			this.clearTimeout(stopp_timer1_arr);
			this.clearTimeout(stopp_timer2_arr);
			this.clearTimeout(stopp_timer3_arr);
			this.clearTimeout(stopp_timer4_arr);
			this.clearTimeout(stopp_timer5_arr);
			this.clearTimeout(stopp_timer6_arr);

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
	/*onObjectChange(id, obj) {
		if (obj) {
			// The object was changed
			this.log.error(`object ${id} changed: ${JSON.stringify(obj)}`);

		} else {
			// The object was deleted
			this.log.error(`object ${id} deleted`);
		}
	}
	*/

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */

	async onStateChange(id, state) {

		if (state) {

			//bei Änderung der Datenpunkte true oder false auswerten
			const SUN = await this.getStateAsync('Weekdays.07_Sunday');
			const statusSUN = SUN ? SUN.val : false;

			const Sunday = async () => {
				if (statusSUN == true) {
					//this.log.info('SO ist ' + statusSUN);
				} else if (statusSUN == false) {
					//this.log.info('So ist ' + statusSUN);
				} else {
					this.log.error('Error SO = ' + statusSUN);
				}
			};

			if (id == this.namespace + '.Weekdays.07_Sunday') {
				Sunday();
			}

			const MON = await this.getStateAsync('Weekdays.01_Monday');
			const statusMON = MON ? MON.val : false;

			const Monday = async () => {
				if (statusMON == true) {
					//this.log.info('MO ist ' + statusMON);
				} else if (statusMON == false) {
					//this.log.info('MO ist ' + statusMON);
				} else {
					this.log.error('Error MO = ' + statusMON);
				}
			};

			if (id == this.namespace + '.Weekdays.01_Monday') {
				Monday();
			}

			const TUE = await this.getStateAsync('Weekdays.02_Tuesday');
			const statusTUE = TUE ? TUE.val : false;

			const Tuesday = async () => {
				if (statusTUE == true) {
					//this.log.info('DI ist ' + statusTUE);
				} else if (statusTUE == false) {
					//this.log.info('DI ist ' + statusTUE);
				} else {
					this.log.error('Error DI = ' + statusTUE);
				}
			};

			if (id == this.namespace + '.Weekdays.02_Tuesday') {
				Tuesday();
			}

			const WED = await this.getStateAsync('Weekdays.03_Wednesday');
			const statusWED = WED ? WED.val : false;

			const Wednesday = async () => {
				if (statusWED == true) {
					//this.log.info('MI ist ' + statusWED);
				} else if (statusWED == false) {
					//this.log.info('MI ist ' + statusWED);
				} else {
					this.log.error('Error MI = ' + statusWED);
				}
			};

			if (id == this.namespace + '.Weekdays.03_Wednesday') {
				Wednesday();
			}

			const THU = await this.getStateAsync('Weekdays.04_Thursday');
			const statusTHU = THU ? THU.val : false;

			const Thursday = async () => {
				if (statusTHU == true) {
					//this.log.info('DO ist ' + statusTHU);
				} else if (statusTHU == false) {
					//this.log.info('DO ist ' + statusTHU);
				} else {
					//this.log.error('Error DO = ' + statusTHU);
				}
			};

			if (id == this.namespace + '.Weekdays.04_Thursday') {
				Thursday();
			}

			const FRI = await this.getStateAsync('Weekdays.05_Friday');
			const statusFRI = FRI ? FRI.val : false;

			const Friday = async () => {
				if (statusFRI == true) {
					//this.log.info('FR ist ' + statusFRI);
				} else if (statusFRI == false) {
					//this.log.info('FR ist ' + statusFRI);
				} else {
					this.log.error('Error FR = ' + statusFRI);
				}
			};

			if (id == this.namespace + '.Weekdays.05_Friday') {
				Friday();
			}

			const SAT = await this.getStateAsync('Weekdays.06_Saturday');
			const statusSAT = SAT ? SAT.val : true;

			const Saturday = async () => {
				if (statusSAT == true) {
					//this.log.info ('SA ist ' + statusSAT);
				} else if (statusSAT == false) {
					//this.log.info('SA ist ' + statusSAT);
				} else {
					this.log.error('Error SA = ' + statusSAT);
				}
			};

			if (id == this.namespace + '.Weekdays.06_Saturday') {
				Saturday();
			}

			//bei Änderung des der Datenpunkte Array neu schreiben
			//Sunday
			if (statusSUN == true) {
				SetWeekdays[0] = 'Sunday';

			} else if (statusSUN == false) {
				SetWeekdays[0] = 'x';

			} else {
				this.log.error('else... ' + statusSUN);
			}

			//Monday
			if (statusMON == true) {
				SetWeekdays[1] = 'Monday';

			} else if (statusMON == false) {
				SetWeekdays[1] = 'x';

			} else {
				this.log.error('else... ' + statusMON);
			}

			//Tuesday
			if (statusTUE == true) {
				SetWeekdays[2] = 'Tuesday';

			} else if (statusTUE == false) {
				SetWeekdays[2] = 'x';

			} else {
				this.log.error('else... ' + statusTUE);
			}

			//Wednesday
			if (statusWED == true) {
				SetWeekdays[3] = 'Wednesday';

			} else if (statusWED == false) {
				SetWeekdays[3] = 'x';

			} else {
				this.log.error('else... ' + statusWED);
			}

			//Thursday
			if (statusTHU == true) {
				SetWeekdays[4] = 'Thursday';

			} else if (statusTHU == false) {
				SetWeekdays[4] = 'x';

			} else {
				this.log.error('else... ' + statusTHU);
			}

			//Friday
			if (statusFRI == true) {
				SetWeekdays[5] = 'Friday';

			} else if (statusFRI == false) {
				SetWeekdays[5] = 'x';

			} else {
				this.log.error('else... ' + statusFRI);
			}

			//Saturday
			if (statusSAT == true) {
				SetWeekdays[6] = 'Saturday';

			} else if (statusSAT == false) {
				SetWeekdays[6] = 'x';

			} else {
				this.log.error('else... ' + statusSAT);
			}


			//Array SetWochentage auf Werte überprüfen und neues Array SetSchedule schreiben
			const killSO = SetWeekdays.indexOf('Sunday');
			if (killSO !== -1 && SetSchedule.indexOf(0) == -1) {
				SetSchedule.splice(0, 0, 0);

			} else if (killSO == -1 && SetSchedule.indexOf(0) == 0) {

				const searchSO = (element) => element == 0;
				SetSchedule.splice(SetSchedule.findIndex(searchSO), 1);

			}

			const killMO = SetWeekdays.indexOf('Monday');
			if (killMO != -1 && SetSchedule.indexOf(1) == -1) {
				SetSchedule.splice(0, 0, 1);

			} else if (killMO == -1 && SetSchedule.indexOf(1) !== -1) {

				const searchMO = (element) => element == 1;
				SetSchedule.splice(SetSchedule.findIndex(searchMO), 1);
			}

			const killDI = SetWeekdays.indexOf('Tuesday');
			if (killDI != -1 && SetSchedule.indexOf(2) == -1) {
				SetSchedule.splice(0, 0, 2);

			} else if (killDI == -1 && SetSchedule.indexOf(2) !== -1) {

				const searchDI = (element) => element == 2;
				SetSchedule.splice(SetSchedule.findIndex(searchDI), 1);
			}

			const killMI = SetWeekdays.indexOf('Wednesday');
			if (killMI != -1 && SetSchedule.indexOf(3) == -1) {
				SetSchedule.splice(0, 0, 3);

			} else if (killMI == -1 && SetSchedule.indexOf(3) !== -1) {

				const searchMI = (element) => element == 3;
				SetSchedule.splice(SetSchedule.findIndex(searchMI), 1);
			}

			const killDO = SetWeekdays.indexOf('Thursday');
			if (killDO != -1 && SetSchedule.indexOf(4) == -1) {
				SetSchedule.splice(0, 0, 4);

			} else if (killDO == -1 && SetSchedule.indexOf(4) !== -1) {

				const searchDO = (element) => element == 4;
				SetSchedule.splice(SetSchedule.findIndex(searchDO), 1);
			}

			const killFR = SetWeekdays.indexOf('Friday');
			if (killFR != -1 && SetSchedule.indexOf(5) == -1) {
				SetSchedule.splice(0, 0, 5);

			} else if (killFR == -1 && SetSchedule.indexOf(5) !== -1) {

				const searchFR = (element) => element == 5;
				SetSchedule.splice(SetSchedule.findIndex(searchFR), 1);
			}

			const killSA = SetWeekdays.indexOf('Saturday');
			if (killSA != -1 && SetSchedule.indexOf(6) == -1) {
				SetSchedule.splice(0, 0, 6);

			} else if (killSA == -1 && SetSchedule.indexOf(6) !== -1) {

				const searchSA = (element) => element == 6;
				SetSchedule.splice(SetSchedule.findIndex(searchSA), 1);
			}

			//HH geändert:

			const HH_1 = await this.getStateAsync('Setup.HH');
			if (HH_1) {

				const new_HH = HH_1 ? HH_1.val : '00';

				let new_HH_1 = new_HH.toString();

				if (new_HH_1 < 10 && new_HH_1.length == 1) {

					new_HH_1 = ('0' + HH_1.val);

				} else if (new_HH_1.length > 2) {

					this.log.error('Stunden sind nicht 2 stellig!');

				}

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val : '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				if (SetTrigger == 1) {

					Time.splice(0, 1, new_HH_1);

					time_t1arr.splice(0, 1, new_HH_1);

					this.setStateAsync('trigger_1.t1_time', time_t1arr[0] + ':' + time_t1arr[1], true);

					weekdays_t1arr = SetSchedule;
					this.setStateAsync('trigger_1.t1_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten


					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout(async () => {
							this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}

				} else if (SetTrigger == 2 && number_of_triggers >= 2) {

					Time.splice(0, 1, new_HH_1);

					time_t2arr.splice(0, 1, new_HH_1);

					this.setStateAsync('trigger_2.t2_time', time_t2arr[0] + ':' + time_t2arr[1], true);

					weekdays_t2arr = SetSchedule;
					this.setStateAsync('trigger_2.t2_weekdays', JSON.stringify(SetSchedule.sort()), true);


					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout(async () => {
							this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				} else if (SetTrigger == 3 && number_of_triggers >= 3) {

					Time.splice(0, 1, new_HH_1);

					time_t3arr.splice(0, 1, new_HH_1);

					this.setStateAsync('trigger_3.t3_time', time_t3arr[0] + ':' + time_t3arr[1], true);

					weekdays_t3arr = SetSchedule;
					this.setStateAsync('trigger_3.t3_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout(async () => {
							this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				} else if (SetTrigger == 4 && number_of_triggers >= 4) {

					Time.splice(0, 1, new_HH_1);

					time_t4arr.splice(0, 1, new_HH_1);

					this.setStateAsync('trigger_4.t4_time', time_t4arr[0] + ':' + time_t4arr[1], true);

					weekdays_t4arr = SetSchedule;
					this.setStateAsync('trigger_4.t4_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout(async () => {
							this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				} else if (SetTrigger == 5 && number_of_triggers >= 5) {

					Time.splice(0, 1, new_HH_1);

					time_t5arr.splice(0, 1, new_HH_1);

					this.setStateAsync('trigger_5.t5_time', time_t5arr[0] + ':' + time_t5arr[1], true);

					weekdays_t5arr = SetSchedule;
					this.setStateAsync('trigger_5.t5_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout(async () => {
							this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}



				} else if (SetTrigger == 6 && number_of_triggers == 6) {

					Time.splice(0, 1, new_HH_1);

					time_t6arr.splice(0, 1, new_HH_1);

					this.setStateAsync('trigger_6.t6_time', time_t6arr[0] + ':' + time_t6arr[1], true);

					weekdays_t6arr = SetSchedule;
					this.setStateAsync('trigger_6.t6_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout(async () => {
							this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				}


			} else {

				this.log.error('Uhrzeit -HH- Error -- ');

			}




			//mm geändert:
			const mm_1 = await this.getStateAsync('Setup.mm');
			if (mm_1) {

				const new_mm = mm_1.toString() ? mm_1.val : '00';

				let new_mm_1 = new_mm.toString();

				if (new_mm_1 < 10 && new_mm_1.length == 1) {

					new_mm_1 = ('0' + mm_1.val);

				} else if (new_mm_1.length > 2) {

					this.log.error('Minuten sind nicht 2 stellig!');

				}

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val : '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				if (SetTrigger == 1) {

					Time.splice(1, 1, new_mm_1);

					time_t1arr.splice(1, 1, new_mm_1);

					this.setStateAsync('trigger_1.t1_time', time_t1arr[0] + ':' + time_t1arr[1], true);

				} else if (SetTrigger == 2 && number_of_triggers >= 2) {

					Time.splice(1, 1, new_mm_1);

					time_t2arr.splice(1, 1, new_mm_1);

					this.setStateAsync('trigger_2.t2_time', time_t2arr[0] + ':' + time_t2arr[1], true);

				} else if (SetTrigger == 3 && number_of_triggers >= 3) {

					Time.splice(1, 1, new_mm_1);

					time_t3arr.splice(1, 1, new_mm_1);

					this.setStateAsync('trigger_3.t3_time', time_t3arr[0] + ':' + time_t3arr[1], true);

				} else if (SetTrigger == 4 && number_of_triggers >= 4) {

					Time.splice(1, 1, new_mm_1);

					time_t4arr.splice(1, 1, new_mm_1);

					this.setStateAsync('trigger_4.t4_time', time_t4arr[0] + ':' + time_t4arr[1], true);

				} else if (SetTrigger == 5 && number_of_triggers >= 5) {

					Time.splice(1, 1, new_mm_1);

					time_t5arr.splice(1, 1, new_mm_1);

					this.setStateAsync('trigger_5.t5_time', time_t5arr[0] + ':' + time_t5arr[1], true);

				} else if (SetTrigger == 6 && number_of_triggers == 6) {

					Time.splice(1, 1, new_mm_1);

					time_t6arr.splice(1, 1, new_mm_1);

					this.setStateAsync('trigger_6.t6_time', time_t6arr[0] + ':' + time_t6arr[1], true);

				}


			} else {

				this.log.error('Uhrzeit -mm- Error -- ');

			}


			//trigger_1_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_1Start = await this.getObjectAsync('trigger_1.trigger_1_Start');

			if (trigger_1Start) {


				if (this.config.extended_Datapoints_T1 == true) {


					const t1_true_1 = await this.getStateAsync('trigger_1.01_t1_true');
					const t1_true = t1_true_1.val;

					if (t1_true == '') {

						this.setStateAsync('trigger_1.01_t1_true', 'true', true);
						t1_true_arr = true;

					} else {

						t1_true_arr = t1_true;

					}


					const t1_false_1 = await this.getStateAsync('trigger_1.02_t1_false');
					const t1_false = t1_false_1.val;

					if (t1_false == '') {

						this.setStateAsync('trigger_1.02_t1_false', 'false', true);
						t1_false_arr = false;

					} else {

						t1_false_arr = t1_false;

					}

				}

				const triggerStart_1 = await this.getStateAsync('trigger_1.trigger_1_Start');
				const StatusTriggerStart = triggerStart_1.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val : '0';

				const goforit_1 = await this.getStateAsync('trigger_1.goforit_1');
				const goforit = goforit_1 ? goforit_1.val : 'None';

				//******************************************
				//goforit eingetragenen Datenpunkt ckecken
				//******************************************
				//**************** 29091977 ****************

				if (goforit !== '' && goforit !== 'None' && goforit !== 'please_Set') {

					const valid_DP1 = await this.getForeignObjectAsync(goforit);
					const validDP = valid_DP1;

					if (validDP != null) {

						const goforit_type_1 = await this.getForeignStateAsync(goforit);
						const goforit_type = (typeof goforit_type_1.val);

						typeofarr1 = goforit_type;
						DP_1arr = goforit;

						//this.log.warn('goforit ist state -- Array -- ' + typeofarr1);

					} else {

						if (StatusTriggerStart == true) {
							this.setStateAsync('trigger_1.trigger_1_Start', false, true);
						}

						this.log.error('In Trigger 1, goforit -- ' + goforit + ' -- existiert nicht! Bitte ändern');

					}

				} else if (goforit == '') {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.setStateAsync('trigger_1.goforit_1', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 1! Bitte ändern!');
					this.setStateAsync('trigger_1.goforit_1', 'please_Set', true);

				} else if (goforit == 'please_Set' && StatusTriggerStart == true) {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.log.error('Bitte Datenpunkt in -goforit- bei Trigger 1 eintragen!');

				}

				const timer_set = await this.getStateAsync('trigger_1.timer_1');
				const timer = timer_set ? timer_set.val : 0;

				if (timer !== '' && timer > 0) {

					timer_t1arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.log.error('Keine gültige Zeit in Minuten bei "timer" angegeben, wann Schedule 1 wieder auf false gesetzt werden soll!');
					this.setStateAsync('trigger_1.timer_1', 'please_Set', true);

				} else if (timer <= 0) {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.log.error('"timer" darf keinen negativen Wert haben, bei Trigger 1 bitte korrigieren!');
					this.setStateAsync('trigger_1.timer_1', 'please_Set', true);

				} else {

					//this.setStateAsync('trigger_1.timer_1', 'please_Set', true);

				}



				const triggerStartAction_true_1 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 1) {


						weekdays_t1arr = SetSchedule;

						this.setStateAsync('trigger_1.t1_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t1arr[0];
						const mm_1 = time_t1arr[1];

						this.setStateAsync('trigger_1.trigger_1_is_set', hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_1();



					} else if (StatusTriggerStart == true && SetTrigger !== 1) {

						try {
							const time_1 = await this.getStateAsync('trigger_1.t1_time');
							const read_time_1 = time_1.val;

							if (read_time_1 == '') {

								this.log.error('Uhrzeit bei Trigger 1 muss gesetzt werden!');
								this.setStateAsync('trigger_1.t1_time', 'please_Set', true);
								this.setStateAsync('trigger_1.trigger_1_Start', false, true);

							} else {

								const [hh, mm] = read_time_1.split(':');
								const hh_1 = hh ? hh : 'not';
								const mm_1 = mm ? mm : 'set';

								time_t1arr.splice(0, 1, hh_1);
								time_t1arr.splice(1, 1, mm_1);

								const weekdays_t1 = await this.getStateAsync('trigger_1.t1_weekdays');
								const weekdays_t1_val = JSON.parse(weekdays_t1.val);

								weekdays_t1arr = weekdays_t1_val;

								this.setStateAsync('trigger_1.trigger_1_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t1arr, true);

								this.Schedule_1();
							}

						} catch (e1) {

							this.log.error('Check the time of Schedule 1! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						//this.checkTime(1);
						this.cancelSchedule(1);

						this.clearTimeout(stopp_timer1_arr);

						this.setStateAsync('trigger_1.trigger_1_is_set', 'not scheduled', true);
						weekdays_t1arr.splice(0, weekdays_t1arr.length);

					}
				};


				triggerStartAction_true_1();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_2_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_2Start = await this.getObjectAsync('trigger_2.trigger_2_Start');

			if (trigger_2Start) {

				if (this.config.extended_Datapoints_T2 == true) {


					const t2_true_1 = await this.getStateAsync('trigger_2.01_t2_true');
					const t2_true = t2_true_1.val;

					if (t2_true == '') {

						this.setStateAsync('trigger_2.01_t2_true', 'true', true);
						t2_true_arr = true;

					} else {

						t2_true_arr = t2_true;

					}


					const t2_false_1 = await this.getStateAsync('trigger_2.02_t2_false');
					const t2_false = t2_false_1.val;

					if (t2_false == '') {

						this.setStateAsync('trigger_2.02_t2_false', 'false', true);
						t2_false_arr = false;

					} else {

						t2_false_arr = t2_false;

					}

				}


				const triggerStart_2 = await this.getStateAsync('trigger_2.trigger_2_Start');
				const StatusTriggerStart = triggerStart_2.val;

				const SetTrigger_2 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_2 ? SetTrigger_2.val : '0';

				const goforit_2 = await this.getStateAsync('trigger_2.goforit_2');
				const goforit = goforit_2 ? goforit_2.val : 'None';

				if (goforit !== '' && goforit !== 'None' && goforit !== 'please_Set') {

					DP_2arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.setStateAsync('trigger_2.goforit_2', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 2!');
					this.setStateAsync('trigger_2.goforit_2', 'please_Set', true);

				} else if (goforit == 'please_Set' && StatusTriggerStart == true) {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.log.error('Bitte Datenpunkt in -goforit- bei Trigger 2 eintragen!');

				}

				const timer_set = await this.getStateAsync('trigger_2.timer_2');
				const timer = timer_set ? timer_set.val : 0;

				if (timer !== '' && timer > 0) {

					timer_t2arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.log.error('Keine gültige Zeit in Minuten bei "timer" angegeben, wann Schedule 2 wieder auf false gesetzt werden soll!');

				} else if (timer <= 0) {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.log.error('"timer" darf keinen negativen Wert haben, bei Trigger 2 bitte korrigieren!');

				}



				const triggerStartAction_true_2 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 2) {

						weekdays_t2arr = SetSchedule;

						this.setStateAsync('trigger_2.t2_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t2arr[0];
						const mm_1 = time_t2arr[1];

						this.setStateAsync('trigger_2.trigger_2_is_set', hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_2();



					} else if (StatusTriggerStart == true && SetTrigger !== 2) {

						try {
							const time_2 = await this.getStateAsync('trigger_2.t2_time');
							const read_time_2 = time_2.val;

							const [hh, mm] = read_time_2.split(':');
							const hh_1 = hh ? hh : 'not';
							const mm_1 = mm ? mm : 'set';

							time_t2arr.splice(0, 1, hh_1);
							time_t2arr.splice(1, 1, mm_1);

							const weekdays_t2 = await this.getStateAsync('trigger_2.t2_weekdays');
							const weekdays_t2_val = JSON.parse(weekdays_t2.val);

							weekdays_t2arr = weekdays_t2_val;

							this.setStateAsync('trigger_2.trigger_2_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t2arr, true);

							this.Schedule_2();

						} catch (e1) {

							this.log.error('Check the time of Schedule 2! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						//this.checkTime(2);
						this.cancelSchedule(2);

						this.clearTimeout(stopp_timer2_arr);

						this.setStateAsync('trigger_2.trigger_2_is_set', 'not scheduled', true);
						weekdays_t2arr.splice(0, weekdays_t2arr.length);

					}
				};


				triggerStartAction_true_2();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_3_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_3Start = await this.getObjectAsync('trigger_3.trigger_3_Start');

			if (trigger_3Start) {

				if (this.config.extended_Datapoints_T3 == true) {


					const t3_true_1 = await this.getStateAsync('trigger_3.01_t3_true');
					const t3_true = t3_true_1.val;

					if (t3_true == '') {

						this.setStateAsync('trigger_3.01_t3_true', 'true', true);
						t3_true_arr = true;

					} else {

						t3_true_arr = t3_true;

					}


					const t3_false_1 = await this.getStateAsync('trigger_3.02_t3_false');
					const t3_false = t3_false_1.val;

					if (t3_false == '') {

						this.setStateAsync('trigger_3.02_t3_false', 'false', true);
						t3_false_arr = false;

					} else {

						t3_false_arr = t3_false;

					}

				}


				const triggerStart_3 = await this.getStateAsync('trigger_3.trigger_3_Start');
				const StatusTriggerStart = triggerStart_3.val;

				const SetTrigger_3 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_3 ? SetTrigger_3.val : '0';

				const goforit_3 = await this.getStateAsync('trigger_3.goforit_3');
				const goforit = goforit_3 ? goforit_3.val : 'None';

				if (goforit !== '' && goforit !== 'None' && goforit !== 'please_Set') {

					DP_3arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.setStateAsync('trigger_3.goforit_3', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 3!');
					this.setStateAsync('trigger_3.goforit_3', 'please_Set', true);

				} else if (goforit == 'please_Set' && StatusTriggerStart == true) {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.log.error('Bitte Datenpunkt in -goforit- bei Trigger 3 eintragen!');

				}

				const timer_set = await this.getStateAsync('trigger_3.timer_3');
				const timer = timer_set ? timer_set.val : 0;

				if (timer !== '' && timer > 0) {

					timer_t3arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.log.error('Keine gültige Zeit in Minuten bei "timer" angegeben, wann Schedule 3 wieder auf false gesetzt werden soll!');

				} else if (timer <= 0) {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.log.error('"timer" darf keinen negativen Wert haben, bei Trigger 3 bitte korrigieren!');

				}


				const triggerStartAction_true_3 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 3) {

						weekdays_t3arr = SetSchedule;

						this.setStateAsync('trigger_3.t3_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t3arr[0];
						const mm_1 = time_t3arr[1];

						this.setStateAsync('trigger_3.trigger_3_is_set', hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_3();



					} else if (StatusTriggerStart == true && SetTrigger !== 3) {

						try {
							const time_3 = await this.getStateAsync('trigger_3.t3_time');
							const read_time_3 = time_3.val;

							const [hh, mm] = read_time_3.split(':');
							const hh_1 = hh ? hh : 'not';
							const mm_1 = mm ? mm : 'set';

							time_t3arr.splice(0, 1, hh_1);
							time_t3arr.splice(1, 1, mm_1);

							const weekdays_t3 = await this.getStateAsync('trigger_3.t3_weekdays');
							const weekdays_t3_val = JSON.parse(weekdays_t3.val);

							weekdays_t3arr = weekdays_t3_val;

							this.setStateAsync('trigger_3.trigger_3_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t3arr, true);

							this.Schedule_3();

						} catch (e1) {

							this.log.error('Check the time of Schedule 3! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						//this.checkTime(3);
						this.cancelSchedule(3);

						this.clearTimeout(stopp_timer3_arr);

						this.setStateAsync('trigger_3.trigger_3_is_set', 'not scheduled', true);
						weekdays_t3arr.splice(0, weekdays_t3arr.length);

					}
				};


				triggerStartAction_true_3();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_4_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_4Start = await this.getObjectAsync('trigger_4.trigger_4_Start');

			if (trigger_4Start) {

				if (this.config.extended_Datapoints_T4 == true) {


					const t4_true_1 = await this.getStateAsync('trigger_4.01_t4_true');
					const t4_true = t4_true_1.val;

					if (t4_true == '') {

						this.setStateAsync('trigger_4.01_t4_true', 'true', true);
						t4_true_arr = true;

					} else {

						t4_true_arr = t4_true;

					}


					const t4_false_1 = await this.getStateAsync('trigger_4.02_t4_false');
					const t4_false = t4_false_1.val;

					if (t4_false == '') {

						this.setStateAsync('trigger_4.02_t4_false', 'false', true);
						t4_false_arr = false;

					} else {

						t4_false_arr = t4_false;

					}

				}


				const triggerStart_4 = await this.getStateAsync('trigger_4.trigger_4_Start');
				const StatusTriggerStart = triggerStart_4.val;

				const SetTrigger_4 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_4 ? SetTrigger_4.val : '0';

				const goforit_4 = await this.getStateAsync('trigger_4.goforit_4');
				const goforit = goforit_4 ? goforit_4.val : 'None';

				if (goforit !== '' && goforit !== 'None' && goforit !== 'please_Set') {

					DP_4arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.setStateAsync('trigger_4.goforit_4', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 4!');
					this.setStateAsync('trigger_4.goforit_4', 'please_Set', true);

				} else if (goforit == 'please_Set' && StatusTriggerStart == true) {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.log.error('Bitte Datenpunkt in -goforit- bei Trigger 4 eintragen!');

				}

				const timer_set = await this.getStateAsync('trigger_4.timer_4');
				const timer = timer_set ? timer_set.val : 0;

				if (timer !== '' && timer > 0) {

					timer_t4arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.log.error('Keine gültige Zeit in Minuten bei "timer" angegeben, wann Schedule 4 wieder auf false gesetzt werden soll!');

				} else if (timer <= 0) {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.log.error('"timer" darf keinen negativen Wert haben, bei Trigger 4 bitte korrigieren!');

				}


				const triggerStartAction_true_4 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 4) {

						weekdays_t4arr = SetSchedule;

						this.setStateAsync('trigger_4.t4_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t4arr[0];
						const mm_1 = time_t4arr[1];

						this.setStateAsync('trigger_4.trigger_4_is_set', hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_4();



					} else if (StatusTriggerStart == true && SetTrigger !== 4) {

						try {
							const time_4 = await this.getStateAsync('trigger_4.t4_time');
							const read_time_4 = time_4.val;

							const [hh, mm] = read_time_4.split(':');
							const hh_1 = hh ? hh : 'not';
							const mm_1 = mm ? mm : 'set';

							time_t4arr.splice(0, 1, hh_1);
							time_t4arr.splice(1, 1, mm_1);

							const weekdays_t4 = await this.getStateAsync('trigger_4.t4_weekdays');
							const weekdays_t4_val = JSON.parse(weekdays_t4.val);

							weekdays_t4arr = weekdays_t4_val;

							this.setStateAsync('trigger_4.trigger_4_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t4arr, true);

							this.Schedule_4();

						} catch (e1) {

							this.log.error('Check the time of Schedule 4! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						//this.checkTime(4);
						this.cancelSchedule(4);

						this.clearTimeout(stopp_timer4_arr);

						this.setStateAsync('trigger_4.trigger_4_is_set', 'not scheduled', true);
						weekdays_t4arr.splice(0, weekdays_t4arr.length);

					}
				};


				triggerStartAction_true_4();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_5_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_5Start = await this.getObjectAsync('trigger_5.trigger_5_Start');

			if (trigger_5Start) {


				if (this.config.extended_Datapoints_T5 == true) {


					const t5_true_1 = await this.getStateAsync('trigger_5.01_t5_true');
					const t5_true = t5_true_1.val;

					if (t5_true == '') {

						this.setStateAsync('trigger_5.01_t5_true', 'true', true);
						t5_true_arr = true;

					} else {

						t5_true_arr = t5_true;

					}


					const t5_false_1 = await this.getStateAsync('trigger_5.02_t5_false');
					const t5_false = t5_false_1.val;

					if (t5_false == '') {

						this.setStateAsync('trigger_5.02_t5_false', 'false', true);
						t5_false_arr = false;

					} else {

						t5_false_arr = t5_false;

					}

				}


				const triggerStart_5 = await this.getStateAsync('trigger_5.trigger_5_Start');
				const StatusTriggerStart = triggerStart_5.val;

				const SetTrigger_5 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_5 ? SetTrigger_5.val : '0';

				const goforit_5 = await this.getStateAsync('trigger_5.goforit_5');
				const goforit = goforit_5 ? goforit_5.val : 'None';

				if (goforit !== '' && goforit !== 'None' && goforit !== 'please_Set') {

					DP_5arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.setStateAsync('trigger_5.goforit_5', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 5!');
					this.setStateAsync('trigger_5.goforit_5', 'please_Set', true);

				} else if (goforit == 'please_Set' && StatusTriggerStart == true) {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.log.error('Bitte Datenpunkt in -goforit- bei Trigger 5 eintragen!');

				}

				const timer_set = await this.getStateAsync('trigger_5.timer_5');
				const timer = timer_set ? timer_set.val : 0;

				if (timer !== '' && timer > 0) {

					timer_t5arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.log.error('Keine gültige Zeit in Minuten bei "timer" angegeben, wann Schedule 5 wieder auf false gesetzt werden soll!');

				} else if (timer <= 0) {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.log.error('"timer" darf keinen negativen Wert haben, bei Trigger 5 bitte korrigieren!');

				}


				const triggerStartAction_true_5 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 5) {

						weekdays_t5arr = SetSchedule;

						this.setStateAsync('trigger_5.t5_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t5arr[0];
						const mm_1 = time_t5arr[1];

						this.setStateAsync('trigger_5.trigger_5_is_set', hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_5();



					} else if (StatusTriggerStart == true && SetTrigger !== 5) {

						try {
							const time_5 = await this.getStateAsync('trigger_5.t5_time');
							const read_time_5 = time_5.val;

							const [hh, mm] = read_time_5.split(':');
							const hh_1 = hh ? hh : 'not';
							const mm_1 = mm ? mm : 'set';

							time_t5arr.splice(0, 1, hh_1);
							time_t5arr.splice(1, 1, mm_1);

							const weekdays_t5 = await this.getStateAsync('trigger_5.t5_weekdays');
							const weekdays_t5_val = JSON.parse(weekdays_t5.val);

							weekdays_t5arr = weekdays_t5_val;

							this.setStateAsync('trigger_5.trigger_5_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t5arr, true);

							this.Schedule_5();

						} catch (e1) {

							this.log.error('Check the time of Schedule 5! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						//this.checkTime(5);
						this.cancelSchedule(5);

						this.clearTimeout(stopp_timer5_arr);

						this.setStateAsync('trigger_5.trigger_5_is_set', 'not scheduled', true);
						weekdays_t5arr.splice(0, weekdays_t5arr.length);

					}
				};


				triggerStartAction_true_5();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_6_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_6Start = await this.getObjectAsync('trigger_6.trigger_6_Start');

			if (trigger_6Start) {


				if (this.config.extended_Datapoints_T6 == true) {


					const t6_true_1 = await this.getStateAsync('trigger_6.01_t6_true');
					const t6_true = t6_true_1.val;

					if (t6_true == '') {

						this.setStateAsync('trigger_6.01_t6_true', 'true', true);
						t6_true_arr = true;

					} else {

						t6_true_arr = t6_true;

					}


					const t6_false_1 = await this.getStateAsync('trigger_6.02_t6_false');
					const t6_false = t6_false_1.val;

					if (t6_false == '') {

						this.setStateAsync('trigger_6.02_t6_false', 'false', true);
						t6_false_arr = false;

					} else {

						t6_false_arr = t6_false;

					}

				}


				const triggerStart_6 = await this.getStateAsync('trigger_6.trigger_6_Start');
				const StatusTriggerStart = triggerStart_6.val;

				const SetTrigger_6 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_6 ? SetTrigger_6.val : '0';

				const goforit_6 = await this.getStateAsync('trigger_6.goforit_6');
				const goforit = goforit_6 ? goforit_6.val : 'None';

				if (goforit !== '' && goforit !== 'None' && goforit !== 'please_Set') {

					DP_6arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.setStateAsync('trigger_6.goforit_6', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 6!');
					this.setStateAsync('trigger_6.goforit_6', 'please_Set', true);

				} else if (goforit == 'please_Set' && StatusTriggerStart == true) {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.log.error('Bitte Datenpunkt in -goforit- bei Trigger 6 eintragen!');

				}

				const timer_set = await this.getStateAsync('trigger_6.timer_6');
				const timer = timer_set ? timer_set.val : 0;

				if (timer !== '' && timer > 0) {

					timer_t6arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.log.error('Keine gültige Zeit in Minuten bei "timer" angegeben, wann Schedule 6 wieder auf false gesetzt werden soll!');

				} else if (timer <= 0) {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.log.error('"timer" darf keinen negativen Wert haben, bei Trigger 6 bitte korrigieren!');

				}


				const triggerStartAction_true_6 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 6) {

						weekdays_t6arr = SetSchedule;

						this.setStateAsync('trigger_6.t6_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t6arr[0];
						const mm_1 = time_t6arr[1];

						this.setStateAsync('trigger_6.trigger_6_is_set', hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_6();



					} else if (StatusTriggerStart == true && SetTrigger !== 6) {

						try {
							const time_6 = await this.getStateAsync('trigger_6.t6_time');
							const read_time_6 = time_6.val;

							const [hh, mm] = read_time_6.split(':');
							const hh_1 = hh ? hh : 'not';
							const mm_1 = mm ? mm : 'set';

							time_t6arr.splice(0, 1, hh_1);
							time_t6arr.splice(1, 1, mm_1);

							const weekdays_t6 = await this.getStateAsync('trigger_6.t6_weekdays');
							const weekdays_t6_val = JSON.parse(weekdays_t6.val);

							weekdays_t6arr = weekdays_t6_val;

							this.setStateAsync('trigger_6.trigger_6_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t6arr, true);

							this.Schedule_6();

						} catch (e1) {

							this.log.error('Check the time of Schedule 6! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						//this.checkTime(6);
						this.cancelSchedule(6);

						this.clearTimeout(stopp_timer6_arr);

						this.setStateAsync('trigger_6.trigger_6_is_set', 'not scheduled', true);
						weekdays_t6arr.splice(0, weekdays_t6arr.length);

					}
				};


				triggerStartAction_true_6();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


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
