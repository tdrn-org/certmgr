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
package de.carne.certmgr.jfx.crloptions;

import java.text.MessageFormat;
import java.util.ResourceBundle;

/**
 * Package localization resources.
 */
final class I18N {

	static final String TEXT_TITLE = "crloptions.title";

	static final String MESSAGE_NOISSUERENTRY = "crloptions.noissuerentry";
	static final String MESSAGE_NOSIGALG = "crloptions.nosigalg";
	static final String MESSAGE_NOLASTUPDATE = "crloptions.nolastupdate";
	static final String MESSAGE_NONEXTUPDATE = "crloptions.nonextupdate";
	static final String MESSAGE_INVALIDNEXTUPDATE = "crloptions.invalidnextupdate";
	static final String MESSAGE_GENERATEERROR = "crloptions.generateerror";

	static ResourceBundle bundle() {
		return ResourceBundle.getBundle(I18N.class.getName());
	}

	static String format(String pattern, Object... arguments) {
		return MessageFormat.format(bundle().getString(pattern), arguments);
	}

}
