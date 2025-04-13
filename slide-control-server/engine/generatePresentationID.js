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
 * Generate a random number with 5 digits
 * @param {Integer} digits How long the ID should be
 */
const proposePresentationID = (digits) => {
  return (
    Math.floor(Math.random() * Math.pow(10, digits - 1) * 9) +
    Math.pow(10, digits - 1)
  );
};

/**
 * Returns valid ID for new presentation
 * @param {class} SlideControlEngine the instance of the current slidecontrol server
 */
module.exports = generatePresentationID = (presentations, digits) => {
  // generate ID
  const proposedPresentationID = proposePresentationID(digits);

  Logger.debug(
    `Proposing ${digits} digit presentation ID:`,
    proposedPresentationID,
  );

  // ID already taken? Generate again!
  if (presentations[proposedPresentationID]) return generatePresentationID();

  Logger.debug("Accepted presentation ID:", proposedPresentationID);

  // return ID
  return proposedPresentationID;
};
