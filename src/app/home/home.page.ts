import { Component, ViewChild, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { PopoverController, IonSearchbar } from '@ionic/angular';

import { MenuComponent } from '../components/menu/menu.component';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { environment } from 'src/environments/environment';
import { UtilityService } from '../services/utility.service';
import { PostsService } from '../services/posts.service';
import { element } from 'protractor';

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
  geoOptions = {
    enableHighAccuracy: true,
    timeout: 30000
  };

  searchVal: string;
  searchRes;
  popularRoadArr = [
    {
      name: 'Adigbe Central betweek Onikoko to Obada Road', lat: 7.122788, lng: 3.321929
    },
    {
      name: 'Apo Village Quarry Roundabout', lat: 7.135632, lng: 3.321669
    },
    {
      name: 'Intersect of Oba Gbadebo Road and Central Bank Road of GtB Station toward Kuto', lat: 7.136041, lng: 3.345862
    },
    {
      name: 'Isale Igbein axia to Sapon', lat: 7.147450, lng: 3.342485
    },
    {
      name: 'Ita-Oshin Roundabout to Lagos Abeokuta Express Way', lat: 7.135626, lng: 3.307648
    },
    {
      name: 'Kuto Roundabout', lat: 7.134915, lng: 3.351068
    },
    {
      name: 'Lafenwa Rounabout', lat: 7.151208, lng: 3.322883
    },
    {
      name: 'Lafenwa to Aiyetor Road Abeokuta', lat: 7.155983, lng: 3.325798
    },
    {
      name: 'Nawairu Deen Okeyeke Road ', lat: 7.147903, lng: 3.348764
    },
    {
      name: 'Oba Olawale Axis Central to Akinolugbade, Ita Iyalode, & Ita-Eko', lat:  7.147586, lng: 3.328722
    },
    {
      name: 'Onikolobo Road Panseke', lat: 7.135180, lng: 3.331755
    },
    {
      name: 'Opic Roundabout Oke-Ilewo', lat: 7.134996, lng: 3.339283
    },
  ];

  constructor(
    private renderer: Renderer2,
    private utilityService: UtilityService,
    private popoverController: PopoverController,
    private postService: PostsService,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.searchVal = '';
  }

  ngAfterViewInit() {
    this.InitializeMap();
  }

  InitializeMap() {
    this.geolocation.getCurrentPosition(this.geoOptions).then(
      resp => {
        this.getGoogleMaps()
          .then(googleMaps => {
            this.googleMaps = googleMaps;

            // const latLng = new googleMaps.LatLng(
            //   '7.1183',
            //   '3.3742'
            // );
            const latLng = new googleMaps.LatLng(
              resp.coords.latitude,
              resp.coords.longitude
            );

            const mapOptions = {
              center: latLng,
              zoom: 18,
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
    ).catch((error) => {
      this.utilityService.presentToast(
        error,
        4000,
        true,
        'danger');
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

  resetMap() {
    this.geolocation.getCurrentPosition(this.geoOptions).then(
      resp => {
        if (this.map) {
          this.map.setCenter(
            {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
            }
          );
        } else {
          this.utilityService.presentToast(
            'Map is not properly loaded. Please retry!',
            2000,
            true,
            'danger'
          );
        }
      }
    ).catch((error) => {
      this.utilityService.presentToast(
        error,
        4000,
        true,
        'danger');
    });
  }

  setMapLocation(lat, lng, name) {
    this.searchRes = null;
    this.searchVal = name;
    if (this.map) {
      this.map.setCenter(
        {
          lat,
          lng
        }
      );
    } else {
      this.utilityService.presentToast(
        'Map is not properly loaded. Please retry!',
        2000,
        true,
        'danger'
      );
    }
  }

  searhPopularRoad(ev) {
    this.searchRes = [];
    this.searchVal = ev.detail.value;
    if (this.searchVal) {
      this.searchRes = this.popularRoadArr.filter(
        (el) => {
          return el.name.toLocaleLowerCase().indexOf(this.searchVal.toLocaleLowerCase()) !== -1;
        }
      );
    }
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
