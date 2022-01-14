"use strict";
import { AsyncStorage } from "react-native";
import Home from "../Screens/Home";
var axios = require("axios");
var cached_listings = undefined;

function wrapStore(json) {
  return new Store(json);
}

class Client {
  constructor(baseUri, key) {
    this.apiBase = baseUri;
    this.apiKey = key;
    this.clearRemoteState();
  }

  getSessionId() {
    return this.sessionId;
  }

  setSessionExpiryCallback(callback) {
    this.sessionExpiryCallback = callback;
  }

  async call(service, args) {
    var options = { ApiKey: this.apiKey, Version: 1 };

    if (args != undefined) options.Arguments = args;
    else options.Arguments = [];

    var request = {
      method: "POST",
      url: this.apiBase + service,
      data: options,
    };

    if (this.sessionId) request["headers"] = { cookie: this.sessionId };
    // console.log("REQUEST : ", request);
    return await axios(request).then((r) => {
      if (r.headers["set-cookie"]) {
        console.log(
          "RESPONSE WITH COOKIE :",
          JSON.stringify(r.headers["set-cookie"])
        );
        var cookie = r.headers["set-cookie"];
        cookie = cookie[0].split(" ");
        cookie = cookie[0];
        cookie = cookie.substring(0, cookie.length - 1);

        if (this.sessionId && this.sessionExpiryCallback) {
          // Server indicated that the session has been recreated and is now empty
          this.clearRemoteState();
          this.sessionExpiryCallback();
        }

        this.sessionId = cookie;
        AsyncStorage.setItem("session", cookie);
        console.log("Session ID :" + this.sessionId);
      }
      return r.data.Return;
    });
  }

  getRemoteState(key) {
    return this.remoteState[key];
  }

  setRemoteState(key, value) {
    this.remoteState[key] = value;
  }

  deleteRemoteState(key) {
    delete this.remoteState[key];
  }

  clearRemoteState() {
    this.remoteState = {};
  }
}

class DriverService {
  constructor(client) {
    this.client = client;
  }

  static getRemoteDriver(client) {
    return client.getRemoteState("DriverService.SessionDriver");
  }

  async logIn(username, password) {
    this.client.deleteRemoteState("DriverService.SessionDriver");
    const customer = await this.client.call("HappyEater.DriverService/LogIn", [
      username,
      password,
    ]);
    this.client.setRemoteState("DriverService.SessionDriver", customer);
    return customer;
  }

  async logOut() {
    this.client.deleteRemoteState("DriverService.SessionDriver");
    await this.client.call("HappyEater.DriverService/LogOut", []);
  }

  async getAvailableOrders() {
    return await this.client.call(
      "HappyEater.DriverService/GetAvailableOrders",
      []
    );
  }

  async getActiveOrders() {
    return await this.client.call(
      "HappyEater.DriverService/GetActiveOrders",
      []
    );
  }

  async getCompletedOrders() {
    return await this.client.call(
      "HappyEater.DriverService/GetCompletedOrders",
      []
    );
  }

  async claimOrder(orderId) {
    return await this.client.call("HappyEater.DriverService/ClaimOrder", [
      orderId,
    ]);
  }

  async unclaimOrder(orderId) {
    return await this.client.call("HappyEater.DriverService/UnclaimOrder", [
      orderId,
    ]);
  }

  async dispatchOrder(orderId) {
    return await this.client.call("HappyEater.DriverService/DispatchOrder", [
      orderId,
    ]);
  }

  async completeOrder(orderId) {
    return await this.client.call("HappyEater.DriverService/CompleteOrder", [
      orderId,
    ]);
  }

  async RegisterAPK(ntfID) {
    return await this.client.call("HappyEater.DriverService/RegisterAPK", [
      ntfID,
    ]);
  }
}

class DataService {
  constructor(client) {
    this.client = client;
  }

  async getStoresByLocation(postcode, distance) {
    var listings = await this.client
      .call("HappyEater.DataService/GetStoresByLocation", [postcode, distance])
      .then((r) => r.map((l) => wrapStore(l)));
    listings.sort((a, b) => a.Extensions.Distance - b.Extensions.Distance);
    return listings;
  }

  async getStoresAll() {
    var listings;

    if (cached_listings != undefined) listings = cached_listings;

    if (listings == null || listings == undefined) {
      listings = await this.client
        .call("HappyEater.DataService/GetStoresAll", [])
        .then((r) => r.map((l) => wrapStore(l)));
    }

    return listings;
  }

