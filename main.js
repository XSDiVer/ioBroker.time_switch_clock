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

//Array für Datenpunkte die geschaltet werden sollen - goforit
let DP_1arr = [];
let DP_2arr = [];
let DP_3arr = [];
let DP_4arr = [];
let DP_5arr = [];
let DP_6arr = [];

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

//nach SetTimeout die TimeOut ID in Array schreiben um SetTrigger wieder auf '0' zu setzten
let SetTrigger_Stop_arr = [];

//merken - wird gebraucht
//this.log.error('Instanz -- ' + this.instance);
//this.log.error('namespace -- ' + this.namespace);

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


		this.Schedule_1 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t1arr[0];
			const MM = time_t1arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t1arr];

			const goandtrigger = [DP_1arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 !== 'undefined' && SetTrigger == 1 && SetSchedule.length !== 0) {

				this.mySchedule_1.cancel();

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_1_go());
				this.setStateAsync('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 1 -- ' + this.mySchedule_1.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 == 'undefined' && SetTrigger == 1 && SetSchedule.length !== 0) {

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_1_go());
				this.setStateAsync('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 !== 'undefined' && SetTrigger !== 1 && weekdays_t1arr.length !== 0) {

				this.mySchedule_1.cancel();

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_1_go());
				this.setStateAsync('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 1 -- ' + this.mySchedule_1.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_1 == 'undefined' && SetTrigger !== 1 && weekdays_t1arr.length !== 0) {

				this.mySchedule_1 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*' + ' ' + '*' + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_1_go());
				this.setStateAsync('trigger_1.trigger_1_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t1arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 1');
				this.setStateAsync('trigger_1.trigger_1_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 1 -- ' + HH + ':' + MM);
				this.setStateAsync('trigger_1.trigger_1_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 1 -- Uhrzeit ' + HH + ':' + MM);
				this.setStateAsync('trigger_1.trigger_1_Start', false, true);

			}
		};

		//läuft hier rein sobald Schedule 1 - 6 ausgelöst werden:
		this.Schedule_1_go = async () => {

			this.log.info('Schedule 1 ausgelöst!');

			const waitS1 = this.setTimeout( async () => {this.log.info('Schedule 1 auf false gesetzt! - ' + timer_t1arr + ' Sek später');
				this.setForeignStateAsync(DP_1arr.toString() , false);

			}, timer_t1arr*1000);

			stopp_timer1_arr = waitS1;

		};



		this.Schedule_2 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t2arr[0];
			const MM = time_t2arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t2arr];

			const goandtrigger = [DP_2arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 !== 'undefined' && SetTrigger == 2 && SetSchedule.length !== 0) {

				this.mySchedule_2.cancel();

				this.mySchedule_2= schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_2_go());
				this.setStateAsync('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 2 -- ' + this.mySchedule_2.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 == 'undefined' && SetTrigger == 2 && SetSchedule.length !== 0) {

				this.mySchedule_2 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_2_go());
				this.setStateAsync('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 !== 'undefined' && SetTrigger !== 2 && weekdays_t2arr.length !== 0) {

				this.mySchedule_2.cancel();

				this.mySchedule_2 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_2_go());
				this.setStateAsync('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 2 -- ' + this.mySchedule_2.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_2 == 'undefined' && SetTrigger !== 2 && weekdays_t2arr.length !== 0) {

				this.mySchedule_2 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_2_go());
				this.setStateAsync('trigger_2.trigger_2_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t2arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 1');
				this.setStateAsync('trigger_2.trigger_2_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 2 -- ' + HH + ':' + MM);
				this.setStateAsync('trigger_2.trigger_2_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 2 -- Uhrzeit ' + HH + ':' + MM);
				this.setStateAsync('trigger_2.trigger_2_Start', false, true);

			}
		};

		//läuft hier rein sobald Schedule 1 - 6 ausgelöst werden:
		this.Schedule_2_go = async () => {

			this.log.info('Schedule 2 ausgelöst!');

			const waitS2 = this.setTimeout( async () => {this.log.info('Schedule 2 auf false gesetzt! - ' + timer_t2arr + ' Sek später');
				this.setForeignStateAsync(DP_2arr.toString() , false);

			}, timer_t2arr*1000);

			stopp_timer2_arr = waitS2;

		};


		this.Schedule_3 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t3arr[0];
			const MM = time_t3arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t3arr];

			const goandtrigger = [DP_3arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 !== 'undefined' && SetTrigger == 3 && SetSchedule.length !== 0) {

				this.mySchedule_3.cancel();

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_3_go());
				this.setStateAsync('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 3 -- ' + this.mySchedule_3.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 == 'undefined' && SetTrigger == 3 && SetSchedule.length !== 0) {

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_3_go());
				this.setStateAsync('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 !== 'undefined' && SetTrigger !== 3 && weekdays_t3arr.length !== 0) {

				this.mySchedule_3.cancel();

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_3_go());
				this.setStateAsync('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 3 -- ' + this.mySchedule_3.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_3 == 'undefined' && SetTrigger !== 3 && weekdays_t3arr.length !== 0) {

				this.mySchedule_3 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_3_go());
				this.setStateAsync('trigger_3.trigger_3_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t3arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 3');
				this.setStateAsync('trigger_3.trigger_3_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 3 -- ' + HH + ':' + MM);
				this.setStateAsync('trigger_3.trigger_3_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 3 -- Uhrzeit ' + HH + ':' + MM);
				this.setStateAsync('trigger_3.trigger_3_Start', false, true);

			}
		};

		//läuft hier rein sobald Schedule 1 - 6 ausgelöst werden:
		this.Schedule_3_go = async () => {

			this.log.info('Schedule 3 ausgelöst!');

			const waitS3 = this.setTimeout( async () => {this.log.info('Schedule 3 auf false gesetzt! - ' + timer_t3arr + ' Sek später');
				this.setForeignStateAsync(DP_3arr.toString() , false);

			}, timer_t3arr*1000);

			stopp_timer3_arr = waitS3;

		};


		this.Schedule_4 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t4arr[0];
			const MM = time_t4arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t4arr];

			const goandtrigger = [DP_4arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 !== 'undefined' && SetTrigger == 4 && SetSchedule.length !== 0) {

				this.mySchedule_4.cancel();

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_4_go());
				this.setStateAsync('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 4 -- ' + this.mySchedule_4.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 == 'undefined' && SetTrigger == 4 && SetSchedule.length !== 0) {

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_4_go());
				this.setStateAsync('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 !== 'undefined' && SetTrigger !== 4 && weekdays_t4arr.length !== 0) {

				this.mySchedule_4.cancel();

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_4_go());
				this.setStateAsync('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 4 -- ' + this.mySchedule_4.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_4 == 'undefined' && SetTrigger !== 4 && weekdays_t4arr.length !== 0) {

				this.mySchedule_4 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_4_go());
				this.setStateAsync('trigger_4.trigger_4_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t4arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 4');
				this.setStateAsync('trigger_4.trigger_4_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 4 -- ' + HH + ':' + MM);
				this.setStateAsync('trigger_4.trigger_4_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 4 -- Uhrzeit ' + HH + ':' + MM);
				this.setStateAsync('trigger_4.trigger_4_Start', false, true);

			}
		};

		//läuft hier rein sobald Schedule 1 - 6 ausgelöst werden:
		this.Schedule_4_go = async () => {

			this.log.info('Schedule 4 ausgelöst!');

			const waitS4 = this.setTimeout( async () => {this.log.info('Schedule 4 auf false gesetzt! - ' + timer_t4arr + ' Sek später');
				this.setForeignStateAsync(DP_4arr.toString() , false);

			}, timer_t4arr*1000);

			stopp_timer4_arr = waitS4;

		};


		this.Schedule_5 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t5arr[0];
			const MM = time_t5arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t5arr];

			const goandtrigger = [DP_5arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 !== 'undefined' && SetTrigger == 5 && SetSchedule.length !== 0) {

				this.mySchedule_5.cancel();

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_5_go());
				this.setStateAsync('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 5 -- ' + this.mySchedule_5.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 == 'undefined' && SetTrigger == 5 && SetSchedule.length !== 0) {

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_5_go());
				this.setStateAsync('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 !== 'undefined' && SetTrigger !== 5 && weekdays_t5arr.length !== 0) {

				this.mySchedule_5.cancel();

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_5_go());
				this.setStateAsync('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 5 -- ' + this.mySchedule_5.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_5 == 'undefined' && SetTrigger !== 5 && weekdays_t5arr.length !== 0) {

				this.mySchedule_5 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_5_go());
				this.setStateAsync('trigger_5.trigger_5_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t5arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 5');
				this.setStateAsync('trigger_5.trigger_5_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 5 -- ' + HH + ':' + MM);
				this.setStateAsync('trigger_5.trigger_5_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 5 -- Uhrzeit ' + HH + ':' + MM);
				this.setStateAsync('trigger_5.trigger_5_Start', false, true);

			}
		};

		//läuft hier rein sobald Schedule 1 - 6 ausgelöst werden:
		this.Schedule_5_go = async () => {

			this.log.info('Schedule 5 ausgelöst!');

			const waitS5 = this.setTimeout( async () => {this.log.info('Schedule 5 auf false gesetzt! - ' + timer_t5arr + ' Sek später');
				this.setForeignStateAsync(DP_5arr.toString() , false);

			}, timer_t5arr*1000);

			stopp_timer5_arr = waitS5;

		};


		this.Schedule_6 = async () => {

			const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
			const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

			const HH = time_t6arr[0];
			const MM = time_t6arr[1];

			const WDays = [SetSchedule];

			const WDaysarr = [weekdays_t6arr];

			const goandtrigger = [DP_6arr];


			if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 !== 'undefined' && SetTrigger == 6 && SetSchedule.length !== 0) {

				this.mySchedule_6.cancel();

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_6_go());
				this.setStateAsync('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true) + this.log.info('next Schedule 6 -- ' + this.mySchedule_6.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 == 'undefined' && SetTrigger == 6 && SetSchedule.length !== 0) {

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDays.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_6_go());
				this.setStateAsync('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDays, true);



			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 !== 'undefined' && SetTrigger !== 6 && weekdays_t6arr.length !== 0) {

				this.mySchedule_6.cancel();

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_6_go());
				this.setStateAsync('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true) + this.log.info('next Schedule 6 -- ' + this.mySchedule_6.nextInvocation());

			} else if (HH >= 0 && HH <= 23 && MM >= 0 && MM <= 59 && typeof this.mySchedule_6 == 'undefined' && SetTrigger !== 6 && weekdays_t6arr.length !== 0) {

				this.mySchedule_6 = schedule.scheduleJob(MM.toString().trim() + ' ' + HH.toString().trim() + ' ' + '*'.toString().trim() + ' ' + '*'.toString().trim() + ' ' + WDaysarr.toString().trim(), async () =>
					this.setForeignStateAsync(goandtrigger.toString() , true) && this.Schedule_6_go());
				this.setStateAsync('trigger_6.trigger_6_is_set', '' + HH + ':' + MM + ' -- ' + WDaysarr, true);

			} else if (SetSchedule.length == 0 || weekdays_t6arr.length == 0) {


				this.log.error('Kein Wochentag gesetzt bei Schedule 6');
				this.setStateAsync('trigger_6.trigger_6_Start', false, true);

			}


			else if (HH < 0 || HH > 23 || MM < 0 || MM > 59) {

				this.log.error('Uhrzeit stimmt nicht! bei Schedule 6 -- ' + HH + ':' + MM);
				this.setStateAsync('trigger_6.trigger_6_Start', false, true);

			} else {

				this.log.error('irgendwas stimmt nicht bei Schedule 6 -- Uhrzeit ' + HH + ':' + MM);
				this.setStateAsync('trigger_6.trigger_6_Start', false, true);

			}
		};

		//läuft hier rein sobald Schedule 1 - 6 ausgelöst werden:
		this.Schedule_6_go = async () => {

			this.log.info('Schedule 6 ausgelöst!');

			const waitS6 = this.setTimeout( async () => {this.log.info('Schedule 6 auf false gesetzt! - ' + timer_t6arr + ' Sek später');
				this.setForeignStateAsync(DP_6arr.toString() , false);

			}, timer_t6arr*1000);

			stopp_timer6_arr = waitS6;

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

		await this.setObjectNotExistsAsync('trigger_1.goforit_1', {
			type: 'state',
			common: {
				name: 'goforit_1',
				type: 'string',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync('trigger_1.timer_1', {
			type: 'state',
			common: {
				name: 'timer_1',
				type: 'number',
				role: 'state',
				read: true,
				write: true,
			},
			native: {},
		});

		this.subscribeStates('trigger_1.goforit_1');
		this.subscribeStates('trigger_1.timer_1');

		//Permanente Datenpunkte erstellen ENDE




		//Überprüfen ob die Datenpunkte angelegt sind, wenn nicht werden sie neu angelegt
		//in Abhängigkeit zur Anzahl der Trigger die in der this.config eingestellt sind
		if (this.config.numberoftriggers == 1) {

			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 1 sind
			const trigger_2 = await this.getObjectAsync('trigger_2.t2_weekdays') || await this.getObjectAsync('trigger_2.trigger_2_is_set') || await this.getObjectAsync('trigger_2.trigger_2_Start');
			if (trigger_2) {

				//this.log.warn('datenpunkte trigger_2 existieren');
				//und werden gelöscht
				await this.delObjectAsync('trigger_2.trigger_2_is_set');
				await this.delObjectAsync('trigger_2.trigger_2_Start');
				await this.delObjectAsync('trigger_2.t2_weekdays');
				await this.delObjectAsync('trigger_2.t2_time');
				await this.delObjectAsync('trigger_2.goforit_2');
				await this.delObjectAsync('trigger_2.timer_2');


			} else {

				//this.log.warn('datenpunkte trigger_2 existieren NICHT');

			}

			const trigger_3 = await this.getObjectAsync('trigger_3.t3_weekdays') || await this.getObjectAsync('trigger_3.trigger_3_is_set') || await this.getObjectAsync('trigger_3.trigger_3_Start');
			if (trigger_3) {

				//this.log.warn('datenpunkte trigger_3 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_3.trigger_3_is_set');
				await this.delObjectAsync('trigger_3.trigger_3_Start');
				await this.delObjectAsync('trigger_3.t3_weekdays');
				await this.delObjectAsync('trigger_3.t3_time');
				await this.delObjectAsync('trigger_3.goforit_3');
				await this.delObjectAsync('trigger_3.timer_3');

			} else {

				//this.log.warn('datenpunkte trigger_3 existieren NICHT');

			}

			const trigger_4 = await this.getObjectAsync('trigger_4.t4_weekdays') || await this.getObjectAsync('trigger_4.trigger_4_is_set') || await this.getObjectAsync('trigger_4.trigger_4_Start');
			if (trigger_4) {

				//this.log.warn('datenpunkte trigger_4 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_4.trigger_4_is_set');
				await this.delObjectAsync('trigger_4.trigger_4_Start');
				await this.delObjectAsync('trigger_4.t4_weekdays');
				await this.delObjectAsync('trigger_4.t4_time');
				await this.delObjectAsync('trigger_4.goforit_4');
				await this.delObjectAsync('trigger_4.timer_4');

			} else {

				//this.log.warn('datenpunkte trigger_4 existieren NICHT');

			}

			const trigger_5 = await this.getObjectAsync('trigger_5.t5_weekdays') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				//this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');
				await this.delObjectAsync('trigger_5.goforit_5');
				await this.delObjectAsync('trigger_5.timer_5');

			} else {

				//this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.t6_weekdays') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');
				await this.delObjectAsync('trigger_6.goforit_6');
				await this.delObjectAsync('trigger_6.timer_6');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}


		} else if (this.config.numberoftriggers == 2) {

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

			await this.setObjectNotExistsAsync('trigger_2.goforit_2', {
				type: 'state',
				common: {
					name: 'goforit_2',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.timer_2', {
				type: 'state',
				common: {
					name: 'timer_2',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.trigger_2_Start');
			this.subscribeStates('trigger_2.goforit_2');
			this.subscribeStates('trigger_2.timer_2');

			this.setStateAsync('trigger_2.trigger_2_Start', false, true);


			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 2 sind
			const trigger_3 = await this.getObjectAsync('trigger_3.t3_weekdays') || await this.getObjectAsync('trigger_3.t3_weekdays') || await this.getObjectAsync('trigger_3.trigger_3_is_set') || await this.getObjectAsync('trigger_3.trigger_3_Start');
			if (trigger_3) {

				//this.log.warn('datenpunkte trigger_3 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_3.trigger_3_is_set');
				await this.delObjectAsync('trigger_3.trigger_3_Start');
				await this.delObjectAsync('trigger_3.t3_weekdays');
				await this.delObjectAsync('trigger_3.t3_time');
				await this.delObjectAsync('trigger_3.goforit_3');
				await this.delObjectAsync('trigger_3.timer_3');

			} else {

				//this.log.warn('datenpunkte trigger_3 existieren NICHT');

			}

			const trigger_4 = await this.getObjectAsync('trigger_4.t4_weekdays') || await this.getObjectAsync('trigger_4.trigger_4_is_set') || await this.getObjectAsync('trigger_4.trigger_4_Start');
			if (trigger_4) {

				//this.log.warn('datenpunkte trigger_4 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_4.trigger_4_is_set');
				await this.delObjectAsync('trigger_4.trigger_4_Start');
				await this.delObjectAsync('trigger_4.t4_weekdays');
				await this.delObjectAsync('trigger_4.t4_time');
				await this.delObjectAsync('trigger_4.goforit_4');
				await this.delObjectAsync('trigger_4.timer_4');

			} else {

				//this.log.warn('datenpunkte trigger_4 existieren NICHT');

			}

			const trigger_5 = await this.getObjectAsync('trigger_5.t5_weekdays') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				//this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');
				await this.delObjectAsync('trigger_5.goforit_5');
				await this.delObjectAsync('trigger_5.timer_5');

			} else {

				//this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.t6_weekdays') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');
				await this.delObjectAsync('trigger_6.goforit_6');
				await this.delObjectAsync('trigger_6.timer_6');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 3) {

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

			await this.setObjectNotExistsAsync('trigger_2.goforit_2', {
				type: 'state',
				common: {
					name: 'goforit_2',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.timer_2', {
				type: 'state',
				common: {
					name: 'timer_2',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_3.goforit_3', {
				type: 'state',
				common: {
					name: 'goforit_3',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.timer_3', {
				type: 'state',
				common: {
					name: 'timer_3',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.goforit_2');
			this.subscribeStates('trigger_2.timer_2');
			this.subscribeStates('trigger_3.goforit_3');
			this.subscribeStates('trigger_3.timer_3');

			this.subscribeStates('trigger_2.trigger_2_Start');
			this.subscribeStates('trigger_3.trigger_3_Start');


			this.setStateAsync('trigger_2.trigger_2_Start', false, true);
			this.setStateAsync('trigger_3.trigger_3_Start', false, true);


			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 3 sind
			const trigger_4 = await this.getObjectAsync('trigger_4.t4_weekdays') || await this.getObjectAsync('trigger_4.trigger_4_is_set') || await this.getObjectAsync('trigger_4.trigger_4_Start');
			if (trigger_4) {

				//this.log.warn('datenpunkte trigger_4 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_4.trigger_4_is_set');
				await this.delObjectAsync('trigger_4.trigger_4_Start');
				await this.delObjectAsync('trigger_4.t4_weekdays');
				await this.delObjectAsync('trigger_4.t4_time');
				await this.delObjectAsync('trigger_4.goforit_4');
				await this.delObjectAsync('trigger_4.timer_4');

			} else {

				//this.log.warn('datenpunkte trigger_4 existieren NICHT');

			}

			const trigger_5 = await this.getObjectAsync('trigger_5.t5_weekdays') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				//this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');
				await this.delObjectAsync('trigger_5.goforit_5');
				await this.delObjectAsync('trigger_5.timer_5');

			} else {

				//this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.t6_weekdays') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');
				await this.delObjectAsync('trigger_6.goforit_6');
				await this.delObjectAsync('trigger_6.timer_6');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 4) {

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

			await this.setObjectNotExistsAsync('trigger_2.goforit_2', {
				type: 'state',
				common: {
					name: 'goforit_2',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.timer_2', {
				type: 'state',
				common: {
					name: 'timer_2',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_3.goforit_3', {
				type: 'state',
				common: {
					name: 'goforit_3',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.timer_3', {
				type: 'state',
				common: {
					name: 'timer_3',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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
			await this.setObjectNotExistsAsync('trigger_4.goforit_4', {
				type: 'state',
				common: {
					name: 'goforit_4',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.timer_4', {
				type: 'state',
				common: {
					name: 'timer_4',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.goforit_2');
			this.subscribeStates('trigger_2.timer_2');
			this.subscribeStates('trigger_3.goforit_3');
			this.subscribeStates('trigger_3.timer_3');
			this.subscribeStates('trigger_4.goforit_4');
			this.subscribeStates('trigger_4.timer_4');

			this.subscribeStates('trigger_2.trigger_2_Start');
			this.subscribeStates('trigger_3.trigger_3_Start');
			this.subscribeStates('trigger_4.trigger_4_Start');


			this.setStateAsync('trigger_2.trigger_2_Start', false, true);
			this.setStateAsync('trigger_3.trigger_3_Start', false, true);
			this.setStateAsync('trigger_4.trigger_4_Start', false, true);

			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 4 sind
			const trigger_5 = await this.getObjectAsync('trigger_5.t5_weekdays') || await this.getObjectAsync('trigger_5.trigger_5_is_set') || await this.getObjectAsync('trigger_5.trigger_5_Start');
			if (trigger_5) {

				//this.log.warn('datenpunkte trigger_5 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_5.trigger_5_is_set');
				await this.delObjectAsync('trigger_5.trigger_5_Start');
				await this.delObjectAsync('trigger_5.t5_weekdays');
				await this.delObjectAsync('trigger_5.t5_time');
				await this.delObjectAsync('trigger_5.goforit_5');
				await this.delObjectAsync('trigger_5.timer_5');

			} else {

				//this.log.warn('datenpunkte trigger_5 existieren NICHT');

			}

			const trigger_6 = await this.getObjectAsync('trigger_6.t6_weekdays') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');
				await this.delObjectAsync('trigger_6.goforit_6');
				await this.delObjectAsync('trigger_6.timer_6');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 5) {

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

			await this.setObjectNotExistsAsync('trigger_2.goforit_2', {
				type: 'state',
				common: {
					name: 'goforit_2',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.timer_2', {
				type: 'state',
				common: {
					name: 'timer_2',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_3.goforit_3', {
				type: 'state',
				common: {
					name: 'goforit_3',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.timer_3', {
				type: 'state',
				common: {
					name: 'timer_3',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_4.goforit_4', {
				type: 'state',
				common: {
					name: 'goforit_4',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.timer_4', {
				type: 'state',
				common: {
					name: 'timer_4',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_5.goforit_5', {
				type: 'state',
				common: {
					name: 'goforit_5',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.timer_5', {
				type: 'state',
				common: {
					name: 'timer_5',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.goforit_2');
			this.subscribeStates('trigger_2.timer_2');
			this.subscribeStates('trigger_3.goforit_3');
			this.subscribeStates('trigger_3.timer_3');
			this.subscribeStates('trigger_4.goforit_4');
			this.subscribeStates('trigger_4.timer_4');
			this.subscribeStates('trigger_5.goforit_5');
			this.subscribeStates('trigger_5.timer_5');

			this.subscribeStates('trigger_2.trigger_2_Start');
			this.subscribeStates('trigger_3.trigger_3_Start');
			this.subscribeStates('trigger_4.trigger_4_Start');
			this.subscribeStates('trigger_5.trigger_5_Start');


			this.setStateAsync('trigger_2.trigger_2_Start', false, true);
			this.setStateAsync('trigger_3.trigger_3_Start', false, true);
			this.setStateAsync('trigger_4.trigger_4_Start', false, true);
			this.setStateAsync('trigger_5.trigger_5_Start', false, true);

			//alle anderen Datenpunkte löschen die aus Schdedule Anzahl > 5 sind
			const trigger_6 = await this.getObjectAsync('trigger_6.t6_weekdays') || await this.getObjectAsync('trigger_6.trigger_6_is_set') || await this.getObjectAsync('trigger_6.trigger_6_Start');
			if (trigger_6) {

				//this.log.warn('datenpunkte trigger_6 existieren');
				//und werden gelöscht

				await this.delObjectAsync('trigger_6.trigger_6_is_set');
				await this.delObjectAsync('trigger_6.trigger_6_Start');
				await this.delObjectAsync('trigger_6.t6_weekdays');
				await this.delObjectAsync('trigger_6.t6_time');
				await this.delObjectAsync('trigger_6.goforit_6');
				await this.delObjectAsync('trigger_6.timer_6');

			} else {

				//this.log.warn('datenpunkte trigger_6 existieren NICHT');

			}

		} else if (this.config.numberoftriggers == 6) {

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

			await this.setObjectNotExistsAsync('trigger_2.goforit_2', {
				type: 'state',
				common: {
					name: 'goforit_2',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_2.timer_2', {
				type: 'state',
				common: {
					name: 'timer_2',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_3.goforit_3', {
				type: 'state',
				common: {
					name: 'goforit_3',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_3.timer_3', {
				type: 'state',
				common: {
					name: 'timer_3',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_4.goforit_4', {
				type: 'state',
				common: {
					name: 'goforit_4',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_4.timer_4', {
				type: 'state',
				common: {
					name: 'timer_4',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_5.goforit_5', {
				type: 'state',
				common: {
					name: 'goforit_5',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_5.timer_5', {
				type: 'state',
				common: {
					name: 'timer_5',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
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

			await this.setObjectNotExistsAsync('trigger_6.goforit_6', {
				type: 'state',
				common: {
					name: 'goforit_6',
					type: 'string',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			await this.setObjectNotExistsAsync('trigger_6.timer_6', {
				type: 'state',
				common: {
					name: 'timer_6',
					type: 'number',
					role: 'state',
					read: true,
					write: true,
				},
				native: {},
			});

			this.subscribeStates('trigger_2.goforit_2');
			this.subscribeStates('trigger_2.timer_2');
			this.subscribeStates('trigger_3.goforit_3');
			this.subscribeStates('trigger_3.timer_3');
			this.subscribeStates('trigger_4.goforit_4');
			this.subscribeStates('trigger_4.timer_4');
			this.subscribeStates('trigger_5.goforit_5');
			this.subscribeStates('trigger_5.timer_5');
			this.subscribeStates('trigger_6.goforit_6');
			this.subscribeStates('trigger_6.timer_6');

			this.subscribeStates('trigger_2.trigger_2_Start');
			this.subscribeStates('trigger_3.trigger_3_Start');
			this.subscribeStates('trigger_4.trigger_4_Start');
			this.subscribeStates('trigger_5.trigger_5_Start');
			this.subscribeStates('trigger_6.trigger_6_Start');

			this.setStateAsync('trigger_2.trigger_2_Start', false, true);
			this.setStateAsync('trigger_3.trigger_3_Start', false, true);
			this.setStateAsync('trigger_4.trigger_4_Start', false, true);
			this.setStateAsync('trigger_5.trigger_5_Start', false, true);
			this.setStateAsync('trigger_6.trigger_6_Start', false, true);
		}
		//Datepunkt abfragen erstellen / löschen ENDE
		//*****************************************


		// Reset the connection indicator during startup

		this.setStateAsync('info.connection', true, true);

		//Wochentage auf einen Wert setzten
		this.setStateAsync('Weekdays.Sunday', true, true);
		this.setStateAsync('Weekdays.Monday', false, true);
		this.setStateAsync('Weekdays.Tuesday', false, true);
		this.setStateAsync('Weekdays.Wednesday', false, true);
		this.setStateAsync('Weekdays.Thursday', false, true);
		this.setStateAsync('Weekdays.Friday', false, true);
		this.setStateAsync('Weekdays.Saturday', true, true);

		//Datenpunkt trigger 1 auf false setzen (Aulöser für Anktion wenn true)
		//this.setState('trigger_1.trigger_1', false, true);

		//trigger 1 Start auf false setzten - wird also nicht Scheduled
		this.setStateAsync('trigger_1.trigger_1_Start', false, true);

		//Setup.SetTrigger auf 0 setzen - somit wird keine Uhrzeit oder Wochentag versehentlich verstellt
		//wenn an Uhrzeit oder Wochentagen etwas geändert wird
		this.setStateAsync('Setup.SetTrigger', '0', true);

		//hier werden Datenpunkt Änderungen im Log angezeigt

		this.subscribeStates('Setup.HH');
		this.subscribeStates('Setup.mm');

		this.subscribeStates('Setup.SetTrigger');

		//this.subscribeStates('trigger_1.trigger_1');
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

			if (id == this.namespace + '.Setup.HH') {
				Stunden();
			}


			const minutes = await this.getStateAsync('Setup.mm');
			const minutesval = minutes ? minutes.val: '00';

			const Minuten = async () => {

				this.log.info('mm wurden geändert -- ' + minutesval);

			};

			if (id == this.namespace + '.Setup.mm') {
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

			if (id == this.namespace + '.Weekdays.Sunday') {
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

			if (id == this.namespace + '.Weekdays.Monday') {
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

			if (id == this.namespace + '.Weekdays.Tuesday') {
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

			if (id == this.namespace + '.Weekdays.Wednesday') {
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

			if (id == this.namespace + '.Weekdays.Thursday') {
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

			if (id == this.namespace + '.Weekdays.Friday') {
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

			if (id == this.namespace + '.Weekdays.Saturday') {
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

				let new_HH_1 = HH_1 ? HH_1.val: '00';

				if (new_HH_1 < 10 && new_HH_1.length == 1) {

					new_HH_1 = ('0' + HH_1.val);

				} else if (new_HH_1.length > 2) {

					this.log.error('Stunden sind nicht 2 stellig!');

				}

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				if (SetTrigger == 1) {

					Time.splice(0,1, new_HH_1);

					time_t1arr.splice(0,1, new_HH_1);

					this.setStateAsync('trigger_1.t1_time', time_t1arr[0] + ':' + time_t1arr[1] , true);

					weekdays_t1arr = SetSchedule;
					this.setStateAsync('trigger_1.t1_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					} else {

						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}



				} else if (SetTrigger == 2 && number_of_triggers >= 2) {

					Time.splice(0,1, new_HH_1);

					time_t2arr.splice(0,1, new_HH_1);

					this.setStateAsync('trigger_2.t2_time', time_t2arr[0] + ':' + time_t2arr[1] , true);

					weekdays_t2arr = SetSchedule;
					this.setStateAsync('trigger_2.t2_weekdays', JSON.stringify(SetSchedule.sort()), true);


					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					} else {

						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				} else if (SetTrigger == 3 && number_of_triggers >= 3) {

					Time.splice(0,1, new_HH_1);

					time_t3arr.splice(0,1, new_HH_1);

					this.setStateAsync('trigger_3.t3_time', time_t3arr[0] + ':' + time_t3arr[1] , true);

					weekdays_t3arr = SetSchedule;
					this.setStateAsync('trigger_3.t3_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					} else {

						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				} else if (SetTrigger == 4 && number_of_triggers >= 4) {

					Time.splice(0,1, new_HH_1);

					time_t4arr.splice(0,1, new_HH_1);

					this.setStateAsync('trigger_4.t4_time', time_t4arr[0] + ':' + time_t4arr[1] , true);

					weekdays_t4arr = SetSchedule;
					this.setStateAsync('trigger_4.t4_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					} else {

						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				} else if (SetTrigger == 5 && number_of_triggers >= 5) {

					Time.splice(0,1, new_HH_1);

					time_t5arr.splice(0,1, new_HH_1);

					this.setStateAsync('trigger_5.t5_time', time_t5arr[0] + ':' + time_t5arr[1] , true);

					weekdays_t5arr = SetSchedule;
					this.setStateAsync('trigger_5.t5_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					} else {

						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					}


				} else if (SetTrigger == 6 && number_of_triggers == 6) {

					Time.splice(0,1, new_HH_1);

					time_t6arr.splice(0,1, new_HH_1);

					this.setStateAsync('trigger_6.t6_time', time_t6arr[0] + ':' + time_t6arr[1] , true);

					weekdays_t6arr = SetSchedule;
					this.setStateAsync('trigger_6.t6_weekdays', JSON.stringify(SetSchedule.sort()), true);

					//SetTrigger wieder auf 0 setzten nach 2 Minuten
					if (SetTrigger_Stop_arr !== '') {

						this.clearTimeout(SetTrigger_Stop_arr);
						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

						}, 120000);

						SetTrigger_Stop_arr = timeoutt1;

					} else {

						const timeoutt1 = this.setTimeout( async () => {this.setStateAsync('Setup.SetTrigger', '0', true);

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

				let new_mm_1 = mm_1 ? mm_1.val: '00';

				if (new_mm_1 < 10 && new_mm_1.length == 1) {

					new_mm_1 = ('0' + mm_1.val);

				} else if (new_mm_1.length > 2) {

					this.log.error('Minuten sind nicht 2 stellig!');

				}

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const number_of_triggers_1 = await this.getStateAsync('Setup.number_of_triggers');
				const number_of_triggers = number_of_triggers_1.val;

				if (SetTrigger == 1) {

					Time.splice(1,1, new_mm_1);

					time_t1arr.splice(1,1, new_mm_1);

					this.setStateAsync('trigger_1.t1_time', time_t1arr[0] + ':' + time_t1arr[1] , true);

				} else if (SetTrigger == 2 && number_of_triggers >= 2) {

					Time.splice(1,1, new_mm_1);

					time_t2arr.splice(1,1, new_mm_1);

					this.setStateAsync('trigger_2.t2_time', time_t2arr[0] + ':' + time_t2arr[1] , true);

				} else if (SetTrigger == 3 && number_of_triggers >= 3) {

					Time.splice(1,1, new_mm_1);

					time_t3arr.splice(1,1, new_mm_1);

					this.setStateAsync('trigger_3.t3_time', time_t3arr[0] + ':' + time_t3arr[1] , true);

				} else if (SetTrigger == 4 && number_of_triggers >= 4) {

					Time.splice(1,1, new_mm_1);

					time_t4arr.splice(1,1, new_mm_1);

					this.setStateAsync('trigger_4.t4_time', time_t4arr[0] + ':' + time_t4arr[1] , true);

				} else if (SetTrigger == 5 && number_of_triggers >= 5) {

					Time.splice(1,1, new_mm_1);

					time_t5arr.splice(1,1, new_mm_1);

					this.setStateAsync('trigger_5.t5_time', time_t5arr[0] + ':' + time_t5arr[1] , true);

				} else if (SetTrigger == 6 && number_of_triggers == 6) {

					Time.splice(1,1, new_mm_1);

					time_t6arr.splice(1,1, new_mm_1);

					this.setStateAsync('trigger_6.t6_time', time_t6arr[0] + ':' + time_t6arr[1] , true);

				}


			} else {

				this.log.error('Uhrzeit -mm- Error -- ');

			}


			//trigger_1_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_1Start = await this.getObjectAsync('trigger_1.trigger_1_Start');

			if (trigger_1Start) {

				const triggerStart_1 = await this.getStateAsync('trigger_1.trigger_1_Start');
				const StatusTriggerStart = triggerStart_1.val;

				const SetTrigger_1 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_1 ? SetTrigger_1.val: '0';

				const goforit_1 = await this.getStateAsync('trigger_1.goforit_1');
				const goforit = goforit_1 ? goforit_1.val: 'None';

				if (goforit !== '' && goforit !== 'None') {

					DP_1arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.setStateAsync('trigger_1.goforit_1', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 1!');

				}

				const timer_set = await this.getStateAsync('trigger_1.timer_1');
				const timer = timer_set ? timer_set.val: 0;

				if (timer !== '' && timer > 0) {

					timer_t1arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.log.error('Keine gültige Zeit in Sekunden bei "timer" angegeben, wann Schedule 1 wieder auf false gesetzt werden soll!');

				} else if (timer <= 0) {

					this.setStateAsync('trigger_1.trigger_1_Start', false, true);
					this.log.error('"timer" darf keinen negativen Wert haben, bei Trigger 1 bitte korrigieren!');

				}



				const triggerStartAction_true_1 = async () => {



					if (StatusTriggerStart == true && SetTrigger == 1) {

						weekdays_t1arr = SetSchedule;

						this.setStateAsync('trigger_1.t1_weekdays', JSON.stringify(SetSchedule.sort()), true);

						const hh_1 = time_t1arr[0];
						const mm_1 = time_t1arr[1];

						this.setStateAsync('trigger_1.trigger_1_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

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

							this.setStateAsync('trigger_1.trigger_1_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t1arr, true);

							this.Schedule_1();

						} catch (e1) {

							this.log.error('Check the time of Schedule 1! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_1();

						this.clearTimeout(stopp_timer1_arr);

						this.setStateAsync('trigger_1.trigger_1_is_set', 'not scheduled', true);
						weekdays_t1arr.splice(0, weekdays_t1arr.length);

					}};


				triggerStartAction_true_1();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_2_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_2Start = await this.getObjectAsync('trigger_2.trigger_2_Start');

			if (trigger_2Start) {

				const triggerStart_2 = await this.getStateAsync('trigger_2.trigger_2_Start');
				const StatusTriggerStart = triggerStart_2.val;

				const SetTrigger_2 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_2 ? SetTrigger_2.val: '0';

				const goforit_2 = await this.getStateAsync('trigger_2.goforit_2');
				const goforit = goforit_2 ? goforit_2.val: 'None';

				if (goforit !== '' && goforit !== 'None') {

					DP_2arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.setStateAsync('trigger_2.goforit_2', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 2!');

				}

				const timer_set = await this.getStateAsync('trigger_2.timer_2');
				const timer = timer_set ? timer_set.val: 0;

				if (timer !== '' && timer > 0) {

					timer_t2arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_2.trigger_2_Start', false, true);
					this.log.error('Keine gültige Zeit in Sekunden bei "timer" angegeben, wann Schedule 2 wieder auf false gesetzt werden soll!');

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

						this.setStateAsync('trigger_2.trigger_2_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_2();



					} else if (StatusTriggerStart == true && SetTrigger !== 2) {

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

							this.setStateAsync('trigger_2.trigger_2_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t2arr, true);

							this.Schedule_2();

						} catch (e1) {

							this.log.error('Check the time of Schedule 2! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_2();

						this.clearTimeout(stopp_timer2_arr);

						this.setStateAsync('trigger_2.trigger_2_is_set', 'not scheduled', true);
						weekdays_t2arr.splice(0, weekdays_t2arr.length);

					}};


				triggerStartAction_true_2();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}



			//trigger_3_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_3Start = await this.getObjectAsync('trigger_3.trigger_3_Start');

			if (trigger_3Start) {

				const triggerStart_3 = await this.getStateAsync('trigger_3.trigger_3_Start');
				const StatusTriggerStart = triggerStart_3.val;

				const SetTrigger_3 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_3 ? SetTrigger_3.val: '0';

				const goforit_3 = await this.getStateAsync('trigger_3.goforit_3');
				const goforit = goforit_3 ? goforit_3.val: 'None';

				if (goforit !== '' && goforit !== 'None') {

					DP_3arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.setStateAsync('trigger_3.goforit_3', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 3!');

				}

				const timer_set = await this.getStateAsync('trigger_3.timer_3');
				const timer = timer_set ? timer_set.val: 0;

				if (timer !== '' && timer > 0) {

					timer_t3arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_3.trigger_3_Start', false, true);
					this.log.error('Keine gültige Zeit in Sekunden bei "timer" angegeben, wann Schedule 3 wieder auf false gesetzt werden soll!');

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

						this.setStateAsync('trigger_3.trigger_3_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_3();



					} else if (StatusTriggerStart == true && SetTrigger !== 3) {

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

							this.setStateAsync('trigger_3.trigger_3_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t3arr, true);

							this.Schedule_3();

						} catch (e1) {

							this.log.error('Check the time of Schedule 3! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_3();

						this.clearTimeout(stopp_timer3_arr);

						this.setStateAsync('trigger_3.trigger_3_is_set', 'not scheduled', true);
						weekdays_t3arr.splice(0, weekdays_t3arr.length);

					}};


				triggerStartAction_true_3();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_4_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_4Start = await this.getObjectAsync('trigger_4.trigger_4_Start');

			if (trigger_4Start) {

				const triggerStart_4 = await this.getStateAsync('trigger_4.trigger_4_Start');
				const StatusTriggerStart = triggerStart_4.val;

				const SetTrigger_4 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_4 ? SetTrigger_4.val: '0';

				const goforit_4 = await this.getStateAsync('trigger_4.goforit_4');
				const goforit = goforit_4 ? goforit_4.val: 'None';

				if (goforit !== '' && goforit !== 'None') {

					DP_4arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.setStateAsync('trigger_4.goforit_4', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 4!');

				}

				const timer_set = await this.getStateAsync('trigger_4.timer_4');
				const timer = timer_set ? timer_set.val: 0;

				if (timer !== '' && timer > 0) {

					timer_t4arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_4.trigger_4_Start', false, true);
					this.log.error('Keine gültige Zeit in Sekunden bei "timer" angegeben, wann Schedule 4 wieder auf false gesetzt werden soll!');

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

						this.setStateAsync('trigger_4.trigger_4_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_4();



					} else if (StatusTriggerStart == true && SetTrigger !== 4) {

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

							this.setStateAsync('trigger_4.trigger_4_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t4arr, true);

							this.Schedule_4();

						} catch (e1) {

							this.log.error('Check the time of Schedule 4! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_4();

						this.clearTimeout(stopp_timer4_arr);

						this.setStateAsync('trigger_4.trigger_4_is_set', 'not scheduled', true);
						weekdays_t4arr.splice(0, weekdays_t4arr.length);

					}};


				triggerStartAction_true_4();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_5_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_5Start = await this.getObjectAsync('trigger_5.trigger_5_Start');

			if (trigger_5Start) {

				const triggerStart_5 = await this.getStateAsync('trigger_5.trigger_5_Start');
				const StatusTriggerStart = triggerStart_5.val;

				const SetTrigger_5 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_5 ? SetTrigger_5.val: '0';

				const goforit_5 = await this.getStateAsync('trigger_5.goforit_5');
				const goforit = goforit_5 ? goforit_5.val: 'None';

				if (goforit !== '' && goforit !== 'None') {

					DP_5arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.setStateAsync('trigger_5.goforit_5', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 5!');

				}

				const timer_set = await this.getStateAsync('trigger_5.timer_5');
				const timer = timer_set ? timer_set.val: 0;

				if (timer !== '' && timer > 0) {

					timer_t5arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_5.trigger_5_Start', false, true);
					this.log.error('Keine gültige Zeit in Sekunden bei "timer" angegeben, wann Schedule 5 wieder auf false gesetzt werden soll!');

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

						this.setStateAsync('trigger_5.trigger_5_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_5();



					} else if (StatusTriggerStart == true && SetTrigger !== 5) {

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

							this.setStateAsync('trigger_5.trigger_5_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t5arr, true);

							this.Schedule_5();

						} catch (e1) {

							this.log.error('Check the time of Schedule 5! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_5();

						this.clearTimeout(stopp_timer5_arr);

						this.setStateAsync('trigger_5.trigger_5_is_set', 'not scheduled', true);
						weekdays_t5arr.splice(0, weekdays_t5arr.length);

					}};


				triggerStartAction_true_5();

			} else {

				//this.log.error('datenpunkte trigger_2 existieren NICHT');

			}


			//trigger_6_Start Datenpunkt wenn false - Schedule canceln - SetSchedule = SetWeekdays Array mit Zahlen -
			//SetTrigger ist die Auswahl welcher Trigger mit mit Uhrzeit und Wochentagen gefüttert werden soll

			const trigger_6Start = await this.getObjectAsync('trigger_6.trigger_6_Start');

			if (trigger_6Start) {

				const triggerStart_6 = await this.getStateAsync('trigger_6.trigger_6_Start');
				const StatusTriggerStart = triggerStart_6.val;

				const SetTrigger_6 = await this.getStateAsync('Setup.SetTrigger');
				const SetTrigger = SetTrigger_6 ? SetTrigger_6.val: '0';

				const goforit_6 = await this.getStateAsync('trigger_6.goforit_6');
				const goforit = goforit_6 ? goforit_6.val: 'None';

				if (goforit !== '' && goforit !== 'None') {

					DP_6arr = goforit;

				} else if (goforit == '') {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.setStateAsync('trigger_6.goforit_6', 'None', true);


				} else if (goforit == 'None') {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.log.error('Kein Datenpunkt zum triggern gesetzt in Schedule 6!');

				}

				const timer_set = await this.getStateAsync('trigger_6.timer_6');
				const timer = timer_set ? timer_set.val: 0;

				if (timer !== '' && timer > 0) {

					timer_t6arr = timer;

				} else if (timer == '') {

					this.setStateAsync('trigger_6.trigger_6_Start', false, true);
					this.log.error('Keine gültige Zeit in Sekunden bei "timer" angegeben, wann Schedule 6 wieder auf false gesetzt werden soll!');

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

						this.setStateAsync('trigger_6.trigger_6_is_set',  hh_1 + ':' + mm_1 + ' -- ' + SetSchedule.sort(), true);

						this.Schedule_6();



					} else if (StatusTriggerStart == true && SetTrigger !== 6) {

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

							this.setStateAsync('trigger_6.trigger_6_is_set', hh_1 + ':' + mm_1 + ' -- ' + weekdays_t6arr, true);

							this.Schedule_6();

						} catch (e1) {

							this.log.error('Check the time of Schedule 6! -- ' + e1);

						}



					} else if (StatusTriggerStart == false) {

						this.cancelSchedule_6();

						this.clearTimeout(stopp_timer6_arr);

						this.setStateAsync('trigger_6.trigger_6_is_set', 'not scheduled', true);
						weekdays_t6arr.splice(0, weekdays_t6arr.length);

					}};


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
