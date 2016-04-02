/*
 * Copyright (c) 2014-2016 Holger de Carne and contributors, All Rights Reserved.
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
package de.carne.certmgr.store;

/**
 * Exception indicating provider specific error during certificate processing.
 */
public class StoreProviderException extends StoreException {

	/**
	 * Serialization support.
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Construct StoreProviderException.
	 *
	 * @param message The exception message.
	 */
	public StoreProviderException(String message) {
		super(message);
	}

	/**
	 * Construct StoreProviderException.
	 *
	 * @param message The exception message.
	 * @param cause The causing exception.
	 */
	public StoreProviderException(String message, Throwable cause) {
		super(message, cause);
	}

	/**
	 * Construct StoreProviderException.
	 *
	 * @param cause The causing exception.
	 */
	public StoreProviderException(Throwable cause) {
		super(cause);
	}

}
