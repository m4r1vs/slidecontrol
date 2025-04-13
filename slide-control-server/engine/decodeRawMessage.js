/**
 * Slidecontrol - The open-source remote control solution
 * Copyright (C) 2019 Marius Niveri <marius.niveri@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 *
 * If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Decode raw message to JSON. Return false and error if not JSON
 * @param {String} raw The raw string recieved by the socket
 */
module.exports = decodeRawMessage = (raw, connection) => {
  try {
    return JSON.parse(raw);
  } catch (error) {
    Logger.error("Error decoding message, killing connection: ", error);
    connection.terminate();
  }
  return false;
};
