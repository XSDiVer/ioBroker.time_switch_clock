// @ts-nocheck
'use strict';

//const { Adapter } = require('@iobroker/adapter-core');
/*
 * Created with @iobroker/create-adapter v2.1.1
 */

const utils = require('@iobroker/adapter-core');
const schedule = require('node-schedule');
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


//Arrays für Wochentage? / Schedule?

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
		const SUN = await this.getStateAsync('Weekdays.Sunday');
		const statusSUN = SUN ? SUN.val: true;

		const MON = await this.getStateAsync('Weekdays.Monday');
		const statusMON = MON ? MON.val: false;

		const TUE = await this.getStateAsync('Weekdays.Tuesday');
		const statusTUE = TUE ? TUE.val: false;

		const WED = await this.getStateAsync('Weekdays.Wednesday');
		const statusWED = WED ? WED.val: false;

		const THU = await this.getStateAsync('Weekdays.Thursday');
		const statusTHU = THU ? THU.val: false;

		const FRI = await this.getStateAsync('Weekdays.Friday');
		const statusFRI = FRI ? FRI.val: false;

		const SAT = await this.getStateAsync('Weekdays.Saturday');
		const statusSAT = SAT ? SAT.val: true;

		//in Array einfügen oder löschen wenn false
		//Sunday
		if (statusSUN == true) {
			SetWeekdays.splice(0,1, 'Sunday');
			SetSchedule.splice(0,0, 0);

		}  else if (statusSUN == false) {
			SetWeekdays.splice(0,1, '');

		}	else {
			this.log.error('else... ' + statusSUN);
		}

		//Monday
		if (statusMON == true) {
			SetWeekdays.splice(1,1, 'Monday');
			SetSchedule.splice(0,0, 1);

		}  else if (statusMON == false) {
			SetWeekdays.splice(1,1, '');

		}	else {
			this.log.error('else... ' + statusMON);
		}

		//Tuesday
		if (statusTUE == true) {
			SetWeekdays.splice(2,1, 'Tuesday');
			SetSchedule.splice(0,0, 2);

		}  else if (statusTUE == false) {
			SetWeekdays.splice(2,1, '');

		}	else {
			this.log.error('else... ' + statusTUE);
		}

		//Wednesday
		if (statusWED == true) {
			SetWeekdays.splice(3,1, 'Wednesday');
			SetSchedule.splice(0,0, 3);

		}  else if (statusWED == false) {
			SetWeekdays.splice(3,1, '');

		}	else {
			this.log.error('else... ' + statusWED);
		}

		//Thursday
		if (statusTHU == true) {
			SetWeekdays.splice(4,1, 'Thursday');
			SetSchedule.splice(0,0, 4);

		}  else if (statusTHU == false) {
			SetWeekdays.splice(4,1, '');

		}	else {
			this.log.error('else... ' + statusTHU);
		}

		//Friday
		if (statusFRI == true) {
			SetWeekdays.splice(5,1, 'Friday');
			SetSchedule.splice(0,0, 5);

		}  else if (statusFRI == false) {
			SetWeekdays.splice(5,1, '');

		}	else {
			this.log.error('else... ' + statusFRI);
		}

		//Saturday
		if (statusSAT == true) {
			SetWeekdays.splice(6,1, 'Saturday');
			SetSchedule.splice(0,0, 6);

		}  else if (statusSAT == false) {
			SetWeekdays.splice(6,1, '');

		}	else {
			this.log.error('else... ' + statusSAT);
		}

		//Array sortieren
		//SetWeekdays.sort();

		//Array SetSchedule sortieren
		//SetSchedule.sort();

		await this.setObjectNotExistsAsync('trigger_1.trigger_1_is_set', {
			type: 'state',
			common: {
				name: 'trigger_1_is_set',
				type: 'string',
				role: 'state',
				read: true,
				write: false,
			},
			native: {},
		});

		//Schedule zusammen setzten

		this.Schedule_1 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t1arr[0];
			const MM = time_t1arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t1arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 !== 'undefined' && SetTrigger == 1 && SetSchedule.length !== 0) {

				this.mySchedule_1.cancel();

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_1.trigger_1', true, true) && this.log.info('Schedule 1 ausgelöst!')); +
				this.setState('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 1 -- ' + this.mySchedule_1.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 == 'undefined' && SetTrigger == 1 && SetSchedule.length !== 0) {

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_1.trigger_1', true, true) && this.log.info('Schedule 1 ausgelöst!')); +
				this.setState('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 !== 'undefined' && SetTrigger !== 1 && weekdays_t1arr.length !== 0) {

				this.mySchedule_1.cancel();

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_1.trigger_1', true, true) && this.log.info('Schedule 1 ausgelöst!')); +
				this.setState('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 1 -- ' + this.mySchedule_1.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 == 'undefined' && SetTrigger !== 1 && weekdays_t1arr.length !== 0) {

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_1.trigger_1', true, true) && this.log.info('Schedule 1 ausgelöst!')); +
				this.setState('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t1arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 1');
				this.setState('trigger_1.trigger_1_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 1 -- ' + HH + ':' + MM);
				this.setState('trigger_1.trigger_1_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 1 -- Uhrzeit ' + HH + ':' + MM);
				this.setState('trigger_1.trigger_1_Start', false, true);

			}
		};



		this.Schedule_2 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t2arr[0];
			const MM = time_t2arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t2arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 !== 'undefined' && SetTrigger == 2 && SetSchedule.length !== 0) {

				this.mySchedule_2.cancel();

				this.mySchedule_2= schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_2.trigger_2', true, true) && this.log.info('Schedule 2 ausgelöst!')); +
				this.setState('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 2 -- ' + this.mySchedule_2.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 == 'undefined' && SetTrigger == 2 && SetSchedule.length !== 0) {

				this.mySchedule_2 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_2.trigger_2', true, true) && this.log.info('Schedule 2 ausgelöst!')); +
				this.setState('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 !== 'undefined' && SetTrigger !== 2 && weekdays_t2arr.length !== 0) {

				this.mySchedule_2.cancel();

				this.mySchedule_2 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_2.trigger_2', true, true) && this.log.info('Schedule 2 ausgelöst!')); +
				this.setState('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 2 -- ' + this.mySchedule_2.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 == 'undefined' && SetTrigger !== 2 && weekdays_t2arr.length !== 0) {

				this.mySchedule_2 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_2.trigger_2', true, true) && this.log.info('Schedule 2 ausgelöst!')); +
				this.setState('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t2arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 1');
				this.setState('trigger_2.trigger_2_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 2 -- ' + HH + ':' + MM);
				this.setState('trigger_2.trigger_2_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 2 -- Uhrzeit ' + HH + ':' + MM);
				this.setState('trigger_2.trigger_2_Start', false, true);

			}
		};


		this.Schedule_3 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t3arr[0];
			const MM = time_t3arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t3arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 !== 'undefined' && SetTrigger == 3 && SetSchedule.length !== 0) {

				this.mySchedule_3.cancel();

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_3.trigger_3', true, true) && this.log.info('Schedule 3 ausgelöst!')); +
				this.setState('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 3 -- ' + this.mySchedule_3.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 == 'undefined' && SetTrigger == 3 && SetSchedule.length !== 0) {

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_3.trigger_3', true, true) && this.log.info('Schedule 3 ausgelöst!')); +
				this.setState('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 !== 'undefined' && SetTrigger !== 3 && weekdays_t3arr.length !== 0) {

				this.mySchedule_3.cancel();

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_3.trigger_3', true, true) && this.log.info('Schedule 3 ausgelöst!')); +
				this.setState('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 3 -- ' + this.mySchedule_3.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 == 'undefined' && SetTrigger !== 3 && weekdays_t3arr.length !== 0) {

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_3.trigger_3', true, true) && this.log.info('Schedule 3 ausgelöst!')); +
				this.setState('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t3arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 3');
				this.setState('trigger_3.trigger_3_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 3 -- ' + HH + ':' + MM);
				this.setState('trigger_3.trigger_3_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 3 -- Uhrzeit ' + HH + ':' + MM);
				this.setState('trigger_3.trigger_3_Start', false, true);

			}
		};


		this.Schedule_4 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t4arr[0];
			const MM = time_t4arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t4arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 !== 'undefined' && SetTrigger == 4 && SetSchedule.length !== 0) {

				this.mySchedule_4.cancel();

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_4.trigger_4', true, true) && this.log.info('Schedule 4 ausgelöst!')); +
				this.setState('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 4 -- ' + this.mySchedule_4.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 == 'undefined' && SetTrigger == 4 && SetSchedule.length !== 0) {

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_4.trigger_4', true, true) && this.log.info('Schedule 4 ausgelöst!')); +
				this.setState('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 !== 'undefined' && SetTrigger !== 4 && weekdays_t4arr.length !== 0) {

				this.mySchedule_4.cancel();

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_4.trigger_4', true, true) && this.log.info('Schedule 4 ausgelöst!')); +
				this.setState('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 4 -- ' + this.mySchedule_4.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 == 'undefined' && SetTrigger !== 4 && weekdays_t4arr.length !== 0) {

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_4.trigger_4', true, true) && this.log.info('Schedule 4 ausgelöst!')); +
				this.setState('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t4arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 4');
				this.setState('trigger_4.trigger_4_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 4 -- ' + HH + ':' + MM);
				this.setState('trigger_4.trigger_4_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 4 -- Uhrzeit ' + HH + ':' + MM);
				this.setState('trigger_4.trigger_4_Start', false, true);

			}
		};


		this.Schedule_5 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t5arr[0];
			const MM = time_t5arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t5arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 !== 'undefined' && SetTrigger == 5 && SetSchedule.length !== 0) {

				this.mySchedule_5.cancel();

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_5.trigger_5', true, true) && this.log.info('Schedule 5 ausgelöst!')); +
				this.setState('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 5 -- ' + this.mySchedule_5.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 == 'undefined' && SetTrigger == 5 && SetSchedule.length !== 0) {

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_5.trigger_5', true, true) && this.log.info('Schedule 5 ausgelöst!')); +
				this.setState('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 !== 'undefined' && SetTrigger !== 5 && weekdays_t5arr.length !== 0) {

				this.mySchedule_5.cancel();

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_5.trigger_5', true, true) && this.log.info('Schedule 5 ausgelöst!')); +
				this.setState('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 5 -- ' + this.mySchedule_5.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 == 'undefined' && SetTrigger !== 5 && weekdays_t5arr.length !== 0) {

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_5.trigger_5', true, true) && this.log.info('Schedule 5 ausgelöst!')); +
				this.setState('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t5arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 5');
				this.setState('trigger_5.trigger_5_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 5 -- ' + HH + ':' + MM);
				this.setState('trigger_5.trigger_5_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 5 -- Uhrzeit ' + HH + ':' + MM);
				this.setState('trigger_5.trigger_5_Start', false, true);

			}
		};


		this.Schedule_6 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t6arr[0];
			const MM = time_t6arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t6arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 !== 'undefined' && SetTrigger == 6 && SetSchedule.length !== 0) {

				this.mySchedule_6.cancel();

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_6.trigger_6', true, true) && this.log.info('Schedule 6 ausgelöst!')); +
				this.setState('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 6 -- ' + this.mySchedule_6.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 == 'undefined' && SetTrigger == 6 && SetSchedule.length !== 0) {

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setState('trigger_6.trigger_6', true, true) && this.log.info('Schedule 6 ausgelöst!')); +
				this.setState('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 !== 'undefined' && SetTrigger !== 6 && weekdays_t6arr.length !== 0) {

				this.mySchedule_6.cancel();

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_6.trigger_6', true, true) && this.log.info('Schedule 6 ausgelöst!')); +
				this.setState('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 6 -- ' + this.mySchedule_6.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 == 'undefined' && SetTrigger !== 6 && weekdays_t6arr.length !== 0) {

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setState('trigger_6.trigger_6', true, true) && this.log.info('Schedule 6 ausgelöst!')); +
				this.setState('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t6arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 6');
				this.setState('trigger_6.trigger_6_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 6 -- ' + HH + ':' + MM);
				this.setState('trigger_6.trigger_6_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 6 -- Uhrzeit ' + HH + ':' + MM);
				this.setState('trigger_6.trigger_6_Start', false, true);

			}
		};

		//Schedule zusammen setzten - ENDE


		//Cancel Schedules
		this.cancelSchedule_1 = async () => {

			this.HH = time_t1arr[0];
			this.MM = time_t1arr[1];

			try {
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59 && typeof this.mySchedule_1 !== 'undefined') {
					this.mySchedule_1.cancel() && this.log.info('Schedule 1 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					this.log.error('Kein Wochentag gesetzt!');

				} else if (typeof this.mySchedule_1 == 'undefined') {

					this.log.info('Schedule_1 nothing to cancel' );

				} else {

					this.log.error('Unknown Error -- 347');

				}} catch (e) {

				this.log.error('catch -- ' + e);

			}

		};


		this.cancelSchedule_2 = async () => {

			try {
				this.HH = Time[0];
				this.MM = Time[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_2.cancel() && this.log.info('Schedule 2 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					//this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				//this.log.info('Schedule_2_Start ist false' + notinuse);

			}
		};


		this.cancelSchedule_3 = async () => {

			try {
				this.HH = Time[0];
				this.MM = Time[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_3.cancel() && this.log.info('Schedule 3 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					//this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				//this.log.info('Schedule_3_Start ist false' + notinuse);

			}
		};


		this.cancelSchedule_4 = async () => {

			try {
				this.HH = Time[0];
				this.MM = Time[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_4.cancel() && this.log.info('Schedule 4 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					//this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_4_Start ist false' + notinuse);

			}
		};


		this.cancelSchedule_5 = async () => {

			try {
				this.HH = Time[0];
				this.MM = Time[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_5.cancel() && this.log.info('Schedule 5 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					//this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_5_Start ist false' + notinuse);

			}
		};


		this.cancelSchedule_6 = async () => {

			try {
				this.HH = Time[0];
				this.MM = Time[1];
				if (SetSchedule.length !== 0 && this.HH >= 0 && this.HH <= 23 && this.MM >= 0 && this.MM <= 59) {
					this.mySchedule_6.cancel() && this.log.info('Schedule 6 wurde gelöscht!');

				} else if (this.HH < 0 || this.HH > 23 || this.MM < 0 || this.MM > 59) {

					this.log.error('Keine gültige Uhrzeit!');

				} else if (SetSchedule.length == 0) {

					//this.log.error('Kein Wochentag gesetzt!');
				}
			} catch (notinuse) {

				this.log.info('Schedule_6_Start ist false' + notinuse);

			}
		};

		//Cancel Schedules ENDE

		//Schedule starten
		//this.Schedule_1();

		this.setStateAsync('Setup.number_of_triggers', + this.config.numberoftriggers, true );

		if (this.config.numberoftriggers == null) {

			this.log.error('numberoftriggers is NULL!');

		} else if (this.config.numberoftriggers !== null) {

			//this.log.info('Schedule Anzahl ist -- ' + this.config.numberoftriggers);

		}


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

		//this.setState('Setup.HH', '00', true);

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

		//this.setState('Setup.mm', '00', true);

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

		await this.setObjectNotExistsAsync('Weekdays.Sunday', {
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

		await this.setObjectNotExistsAsync('Weekdays.Monday', {
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

		await this.setObjectNotExistsAsync('Weekdays.Tuesday', {
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

		await this.setObjectNotExistsAsync('Weekdays.Wednesday', {
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

		await this.setObjectNotExistsAsync('Weekdays.Thursday', {
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

		await this.setObjectNotExistsAsync('Weekdays.Friday', {
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

		await this.setObjectNotExistsAsync('Weekdays.Saturday', {
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

		await this.setObjectNotExistsAsync('trigger_1.trigger_1', {
			type: 'state',
			common: {
				name: 'trigger_1',
				type: 'boolean',
				role: 'state',
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
				role: 'state',
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
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('trigger_1.t1_weekdays', {
			type: 'state',
			common: {
				name: 't1_weekdays',
				type: 'array',
				role: 'list',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('trigger_1.t1_time', {
			type: 'state',
			common: {
				name: 't1_time',
				type: 'string',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});


		//Permanente Datenpunkte erstellen ENDE


		//Überprüfen ob die Datenpunkte angelegt sind, wenn nicht werden sie neu angelegt
		//in Abhängigkeit zur Anzahl der Trigger die in der this.config eingestellt sind
		if (this.config.numberoftriggers == 1) {

			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 1 sind
			const trigger_2 = await this.getObjectAsync('trigger_2.trigger_2') || await this.getObjectAsync('trigger_2.trigger_2_is_set') || await this.getObjectAsync('trigger_2.trigger_2_Start');
			if (trigger_2) {

				//this.log.warn('datenpunkte trigger_2 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_2.trigger_2');
				await this.delObjectAsync('trigger_2.trigger_2_is_set');
				await this.delObjectAsync('trigger_2.trigger_2_Start');
				await this.delObjectAsync('trigger_2.t2_weekdays');
				await this.delObjectAsync('trigger_2.t2_time');


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
				await this.delObjectAsync('trigger_3.t3_weekdays');
				await this.delObjectAsync('trigger_3.t3_time');

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
				await this.delObjectAsync('trigger_4.t4_weekdays');
				await this.delObjectAsync('trigger_4.t4_time');

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
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');

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
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}


		} else if (this.config.numberoftriggers == 2) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_weekdays', {
				type: 'state',
				common: {
					name: 't2_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_time', {
				type: 'state',
				common: {
					name: 't2_time',
					type: 'string',
					role: 'state',
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

				//this.log.warn('datenpunkte trigger_3 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_3.trigger_3');
				await this.delObjectAsync('trigger_3.trigger_3_is_set');
				await this.delObjectAsync('trigger_3.trigger_3_Start');
				await this.delObjectAsync('trigger_3.t3_weekdays');
				await this.delObjectAsync('trigger_3.t3_time');

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
				await this.delObjectAsync('trigger_4.t4_weekdays');
				await this.delObjectAsync('trigger_4.t4_time');

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
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');

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
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 3) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_weekdays', {
				type: 'state',
				common: {
					name: 't2_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_time', {
				type: 'state',
				common: {
					name: 't2_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_weekdays', {
				type: 'state',
				common: {
					name: 't3_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_time', {
				type: 'state',
				common: {
					name: 't3_time',
					type: 'string',
					role: 'state',
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

				//this.log.warn('datenpunkte trigger_4 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_4.trigger_4');
				await this.delObjectAsync('trigger_4.trigger_4_is_set');
				await this.delObjectAsync('trigger_4.trigger_4_Start');
				await this.delObjectAsync('trigger_4.t4_weekdays');
				await this.delObjectAsync('trigger_4.t4_time');

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
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');

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
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 4) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_weekdays', {
				type: 'state',
				common: {
					name: 't2_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_time', {
				type: 'state',
				common: {
					name: 't2_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_weekdays', {
				type: 'state',
				common: {
					name: 't2_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_time', {
				type: 'state',
				common: {
					name: 't3_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.t4_weekdays', {
				type: 'state',
				common: {
					name: 't4_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.t4_time', {
				type: 'state',
				common: {
					name: 't4_time',
					type: 'string',
					role: 'state',
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

				//this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_5.trigger_5');
				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');

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
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 5) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_weekdays', {
				type: 'state',
				common: {
					name: 't2_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_time', {
				type: 'state',
				common: {
					name: 't2_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_weekdays', {
				type: 'state',
				common: {
					name: 't3_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_time', {
				type: 'state',
				common: {
					name: 't3_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});


			await this.setObjectNotExistsAsync('trigger_4.t4_weekdays', {
				type: 'state',
				common: {
					name: 't4_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.t4_time', {
				type: 'state',
				common: {
					name: 't4_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.t5_weekdays', {
				type: 'state',
				common: {
					name: 't5_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.t5_time', {
				type: 'state',
				common: {
					name: 't5_time',
					type: 'string',
					role: 'state',
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

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_6.trigger_6');
				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 6) {

			await this.setObjectNotExistsAsync('trigger_2.trigger_2', {
				type: 'state',
				common: {
					name: 'trigger_2',
					type: 'boolean',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_weekdays', {
				type: 'state',
				common: {
					name: 't2_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.t2_time', {
				type: 'state',
				common: {
					name: 't2_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_weekdays', {
				type: 'state',
				common: {
					name: 't3_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.t3_time', {
				type: 'state',
				common: {
					name: 't3_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.t4_weekdays', {
				type: 'state',
				common: {
					name: 't4_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.t4_time', {
				type: 'state',
				common: {
					name: 't4_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.t5_weekdays', {
				type: 'state',
				common: {
					name: 't5_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.t5_time', {
				type: 'state',
				common: {
					name: 't5_time',
					type: 'string',
					role: 'state',
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
					role: 'state',
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
					role: 'state',
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
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_6.t6_weekdays', {
				type: 'state',
				common: {
					name: 't6_weekdays',
					type: 'array',
					role: 'list',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_6.t6_time', {
				type: 'state',
				common: {
					name: 't6_time',
					type: 'string',
					role: 'state',
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

			this.subscribeStates('trigger_6.trigger_6');
			this.subscribeStates('trigger_6.trigger_6_Start');

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


		// Reset the connection indicator during startup

		this.setState('info.connection', true, true);

		//Wochentage auf einen Wert setzten
		this.setState('Weekdays.Sunday', true, true);
		this.setState('Weekdays.Monday', false, true);
		this.setState('Weekdays.Tuesday', false, true);
		this.setState('Weekdays.Wednesday', false, true);
		this.setState('Weekdays.Thursday', false, true);
		this.setState('Weekdays.Friday', false, true);
		this.setState('Weekdays.Saturday', true, true);

		//Datenpunkt trigger 1 auf false setzen (Aulöser für Anktion wenn true)
		this.setState('trigger_1.trigger_1', false, true);

		//trigger 1 Start auf false setzten - wird also nicht Scheduled
		this.setState('trigger_1.trigger_1_Start', false, true);

		//Setup.SetTrigger auf 0 setzen - somit wird keine Uhrzeit oder Wochentag versehentlich verstellt
		//wenn an Uhrzeit oder Wochentagen etwas geändert wird
		this.setState('Setup.SetTrigger', '0', true);

		//hier werden Datenpunkt Änderungen im Log angezeigt

		this.subscribeStates('Setup.HH');
		this.subscribeStates('Setup.mm');

		this.subscribeStates('Setup.SetTrigger');

		this.subscribeStates('trigger_1.trigger_1');
		this.subscribeStates('trigger_1.trigger_1_Start');

		this.subscribeStates('Weekdays.Monday');
		this.subscribeStates('Weekdays.Tuesday');
		this.subscribeStates('Weekdays.Wednesday');
		this.subscribeStates('Weekdays.Thursday');
		this.subscribeStates('Weekdays.Friday');
		this.subscribeStates('Weekdays.Saturday');
		this.subscribeStates('Weekdays.Sunday');

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

			const hours = await this.getStateAsync('Setup.HH');
			const hoursval = hours ? hours.val: '00';

			const Stunden = async () => {

				this.log.info('HH wurde geändert -- ' + hoursval);

			};

			if (id == 'time_switch_clock.0.Setup.HH') {
				Stunden();
			}


			const minutes = await this.getStateAsync('Setup.mm');
			const minutesval = minutes ? minutes.val: '00';

			const Minuten = async () => {

				this.log.info('mm wurden geändert -- ' + minutesval);

			};

			if (id == 'time_switch_clock.0.Setup.HH') {
				Minuten();
			}



			//bei Änderung der Datenpunkte true oder false auswerten
			const SUN = await this.getStateAsync('Weekdays.Sunday');
			const statusSUN = SUN ? SUN.val: false;

			const Sunday = async () => {
				if (statusSUN == true) {
					this.log.info('SO ist ' + statusSUN);
				} else if (statusSUN == false) {
					this.log.info('So ist ' + statusSUN);
				} else {
					this.log.error('Error SO = ' + statusSUN);
				}};

			if (id == 'time_switch_clock.0.Weekdays.Sunday') {
				Sunday();
			}

			const MON = await this.getStateAsync('Weekdays.Monday');
			const statusMON = MON ? MON.val: false;

			const Monday = async () => {
				if (statusMON == true) {
					this.log.info('MO ist ' + statusMON);
				} else if (statusMON == false) {
					this.log.info('MO ist ' + statusMON);
				} else {
					this.log.error('Error MO = ' + statusMON);
				}};

			if (id == 'time_switch_clock.0.Weekdays.Monday') {
				Monday();
			}

			const TUE = await this.getStateAsync('Weekdays.Tuesday');
			const statusTUE = TUE ? TUE.val: false;

			const Tuesday = async () => {
				if (statusTUE == true) {
					this.log.info('DI ist ' + statusTUE);
				} else if (statusTUE == false) {
					this.log.info('DI ist ' + statusTUE);
				} else {
					this.log.error('Error DI = ' + statusTUE);
				}};

			if (id == 'time_switch_clock.0.Weekdays.Tuesday') {
				Tuesday();
			}

			const WED = await this.getStateAsync('Weekdays.Wednesday');
			const statusWED = WED ? WED.val: false;

			const Wednesday = async () => {
				if (statusWED == true) {
					this.log.info('MI ist ' + statusWED);
				} else if (statusWED == false) {
					this.log.info('MI ist ' + statusWED);
				} else {
					this.log.error('Error MI = ' + statusWED);
				}};

			if (id == 'time_switch_clock.0.Weekdays.Wednesday') {
				Wednesday();
			}

			const THU = await this.getStateAsync('Weekdays.Thursday');
			const statusTHU = THU ? THU.val: false;

			const Thursday = async () => {
				if (statusTHU == true) {
					this.log.info('DO ist ' + statusTHU);
				} else if (statusTHU == false) {
					this.log.info('DO ist ' + statusTHU);
				} else {
					this.log.error('Error DO = ' + statusTHU);
				}};

			if (id == 'time_switch_clock.0.Weekdays.Thursday') {
				Thursday();
			}

			const FRI = await this.getStateAsync('Weekdays.Friday');
			const statusFRI = FRI ? FRI.val: false;

			const Friday = async () => {
				if (statusFRI == true) {
					this.log.info('FR ist ' + statusFRI);
				} else if (statusFRI == false) {
					this.log.info('FR ist ' + statusFRI);
				} else {
					this.log.error('Error FR = ' + statusFRI);
				}};

			if (id == 'time_switch_clock.0.Weekdays.Friday') {
				Friday();
			}

			const SAT = await this.getStateAsync('Weekdays.Saturday');
			const statusSAT = SAT ? SAT.val: true;

			const Saturday = async () => {
				if (statusSAT == true) {
					this.log.info ('SA ist ' + statusSAT);
				} else if (statusSAT == false) {
					this.log.info('SA ist ' + statusSAT);
				} else {
					this.log.error('Error SA = ' + statusSAT);
				}};

			if (id == 'time_switch_clock.0.Weekdays.Saturday') {
				Saturday();
			}

			//bei Änderung des der Datenpunkte Array neu schreiben
			//Sunday
			if (statusSUN == true) {
				SetWeekdays.splice(0,1, 'Sunday');

			}  else if (statusSUN == false) {
				SetWeekdays.splice(0,1, 'x');

			}	else {
				this.log.error('else... ' + statusSUN);
			}

			//Monday
			if (statusMON == true) {
				SetWeekdays.splice(1,1, 'Monday');

			}  else if (statusMON == false) {
				SetWeekdays.splice(1,1, 'x');

			}	else {
				this.log.error('else... ' + statusMON);
			}

			//Tuesday
			if (statusTUE == true) {
				SetWeekdays.splice(2,1, 'Tuesday');

			}  else if (statusTUE == false) {
				SetWeekdays.splice(2,1, 'x');

			}	else {
				this.log.error('else... ' + statusTUE);
			}

			//Wednesday
			if (statusWED == true) {
				SetWeekdays.splice(3,1, 'Wednesday');

			}  else if (statusWED == false) {
				SetWeekdays.splice(3,1, 'x');

			}	else {
				this.log.error('else... ' + statusWED);
			}

			//Thursday
			if (statusTHU == true) {
				SetWeekdays.splice(4,1, 'Thursday');

			}  else if (statusTHU == false) {
				SetWeekdays.splice(4,1, 'x');

			}	else {
				this.log.error('else... ' + statusTHU);
			}

			//Friday
			if (statusFRI == true) {
				SetWeekdays.splice(5,1, 'Friday');

			}  else if (statusFRI == false) {
				SetWeekdays.splice(5,1, 'x');

			}	else {
				this.log.error('else... ' + statusFRI);
			}

			//Saturday
			if (statusSAT == true) {
				SetWeekdays.splice(6,1, 'Saturday');

			}  else if (statusSAT == false) {
				SetWeekdays.splice(6,1, 'x');

			}	else {
				this.log.error('else... ' + statusSAT);
			}


			//Array SetWochentage auf Werte überprüfen und neues Array SetSchedule schreiben
			const killSO = SetWeekdays.indexOf('Sunday');
			if (killSO !== -1 && SetSchedule.indexOf(0) == -1) {
				SetSchedule.splice(0,0, 0);

			} else if (killSO == -1 && SetSchedule.indexOf(0) == 0) {

				const searchSO = (element) => element == 0;
				SetSchedule.splice(SetSchedule.findIndex(searchSO),1);

			}

			const killMO = SetWeekdays.indexOf('Monday');
			if (killMO != -1 && SetSchedule.indexOf(1) == -1) {
				SetSchedule.splice(0,0, 1);

			} else if (killMO == -1 && SetSchedule.indexOf(1) !== -1) {

				const searchMO = (element) => element == 1;
				SetSchedule.splice(SetSchedule.findIndex(searchMO),1);
			}

			const killDI = SetWeekdays.indexOf('Tuesday');
			if (killDI != -1 && SetSchedule.indexOf(2) == -1) {
				SetSchedule.splice(0,0, 2);

			} else if (killDI == -1 && SetSchedule.indexOf(2) !==-1) {

				const searchDI = (element) => element == 2;
				SetSchedule.splice(SetSchedule.findIndex(searchDI),1);
			}

			const killMI = SetWeekdays.indexOf('Wednesday');
			if (killMI != -1 && SetSchedule.indexOf(3) == -1) {
				SetSchedule.splice(0,0, 3);

			} else if (killMI == -1 && SetSchedule.indexOf(3) !== -1) {

				const searchMI = (element) => element == 3;
				SetSchedule.splice(SetSchedule.findIndex(searchMI),1);
			}

			const killDO = SetWeekdays.indexOf('Thursday');
			if (killDO != -1 && SetSchedule.indexOf(4) == -1) {
				SetSchedule.splice(0,0, 4);

			} else if (killDO == -1 && SetSchedule.indexOf(4) !== -1) {

				const searchDO = (element) => element == 4;
				SetSchedule.splice(SetSchedule.findIndex(searchDO),1);
			}

			const killFR = SetWeekdays.indexOf('Friday');
			if (killFR != -1 && SetSchedule.indexOf(5) == -1) {
				SetSchedule.splice(0,0, 5);

			} else if (killFR == -1 && SetSchedule.indexOf(5) !== -1) {

				const searchFR = (element) => element == 5;
				SetSchedule.splice(SetSchedule.findIndex(searchFR),1);
			}

			const killSA = SetWeekdays.indexOf('Saturday');
			if (killSA != -1 && SetSchedule.indexOf(6) == -1) {
				SetSchedule.splice(0,0, 6);

			} else if (killSA == -1 && SetSchedule.indexOf(6) !== -1) {

				const searchSA = (element) => element == 6;
				SetSchedule.splice(SetSchedule.findIndex(searchSA),1);
			}

			//HH geändert:
			const HH_1 = await this.getStateAsync('Setup.HH');
			if (HH_1) {

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				if (SetTrigger == 1) {

					const new_HH_1 = HH_1 ? HH_1.val: '00';

					Time.splice(0,1, new_HH_1);

					time_t1arr.splice(0,1, new_HH_1);

					this.setState('trigger_1.t1_time', time_t1arr[0] + ':' + time_t1arr[1] , true);

					//this.log.warn('hier ist die neue HH für SetTrigger = 1 -- ' + new_HH_1);

				} else if (SetTrigger == 2 && number_of_triggers >= 2) {

					const new_HH_1 = HH_1 ? HH_1.val: '00';

					Time.splice(0,1, new_HH_1);

					time_t2arr.splice(0,1, new_HH_1);

					this.setState('trigger_2.t2_time', time_t2arr[0] + ':' + time_t2arr[1] , true);

					//this.log.warn('hier ist die neue HH für SetTrigger = 2 -- ' + new_HH_1);

				} else if (SetTrigger == 3 && number_of_triggers >= 3) {

					const new_HH_1 = HH_1 ? HH_1.val: '00';

					Time.splice(0,1, new_HH_1);

					time_t3arr.splice(0,1, new_HH_1);

					this.setState('trigger_3.t3_time', time_t3arr[0] + ':' + time_t3arr[1] , true);

					//this.log.warn('hier ist die neue HH für SetTrigger = 2 -- ' + new_HH_1);

				} else if (SetTrigger == 4 && number_of_triggers >= 4) {

					const new_HH_1 = HH_1 ? HH_1.val: '00';

					Time.splice(0,1, new_HH_1);

					time_t4arr.splice(0,1, new_HH_1);

					this.setState('trigger_4.t4_time', time_t4arr[0] + ':' + time_t4arr[1] , true);

					//this.log.warn('hier ist die neue HH für SetTrigger = 2 -- ' + new_HH_1);

				} else if (SetTrigger == 5 && number_of_triggers >= 5) {

					const new_HH_1 = HH_1 ? HH_1.val: '00';

					Time.splice(0,1, new_HH_1);

					time_t5arr.splice(0,1, new_HH_1);

					this.setState('trigger_5.t5_time', time_t5arr[0] + ':' + time_t5arr[1] , true);

					//this.log.warn('hier ist die neue HH für SetTrigger = 2 -- ' + new_HH_1);

				} else if (SetTrigger == 6 && number_of_triggers == 6) {

					const new_HH_1 = HH_1 ? HH_1.val: '00';

					Time.splice(0,1, new_HH_1);

					time_t6arr.splice(0,1, new_HH_1);

					this.setState('trigger_6.t6_time', time_t6arr[0] + ':' + time_t6arr[1] , true);

					//this.log.warn('hier ist die neue HH für SetTrigger = 2 -- ' + new_HH_1);

				}


			} else {

				this.log.error('Uhrzeit -HH- Error -- ');

			}



			//mm geändert:
			const mm_1 = await this.getStateAsync('Setup.mm');
			if (mm_1) {

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				if (SetTrigger == 1) {

					const new_mm_1 = mm_1 ? mm_1.val: '00';

					Time.splice(1,1, new_mm_1);

					time_t1arr.splice(1,1, new_mm_1);

					this.setState('trigger_1.t1_time', time_t1arr[0] + ':' + time_t1arr[1] , true);

					//this.log.warn('hier ist die neue mm für SetTrigger = 1 -- ' + new_mm_1);

				} else if (SetTrigger == 2 && number_of_triggers >= 2) {

					const new_mm_1 = mm_1 ? mm_1.val: '00';

					Time.splice(1,1, new_mm_1);

					time_t2arr.splice(1,1, new_mm_1);

					this.setState('trigger_2.t2_time', time_t2arr[0] + ':' + time_t2arr[1] , true);

					//this.log.warn('hier ist die neue mm für SetTrigger = 2 -- ' + new_mm_1);

				} else if (SetTrigger == 3 && number_of_triggers >= 3) {

					const new_mm_1 = mm_1 ? mm_1.val: '00';

					Time.splice(1,1, new_mm_1);

					time_t3arr.splice(1,1, new_mm_1);

					this.setState('trigger_3.t3_time', time_t3arr[0] + ':' + time_t3arr[1] , true);

					//this.log.warn('hier ist die neue mm für SetTrigger = 2 -- ' + new_mm_1);

				} else if (SetTrigger == 4 && number_of_triggers >= 4) {

					const new_mm_1 = mm_1 ? mm_1.val: '00';

					Time.splice(1,1, new_mm_1);

					time_t4arr.splice(1,1, new_mm_1);

					this.setState('trigger_4.t4_time', time_t4arr[0] + ':' + time_t4arr[1] , true);

					//this.log.warn('hier ist die neue mm für SetTrigger = 2 -- ' + new_mm_1);

				} else if (SetTrigger == 5 && number_of_triggers >= 5) {

					const new_mm_1 = mm_1 ? mm_1.val: '00';

					Time.splice(1,1, new_mm_1);

					time_t5arr.splice(1,1, new_mm_1);

					this.setState('trigger_5.t5_time', time_t5arr[0] + ':' + time_t5arr[1] , true);

					//this.log.warn('hier ist die neue mm für SetTrigger = 2 -- ' + new_mm_1);

				} else if (SetTrigger == 6 && number_of_triggers == 6) {

					const new_mm_1 = mm_1 ? mm_1.val: '00';

					Time.splice(1,1, new_mm_1);

					time_t6arr.splice(1,1, new_mm_1);

					this.setState('trigger_6.t6_time', time_t6arr[0] + ':' + time_t6arr[1] , true);

					//this.log.warn('hier ist die neue mm für SetTrigger = 2 -- ' + new_mm_1);
				}

				//const new_mm_1 = mm_1 ? mm_1.val: '00';

				//Time.splice(1,1, new_mm_1);

			} else {

				this.log.error('Uhrzeit -mm- Error -- ');

			}


			//trigger_1_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_1Start_test = await this.getObjectAsync('trigger_1.trigger_1_Start');

			if (trigger_1Start_test) {

				const triggerStart_1 = await this.getStateAsync('trigger_1.trigger_1_Start');
				const StatusTriggerStart = triggerStart_1.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const triggerStartAction_true_1 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 1) {

						weekdays_t1arr = SetSchedule;

						this.setState('trigger_1.t1_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t1arr[0];
						const mm_1 = time_t1arr[1];

						this.setState('trigger_1.trigger_1_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_1();



					} else if (StatusTriggerStart == true && SetTrigger !== 1) {

						try {
							const time_1 = await this.getStateAsync('trigger_1.t1_time');
							const read_time_1 = time_1.val;

							const [hh, mm] = read_time_1.split(':');
							const hh_1 = hh ? hh: 'not';
							const mm_1 = mm ? mm: 'set';

							time_t1arr.splice(0,1, hh_1);
							time_t1arr.splice(1,1, mm_1);

							const weekdays_t1 = await this.getStateAsync('trigger_1.t1_weekdays');
							const weekdays_t1_val = JSON.parse(weekdays_t1.val);

							weekdays_t1arr = weekdays_t1_val;

							this.setState('trigger_1.trigger_1_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t1arr, true);

							this.Schedule_1();

						} catch (e1) {

							this.log.error('Check the time of Schedule 1! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_1();
						this.setState('trigger_1.trigger_1_is_set', 'not scheduled', true);
						weekdays_t1arr.splice(0, weekdays_t1arr.length);

					}};


				triggerStartAction_true_1();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_2_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Weekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_2Start_test = await this.getObjectAsync('trigger_2.trigger_2_Start');

			if (trigger_2Start_test) {

				const triggerStart_2 = await this.getStateAsync('trigger_2.trigger_2_Start');
				const StatusTriggerStart = triggerStart_2.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				const triggerStartAction_true_2 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 2 && number_of_triggers >= 2) {

						weekdays_t2arr = SetSchedule;

						this.setState('trigger_2.t2_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t2arr[0];
						const mm_1 = time_t2arr[1];

						this.setState('trigger_2.trigger_2_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_2();



					} else if (StatusTriggerStart == true && SetTrigger !== 2 && number_of_triggers >= 2) {

						try {
							const time_2 = await this.getStateAsync('trigger_2.t2_time');
							const read_time_2 = time_2.val;

							const [hh, mm] = read_time_2.split(':');
							const hh_1 = hh ? hh: 'not';
							const mm_1 = mm ? mm: 'set';

							time_t2arr.splice(0,1, hh_1);
							time_t2arr.splice(1,1, mm_1);

							const weekdays_t2 = await this.getStateAsync('trigger_2.t2_weekdays');
							const weekdays_t2_val = JSON.parse(weekdays_t2.val);

							weekdays_t2arr = weekdays_t2_val;

							this.setState('trigger_2.trigger_2_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t2arr, true);

							this.Schedule_2();

						} catch (e2) {

							this.log.error('Check the time of Schedule 2! -- ' + e2);

						}




					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_2();
						this.setState('trigger_2.trigger_2_is_set', 'not scheduled', true);
						weekdays_t2arr.splice(0, weekdays_t2arr.length);

					}};


				triggerStartAction_true_2();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_3_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Weekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_3Start_test = await this.getObjectAsync('trigger_3.trigger_3_Start');

			if (trigger_3Start_test) {

				const triggerStart_3 = await this.getStateAsync('trigger_3.trigger_3_Start');
				const StatusTriggerStart = triggerStart_3.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				const triggerStartAction_true_3 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 3 && number_of_triggers >= 3) {

						weekdays_t3arr = SetSchedule;

						this.setState('trigger_3.t3_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t3arr[0];
						const mm_1 = time_t3arr[1];

						this.setState('trigger_3.trigger_3_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_3();



					} else if (StatusTriggerStart == true && SetTrigger !== 3 && number_of_triggers >= 3) {

						try {
							const time_3 = await this.getStateAsync('trigger_3.t3_time');
							const read_time_3 = time_3.val;

							const [hh, mm] = read_time_3.split(':');
							const hh_1 = hh ? hh: 'not';
							const mm_1 = mm ? mm: 'set';

							time_t3arr.splice(0,1, hh_1);
							time_t3arr.splice(1,1, mm_1);

							const weekdays_t3 = await this.getStateAsync('trigger_3.t3_weekdays');
							const weekdays_t3_val = JSON.parse(weekdays_t3.val);

							weekdays_t3arr = weekdays_t3_val;

							this.setState('trigger_3.trigger_3_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t3arr, true);

							this.Schedule_3();

						} catch (e3) {

							this.log.error('Check the time of Schedule 3! -- ' + e3);

						}


					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_3();
						this.setState('trigger_3.trigger_3_is_set', 'not scheduled', true);
						weekdays_t3arr.splice(0, weekdays_t3arr.length);

					}};


				triggerStartAction_true_3();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_4_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Weekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_4Start_test = await this.getObjectAsync('trigger_4.trigger_4_Start');

			if (trigger_4Start_test) {

				const triggerStart_4 = await this.getStateAsync('trigger_4.trigger_4_Start');
				const StatusTriggerStart = triggerStart_4.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				const triggerStartAction_true_4 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 4 && number_of_triggers >= 4) {

						weekdays_t4arr = SetSchedule;

						this.setState('trigger_4.t4_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t4arr[0];
						const mm_1 = time_t4arr[1];

						this.setState('trigger_4.trigger_4_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_4();



					} else if (StatusTriggerStart == true && SetTrigger !== 4 && number_of_triggers >= 4) {

						try {
							const time_4 = await this.getStateAsync('trigger_4.t4_time');
							const read_time_4 = time_4.val;

							const [hh, mm] = read_time_4.split(':');
							const hh_1 = hh ? hh: 'not';
							const mm_1 = mm ? mm: 'set';

							time_t4arr.splice(0,1, hh_1);
							time_t4arr.splice(1,1, mm_1);

							const weekdays_t4 = await this.getStateAsync('trigger_4.t4_weekdays');
							const weekdays_t4_val = JSON.parse(weekdays_t4.val);

							weekdays_t4arr = weekdays_t4_val;

							this.setState('trigger_4.trigger_4_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t4arr, true);

							this.Schedule_4();

						} catch (e4) {

							this.log.error('Check the time of Schedule 4! -- ' + e4);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_4();
						this.setState('trigger_4.trigger_4_is_set', 'not scheduled', true);
						weekdays_t4arr.splice(0, weekdays_t4arr.length);

					}};


				triggerStartAction_true_4();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_5_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Weekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_5Start_test = await this.getObjectAsync('trigger_5.trigger_5_Start');

			if (trigger_5Start_test) {

				const triggerStart_5 = await this.getStateAsync('trigger_5.trigger_5_Start');
				const StatusTriggerStart = triggerStart_5.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				const triggerStartAction_true_5 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 5 && number_of_triggers >= 5) {

						weekdays_t5arr = SetSchedule;

						this.setState('trigger_5.t5_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t5arr[0];
						const mm_1 = time_t5arr[1];

						this.setState('trigger_5.trigger_5_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_5();



					} else if (StatusTriggerStart == true && SetTrigger !== 5 && number_of_triggers >= 5) {

						try {
							const time_5 = await this.getStateAsync('trigger_5.t5_time');
							const read_time_5 = time_5.val;

							const [hh, mm] = read_time_5.split(':');
							const hh_1 = hh ? hh: 'not';
							const mm_1 = mm ? mm: 'set';

							time_t5arr.splice(0,1, hh_1);
							time_t5arr.splice(1,1, mm_1);

							const weekdays_t5 = await this.getStateAsync('trigger_5.t5_weekdays');
							const weekdays_t5_val = JSON.parse(weekdays_t5.val);

							weekdays_t5arr = weekdays_t5_val;

							this.setState('trigger_5.trigger_5_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t5arr, true);

							this.Schedule_5();

						} catch (e5) {

							this.log.error('Check the time of Schedule 5! -- ' + e5);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_5();
						this.setState('trigger_5.trigger_5_is_set', 'not scheduled', true);
						weekdays_t5arr.splice(0, weekdays_t5arr.length);

					}};


				triggerStartAction_true_5();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_6_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = Weekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_6Start_test = await this.getObjectAsync('trigger_6.trigger_6_Start');

			if (trigger_6Start_test) {

				const triggerStart_6 = await this.getStateAsync('trigger_6.trigger_6_Start');
				const StatusTriggerStart = triggerStart_6.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				const triggerStartAction_true_6 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 6 && number_of_triggers == 6) {

						weekdays_t6arr = SetSchedule;

						this.setState('trigger_6.t6_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t6arr[0];
						const mm_1 = time_t6arr[1];

						this.setState('trigger_6.trigger_6_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_6();



					} else if (StatusTriggerStart == true && SetTrigger !== 6 && number_of_triggers == 6) {

						try {
							const time_6 = await this.getStateAsync('trigger_6.t6_time');
							const read_time_6 = time_6.val;

							const [hh, mm] = read_time_6.split(':');
							const hh_1 = hh ? hh: 'not';
							const mm_1 = mm ? mm: 'set';

							time_t6arr.splice(0,1, hh_1);
							time_t6arr.splice(1,1, mm_1);

							const weekdays_t6 = await this.getStateAsync('trigger_6.t6_weekdays');
							const weekdays_t6_val = JSON.parse(weekdays_t6.val);

							weekdays_t6arr = weekdays_t6_val;

							this.setState('trigger_6.trigger_6_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t6arr, true);

							this.Schedule_6();

						} catch (e6) {

							this.log.error('Check the time of Schedule 6! -- ' + e6);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_6();
						this.setState('trigger_6.trigger_6_is_set', 'not scheduled', true);
						weekdays_t6arr.splice(0, weekdays_t6arr.length);

					}};


				triggerStartAction_true_6();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

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
