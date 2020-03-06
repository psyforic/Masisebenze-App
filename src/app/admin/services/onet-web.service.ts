import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OnetWebService {
  url;
  username;
  password;
  _config;
  constructor(
    private httpClient: HttpClient
  ) {
    this._config = {
      auth: {
        username: 'developmenthub',
        password: '2932dgy'
      }
    };
    this.set_version(null);
  }
  encode_query(query) {
    return Object.keys(query).map(function (key) {
      const nkey = encodeURIComponent(key);
      let vals = query[key];
      if (!Array.isArray(vals)) {
        vals = [query[key]];
      }
      return vals.map(function (value) {
        return nkey + '=' + encodeURIComponent(value);
      }).join('&');
    }).join('&');
  }
  set_version(version) {
    if (version === undefined || version === null) {
      this._config.baseURL = 'https://services.onetcenter.org/ws/';
    } else {
      this._config.baseURL = 'https://services.onetcenter.org/v' + version + '/ws/';
    }
  }
  call_fetch(url, callback) {
    // this._config.Authorization = 'Basic ' + btoa('developmenthub:2932dgy');
    // this._config.Accept = 'application/json';
    // this._config.Connection = 'keep-alive';
    // this._config.Dest = 'empty';
    // this._config.Mode = 'cors';
    // this._config.Encoding = 'gzip, deflate, br';
    this.httpClient.get(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic ',
      }
    })
      .pipe().subscribe(response => {
        console.log(response);
      });
  }
  call_xhr(url, callback) {

  }
  call(path, query, callback) {
    this.url = this._config.baseURL + path
      + '?client=' + encodeURIComponent(this._config.auth.username);
    if (query !== null && query !== undefined) {
      this.url += '&' + this.encode_query(query);
    }
    if (self.fetch) {
      this.call_fetch(this.url, callback);
    } else {
      this.call_xhr(this.url, callback);
    }
  }
}
