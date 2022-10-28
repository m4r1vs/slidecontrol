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

// recieve notification-instruction from other scripts and display it
chrome.runtime.onMessage.addListener(notification => {
    chrome.notifications.create({
        type: "basic",
        title: "slidcontrol",
        message: notification,
        iconUrl: "./images/logo_128.png"
    })
})

chrome.runtime.onInstalled.addListener(event => {
    
    // open welcome page in new tab when extension is installed
    if (event.reason === 'install') chrome.tabs.create({
        url: 'https://slidecontrol.niveri.de/welcome '
    })
    
    // show notification when extension is updated
    else if (event.reason === 'update') chrome.notifications.create({
        type: "basic",
        title: "slidcontrol",
        message: "Extension got updated to a new version!",
        iconUrl: "./images/logo_128.png"
    })
})