const ping = require('ping')
const moment = require('moment')
const {	appendFile} = require('fs-extra')

const hosts = ['192.168.1.1', '192.168.55.1', 'www.google.co.th', 'www.facebook.com']

class Pinger {
	constructor(host) {
		this.host = host
		this.runPing()
	}

	async runPing() {
		try {
			let {	alive	} = await ping.promise.probe(this.host, {
				timeout: 10
			})
			
			if (alive !== this.alive) {
				this.alive = alive
				await appendFile(`./data/${this.host}.log`, `${moment().format('DD/MM/YYYY HH:mm')} | ${alive === true ? 'Online' : 'Offline'} \r\n`)
			}
		} catch (error) {
			await appendFile('error.log', error + '\r\n');
		} finally {
			await this.sleep(1000)
			setImmediate(() => {
				this.runPing()
			})
		}
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

hosts.forEach(function (host) {
	new Pinger(host)
});