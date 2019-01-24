const path = window.location.pathname;
let firstPath = !1;

const init = function () {
	let punchContainer = document.querySelector(".punch-viewer-nav-rounded-container");
	let div = document.createElement("div");

	div.className = "goog-inline-block goog-flat-button";
	div.style.margin = "0 4px";
	div.style.padding = "0";
	div.innerHTML = '\n        <div class=\'goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block\'></div>\n        <div class="goog-inline-block goog-flat-button">\n            <div class="punch-viewer-captioned-button" id="rfgs_show_id">\n                <div style="width:24px; height:24px">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"\n                        style="pointer-events: none; display: block; width: 100%; height: 100%; fill: #cacaca;">\n                        <path fill="none" d="M0 0h24v24H0V0z"/>\n                        <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 \n                        7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 \n                        0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>\n                    </svg>\n                </div>\n                <div class="punch-viewer-speaker-notes-text goog-inline-block">Start slidecontrol</div>\n            </div>\n        </div>\n        <div id="rfgs_id_block" class="goog-inline-block goog-flat-button" style="display: none; text-align: center; line-height: 16px;">\n            <div>Slide ID:</div>\n            <div id="rfgs_id_container" style="font-size: 16px; font-weight: 600;">******</div>\n        </div>\n        <div class="goog-inline-block goog-flat-button" \n            style="text-align: center; font-size: 11px; line-height: 16px;">get slidecontrol:<br>\n            <a id="rfgs_app_url" style="font-size: 14px; color: #e3e3e3; text-decoration: none; font-weight: 500;" href="https://slides.limhenry.xyz" target="_blank">slidecontrol.com</a>\n        </div>\n        <div class=\'goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block\' id=\'rfgs_divider\' style=\'display: none\'></div>\n        <div class="goog-inline-block goog-flat-button" id="rfgs_refresh_id_container" style="display: none">\n            <div class="punch-viewer-captioned-button" id="rfgs_refresh_id">\n                <div style="width:24px; height:24px">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"\n                        style="pointer-events: none; display: block; width: 100%; height: 100%; fill: #cacaca;">\n                        <path fill="none" d="M0 0h24v24H0V0z"/>\n                        <path d="M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 \n                        15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 \n                        0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 \n                        8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 \n                        1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"/>\n                    </svg>\n                </div>\n                <div class="punch-viewer-speaker-notes-text goog-inline-block">Refresh ID</div>\n            </div>\n        </div>\n        <div class="goog-inline-block goog-flat-button" id="rfgs_stop_remote_container" style="display: none">\n            <div class="punch-viewer-captioned-button" id="rfgs_stop_remote">\n                <div style="width:24px; height:24px">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"\n                        style="pointer-events: none; display: block; width: 100%; height: 100%; fill: #cacaca;">\n                        <path fill="none" d="M0 0h24v24H0V0z"/>\n                        <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 \n                            0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 \n                            1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 \n                            12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>\n                    </svg>\n                </div>\n                <div class="punch-viewer-speaker-notes-text goog-inline-block">Stop Remote</div>\n            </div>\n        </div>\n    ';
	punchContainer.appendChild(div);
	document.querySelector("#rfgs_refresh_id").addEventListener("click", function () {
		alert("clicked")
	});

}

if (path.includes("/presentation/d/")) {

	const t = path.replace("/presentation/d/", "");

	t.includes("/edit") && function() {
		let elem = document.createElement("style");

		elem.innerHTML = "#rfgs_present_with_remote_container:hover {box-shadow: none!important;}#rfgs_present_with_remote {background-image: none;border-radius: 4px;box-shadow: none;box-sizing: border-box;font-family: var(--docs-material-header-font-family,Roboto,RobotoDraft,Helvetica,Arial,sans-serif);font-weight: var(--docs-material-font-weight-bold,500);font-size: 14px;height: 36px;letter-spacing: 0.25px;line-height: 16px;background: white;border: 2px solid grey!important;color: #202124;padding: 9px 11px 10px 12px;cursor: pointer;transition: all 150ms ease;}#rfgs_present_with_remote:hover {border: 2px solid yellow!important;background-color: #fffdf6;}";
		(document.head || document.documentElement).appendChild(elem);

		let punchContainer = document.querySelector(".punch-start-presentation-container");
		let anchor = document.createElement("a");
		let div = document.createElement("div");

		anchor.className = "punch-start-presentation-container";
		anchor.id = "rfgs_present_with_remote_container";
		anchor.style.textDecoration = "none";
		anchor.target = "_blank";
		anchor.href = window.location.href.replace("edit", "present");
		div.className = "goog-inline-block jfk-button jfk-button-standard jfk-button-collapse-right docs-titlebar-button jfk-button-clear-outline";
		div.innerHTML = "slidecontrol";
		div.id = "rfgs_present_with_remote";
		anchor.appendChild(div);
		punchContainer.before(anchor);

	}();

	t.includes("/present") && (init(), firstPath = t.split("/")[0])
}