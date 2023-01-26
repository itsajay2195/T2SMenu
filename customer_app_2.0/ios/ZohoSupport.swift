//
//  ZendeskSupport.swift
//  CustomerApp
//
//  Created by Mohan on 08/06/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import UIKit
import Foundation
import ZohoDeskPortalKB
import ZohoDeskPortalCore
import ZohoDeskPortalCommunity
import ZohoDeskPortalTicket
import ZohoDeskPortalAPIKit
import ZohoDeskPortalConfiguration
import Mobilisten
@objc(ZohoSupport)
class ZohoSupport: RCTEventEmitter {

    override public static func requiresMainQueueSetup() -> Bool {
        return false;
    }
    @objc(constantsToExport)
    override func constantsToExport() -> [AnyHashable: Any] {
        return [:]
    }

    @objc(supportedEvents)
    override func supportedEvents() -> [String] {
        return []
    }


    // MARK: - Initialization
    @objc(initialize:)
    func initialize(config: [String: Any]) {
      guard
          let orgID = config["orgID"] as? String,
          let appID = config["appID"] as? String else { return }
      DispatchQueue.main.async {
        ZohoDeskPortalSDK.initialize(orgID:orgID, appID:appID, dataCenter: ZDPDataCenter.US)


      }
    }

    // MARK: - Indentification

    @objc(identifyJWT:)
    func identifyJWT(host: String?) {
       // guard let host = host else { return }
        //TODO ZOHO
    }

    @objc(logoutUser)
    func logoutUser() {
      DispatchQueue.main.async {
        ZohoDeskPortalSDK.clearAllLocalData()
      }
    }

    @objc(identifyAnonymous:email:)
    func identifyAnonymous(name: String?, email: String?) {
      //TODO ZOHO
    }

    // MARK: - UI Methods

    @objc(showHelpCenter:)
    func showHelpCenter(language: String) {
        DispatchQueue.main.async {
          ZDPortalKB.show();
        }
    }


  @objc(setPushNotificationToken:)
  func setPushNotificationToken(deviceToken: String) {
    DispatchQueue.main.async {
      ZohoDeskPortalSDK.enablePushNotification(deviceToken:deviceToken, mode: .production)
    }
  }

  func zohoSumbitTickets(emailAddress:String,name:String,phone:String, apiToken: String, departmentId : String){
    DispatchQueue.main.async {
    let field1 = ZDCustomizedTicketField(fieldName: "contactName", value: name, isEditable: false)
    let field2 = ZDCustomizedTicketField(fieldName: "email", value: emailAddress, isEditable: false)
    let field3 = ZDCustomizedTicketField(fieldName: "departmentId", value: departmentId, isEditable: false)
    let ticketForm = ZDCustomizedTicketForm(departmentId: departmentId, fields: [field1,field2,field3])
    let listofFiled = ZDVisibleTicketField(departmentId:  departmentId, fieldNames: ["subject","description"])
      ZDPortalSubmitTicket.setFieldsListTobeShown(fields: [listofFiled])
      ZDPortalSubmitTicket.preFillTicketFields(forForms: [ticketForm])
      ZDPortalSubmitTicket.show()
    }
  }


  @objc(showMyTicket:name:phone:apiToken:departmentId:)
  func showMyTicket(emailAddress:String,name:String,phone:String, apiToken: String, departmentId : String) {
      if !ZohoDeskPortalSDK.isUserLoggedIn {
          ZohoDeskPortalSDK.login(withUserToken: apiToken) { (isLoggedIn) in
            if isLoggedIn {
              DispatchQueue.main.async {
                ZDPortalTicket.show();
              }
            } else {
              self.zohoSumbitTickets(emailAddress: emailAddress, name: name, phone: phone, apiToken: apiToken, departmentId: departmentId)
            }
        }
      } else {
        DispatchQueue.main.async {
          ZDPortalTicket.show();
        }
      }
    }

  @objc(submitNewTicket:name:apiToken:subject:description:departmentId:)
  func submitNewTicket(emailAddress:String, name:String, apiToken:String, subject:String, description:String, departmentId : String) {
    var fields = ["subject": subject,"description": description, "departmentId": departmentId]
    print("ZOHO fields \(fields )")
      if !ZohoDeskPortalSDK.isUserLoggedIn {
          ZohoDeskPortalSDK.login(withUserToken: apiToken) { (isLoggedIn) in
            if isLoggedIn {
              self.handleSubmitNewTicket(withFields: fields)
            } else {
              fields["contactName"] = name
              fields["email"] = emailAddress
              self.handleSubmitNewTicket(withFields: fields)
            }
        }
      } else {
        self.handleSubmitNewTicket(withFields: fields)
      }
    }

  func handleSubmitNewTicket(withFields:[String : Any]) {

    if ZohoDeskPortalSDK.isUserLoggedIn {
      ZohoDeskPortalSDK.Ticket.add(withFields: withFields) { (ticket, error) in
//        print("ZOHO ticket \(ticket )")
//        print("ZOHO error \(error )")
           // on success, ticket will return an object, error will return nil
           // on failure, error will return a value, ticket will return nil
        }
    } else {
        ZohoDeskPortalSDK.Ticket.addAsGuest(withFields: withFields) { (ticketNumber, error) in
//          print("ZOHO guest ticketNumber \(ticketNumber )")
//          print("ZOHO guest error \(error )")
           // on success, ticketNumber will return a string value, error will return nil
           // on failure, error will return a value, ticketNumber will return nil
       }
    }
  }

  @objc(showNewTicket:name:phone:apiToken:departmentId:)
  func showNewTicket(emailAddress:String,name:String,phone:String, apiToken: String, departmentId : String) {
      if !ZohoDeskPortalSDK.isUserLoggedIn {
          ZohoDeskPortalSDK.login(withUserToken: apiToken) { (isLoggedIn) in
            if isLoggedIn {
              self.zohoSumbitTickets(emailAddress: emailAddress, name: name, phone: phone, apiToken: apiToken, departmentId: departmentId)
            } else {
              self.zohoSumbitTickets(emailAddress: emailAddress, name: name, phone: phone, apiToken: apiToken, departmentId: departmentId)
            }
        }
      } else {
        self.zohoSumbitTickets(emailAddress: emailAddress, name: name, phone: phone, apiToken: apiToken, departmentId: departmentId)
      }
  }

}