  async getStoreById(storeId) {
    var listing;

    if (cached_listings != undefined)
      listing = cached_listings.find((l) => l.Id == storeId);

    if (listing == null || listing == undefined) {
      listing = await this.client
        .call("HappyEater.DataService/GetStoreById", [storeId])
        .then((l) => wrapStore(l));
    }

    return listing;
  }

  async getCategoriesAll(storeId) {
    return await this.client.call("HappyEater.DataService/GetCategoriesAll", [
      storeId,
    ]);
  }

  async getProductsAll(storeId) {
    return await this.client.call("HappyEater.DataService/GetProductsAll", [
      storeId,
    ]);
  }

  async getProductById(storeId, id) {
    return await this.client.call("HappyEater.DataService/GetProductById", [
      storeId,
      id,
    ]);
  }

  async getProductsByGroupId(storeId, groupId) {
    return await this.client.call(
      "HappyEater.DataService/getProductsByGroupId",
      [storeId, groupId]
    );
  }

  async getGroupsAll(storeId) {
    return await this.client.call("HappyEater.DataService/GetGroupsAll", [
      storeId,
    ]);
  }

  async getGroupById(storeId, id) {
    return await this.client.call("HappyEater.DataService/GetGroupById", [
      storeId,
      id,
    ]);
  }

  async reset(secret) {
    return await this.client.call("HappyEater.DataService/Reset", [secret]);
  }
}

class Store {
  constructor(json) {
    Object.assign(this, json);
    this.openingTimes = new OpeningTimes(json.OpeningTimes);
    this.flags = json.Flags;
    this.allowedTypes = json.AllowedTypes;
  }

  isDemo() {
    return this.flags.indexOf(1 << 16) > -1;
  }

  isFeatured() {
    return this.flags.indexOf(1 << 0) > -1;
  }

  isPopular() {
    return this.flags.indexOf(1 << 1) > -1;
  }

  isForceClosed() {
    return this.flags.indexOf(1 << 4) > -1;
  }

  isOpen(now) {
    return !this.isForceClosed() && this.openingTimes.isOpen(now);
  }

  allowDelivery() {
    if (!this.allowedTypes) return true;
    return this.allowedTypes.indexOf(0) > -1;
  }

  allowCollection() {
    if (!this.allowedTypes) return true;
    return this.allowedTypes.indexOf(1) > -1;
  }
}

class OpeningTimes {
  constructor(json) {
    this.monday = json.Monday;
    this.tuesday = json.Tuesday;
    this.wednesday = json.Wednesday;
    this.thursday = json.Thursday;
    this.friday = json.Friday;
    this.saturday = json.Saturday;
    this.sunday = json.Sunday;
    this.exceptions = json.Exceptions;
  }

  isOpen(now) {
    const zone = "Europe/London"; // Zone should really come the geographical location of the store we're testing

    if (!now) now = moment();
    else now = moment(now);

    const localNow = moment.tz(now, zone);
    const dayData = this.getDay(localNow.toDate());
    const dayTime = dayData.Times[0];

    if (
      dayTime.StartHour == dayTime.EndHour &&
      dayTime.StartMinute == dayTime.EndMinute
    )
      return false;

    let openTime = moment.tz(
      {
        year: localNow.year(),
        month: localNow.month(),
        day: localNow.date(),
        hour: dayTime.StartHour,
        minute: dayTime.StartMinute,
      },
      zone
    );

    let closeTime = moment.tz(
      {
        year: localNow.year(),
        month: localNow.month(),
        day: localNow.date(),
        hour: dayTime.EndHour,
        minute: dayTime.EndMinute,
      },
      zone
    );

    // Avoid wrapping
    if (closeTime < openTime) {
      if (localNow.hour() < closeTime.hour()) openTime.add(-1, "day");
      else closeTime.add(1, "day");
    }

    return localNow > openTime && localNow < closeTime;
  }

  getDay(now) {
    if (!now) now = new Date();

    // Hard-coded 5am trading day cutoff
    let almostNow = new Date(now);
    almostNow.setHours(now.getHours() - 5);

    const day = now.getDay();
    let dayData = null;

    if (day == 0) dayData = this.sunday;
    else if (day == 1) dayData = this.monday;
    else if (day == 2) dayData = this.tuesday;
    else if (day == 3) dayData = this.wednesday;
    else if (day == 4) dayData = this.thursday;
    else if (day == 5) dayData = this.friday;
    else if (day == 6) dayData = this.saturday;

    return dayData;
  }
}

module.exports = {
  Client: Client,
  DriverService: DriverService,
  DataService: DataService,
};
