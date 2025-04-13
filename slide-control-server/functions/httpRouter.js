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

const CONFIG = require("../package.json")

const sendIBMAccessToken = require("./sendIBMAccessToken");
const sendServerVersion = require("./sendServerVersion");

// HTTP routes
const routes = {
  "ibm-access-token": sendIBMAccessToken,
  "server-version": sendServerVersion,
  default: (req, res) =>
    res.end(
      `Slidecontrol backend server v${CONFIG.version}-${__webpack_hash__}`,
    ),
};

/**
 * Routes the request to the requested function.
 * @param {Object} req Information about the request.
 * @param {Object} res The response send.
 * @param {Object} routes An Object of the routes.
 */
module.exports = httpRouter = (req, res) => {
  // enable cross origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // e.g. if req.url == "/foo/bar", route = routes['bar']
  const route = routes[req.url.split("/")[req.url.split("/").length - 1]];

  Logger.debug("Handling request:", req.url);

  if (route) route(req, res);
  else routes.default(req, res);
};
