import { Component, ViewChild, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilityService } from '../services/utility.service';
import { PopoverController } from '@ionic/angular';
import { MenuComponent } from '../components/menu/menu.component';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  // Map Variables
  @ViewChild('map', {static: false}) mapElementRef: ElementRef;
  map: any;
  googleMaps: any;

  constructor(
    private renderer: Renderer2,
    private utilityService: UtilityService,
    private popoverController: PopoverController,
    private postService: PostsService
  ) {}

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.InitializeMap();
  }

  InitializeMap() {
    this.getGoogleMaps()
      .then(googleMaps => {
        this.googleMaps = googleMaps;

        const latLng = new googleMaps.LatLng(
          '7.1183',
          '3.3742'
        );

        const mapOptions = {
          center: latLng,
          zoom: 16,
          mapTypeId: googleMaps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          mapTypeControl: false,
          disableDoubleClickZoom: true,
          streetViewControl: false
        };
        const mapEl = this.mapElementRef.nativeElement;
        this.map = new googleMaps.Map(mapEl, mapOptions);
        this.map.setTilt(270);
        const trafficLayer = new googleMaps.TrafficLayer();
        trafficLayer.setMap(this.map);

        this.googleMaps.event.addListenerOnce(this.map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
      }).catch(err => {
        this.utilityService.presentToast(
          err,
          4000,
          true,
          'danger'
        );
      });
  }

  async openMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=${environment.googleApiKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }

}
