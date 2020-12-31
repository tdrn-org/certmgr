/*
 * Copyright (c) 2015-2021 Holger de Carne and contributors, All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package de.carne.certmgr.certs.net;

import java.io.IOException;
import java.net.Socket;

class StartTLSIMAPHelper extends SSLProtocalHelper {

	public StartTLSIMAPHelper(Socket plainSocket) {
		super(plainSocket);
	}

	@Override
	public void start() throws IOException {
		while (true) {
			String reply = receiveAll("\r\n");

			if (reply.startsWith("* OK")) {
				break;
			}
		}
		send(". CAPABILITY\r\n");
		while (true) {
			String reply = receiveAll("\r\n");

			if (reply.startsWith(". OK")) {
				break;
			}
		}
		send(". STARTTLS\r\n");
		while (true) {
			String reply = receiveAll("\r\n");

			if (reply.startsWith(". OK")) {
				break;
			} else if (reply.startsWith(". BAD")) {
				throw new IOException("StartTLS not supported by peer");
			}
		}
	}

}
