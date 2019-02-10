import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.scss';

export default class Nav extends Component {
    
	closeDrawer() {
		if (typeof window === 'object') {
			window.closeDrawer();
		}
	}
    
	componentDidMount() {
		const panel = document.getElementById('app');
		const drawer = this.drawer;
		const greyback = document.getElementById('drawerback');
		let drawerwidth = drawer.offsetWidth;
		let startx = 0;
		let distgrey = 0;
		let open = false;
		let greybackstartx = 0;
        
		const drawerTransition = (state, bezier) => {
			if (state) {
				if (bezier === 'in') {
					drawer.style.transition = 'margin-left .225s cubic-bezier(0.0, 0.0, 0.2, 1), opacity .225s cubic-bezier(1,0,1,0)';
				}
				else if (bezier === 'out') {
					drawer.style.transition = 'margin-left .195s cubic-bezier(0.4, 0.0, 0.6, 1), opacity .195s cubic-bezier(1,0,1,0)';
				}
				greyback.style.transition = 'opacity .225s linear';
			}
			else {
				drawer.style.transition = 'none';
				greyback.style.transition = 'none';
			}
		};
  
		const drawerClosing = () => {
			document.body.style.overflow = 'auto';
			drawer.style.marginLeft = '-' + drawerwidth + 'px';
			drawer.style.opacity = '0';
			greyback.style.opacity = '0';
			setTimeout(() => {
				greyback.style.display = 'none';
			}, 225);
		};
  
		const drawerOpening = () => {
			document.body.style.overflow = 'hidden';
			drawer.style.marginLeft = '0px';
			drawer.style.opacity = '1';
			greyback.style.opacity = '1';
			greyback.style.display = 'block';
		};
  
		window.closeDrawer = bool => {
			if (!bool) {
				drawerTransition(true, 'out');
			}
			else {
				drawerTransition(false, false);
			}
			drawerwidth = drawer.offsetWidth;
			drawerClosing();
		};

		window.addEventListener('resize', (e) => {
			window.closeDrawer(true);
		});
  
		panel.addEventListener('touchstart', (e) => {

			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) e.preventDefault();

			let touchobj = e.changedTouches[0];
            
			drawerTransition(false, false);
            
			startx = parseInt(touchobj.clientX, 10);
			if (startx < 25 && document.getElementById('navbtn')) {
				this.setState({ opened: true });
				drawer.style.opacity = '1';
				greyback.style.opacity = '0';
				greyback.style.display = 'block';
				open = true;
			}
			else {
				open = false;
			}
		}, {
			passive: !(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
		});
  
		panel.addEventListener('touchmove', (e) => {

			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) e.preventDefault();

			let touchobj = e.changedTouches[0];
			let dist = parseInt(touchobj.clientX, 10) - startx;
			if (open) {
				document.body.style.overflow = 'hidden';
				drawerwidth = drawer.offsetWidth;
                
				if (dist <= drawerwidth) {
					drawer.style.marginLeft = dist - drawerwidth + 'px';
					greyback.style.opacity = dist / drawerwidth;
				}
			}
		}, {
			passive: !(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
		});
  
		panel.addEventListener('touchend', (e) => {

			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) e.preventDefault();

			drawerTransition(true, 'in');
			let touchobj = e.changedTouches[0]; // Der erste Finger der den Bildschirm berührt wird gezählt
			if (open) {
				if (touchobj.clientX > 95) {
					greyback.style.opacity = '1';
					drawer.style.marginLeft = '0px';
				}
				else {
					drawerClosing();
				}
			}
		}, {
			passive: !(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
		});
  
		greyback.addEventListener('touchstart', (e) => {

			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) e.preventDefault();

			drawerTransition(false, false);
			let touchobj = e.changedTouches[0]; // Der erste Finger der den Bildschirm berührt wird gezählt
			greybackstartx = parseInt(touchobj.clientX, 10);
		}, {
			passive: !(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
		});
        
		greyback.addEventListener('touchmove', (e) => {

			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) e.preventDefault();

			let touchobj = e.changedTouches[0];
			distgrey = parseInt(touchobj.clientX, 10) - greybackstartx;
			if (distgrey < 0) {
				drawerwidth = drawer.offsetWidth;
                
				drawer.style.marginLeft = distgrey + 'px';
				greyback.style.opacity = 1 - (Math.abs(distgrey / drawerwidth));
			}
		}, {
			passive: !(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
		});
        
		greyback.addEventListener('touchend', (e) => {

			if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) e.preventDefault();

			drawerwidth = drawer.offsetWidth;
            
			if (distgrey > -80) {
				drawerTransition(true, 'in');
				drawerOpening();
			}
			else {
				drawerTransition(true, 'out');
				drawerClosing();
			}
		}, {
			passive: !(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
		});
	}
    
	render() {
        
		return (
			<div>
				<nav class={style.nav} ref={(nav) => { this.drawer = nav; }} id="drawer" >

					<div class={style.drawerHeader} />

					<div class={style.drawerContent}>

						<div class={style.drawerSubContent} >

							<Link activeClassName="active" href="/" onClick={this.closeDrawer} tabindex="0"><div><span><i class="material-icons">home</i>Home</span></div></Link>
							<Link activeClassName="active" href="/settings" onClick={this.closeDrawer} tabindex="0"><div><span><i class="material-icons">settings</i>Settings</span></div></Link>
							<Link activeClassName="active" href="/about" onClick={this.closeDrawer} tabindex="0"><div><span><i class="material-icons">info</i>About</span></div></Link>
							<Link activeClassName="active" href="/donate" onClick={this.closeDrawer} tabindex="0"><div><span><i class="material-icons">favorite</i>Donate</span></div></Link>
							<a href="https://chrome.google.com/webstore/detail/slidecontrol/ghfjfgbiehcemjfapohnnfngcbappodg" rel="noopener noreferrer" target="_blank" tabindex="0"><div><span><i class="material-icons">extension</i>Get Extension</span></div></a>

						</div>

						<span class={style.credits}>SLIDECONTROL © {new Date().getFullYear()}<br />by Niels Kapeller & Marius Niveri</span>
					</div>

				</nav>
				<div class={style.drawerBack} onClick={this.closeDrawer} id="drawerback" />
			</div>
		);
	}
}