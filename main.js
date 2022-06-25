'use strict';

/*
 * Created with @iobroker/create-adapter v2.1.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
//const { truncate } = require('fs');
const schedule = require('node-schedule');

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
				this.log.warn('Schedule ausgelöst!'));
		};
		//Schedule zusammen setzten - ENDE

		//Schedule starten
		startZeit();
		//Schedule starten -- ENDE

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

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);

			//Hier wird in gelb im Log id ist true ausgegeben, wenn der Wert auf true gesetzt wird.
			if (state.val == true) {
				this.log.error(id + ' ist = true !');
			}

			if (state.val == false) {
				this.log.error(id + ' ist = false !');
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